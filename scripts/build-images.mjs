#!/usr/bin/env node
/*
 * Screenshot pipeline: assets-src/ -> public/images/
 *
 * For every original `assets-src/<id>.png` this writes three WebP candidates —
 * `<id>-480.webp`, `<id>-768.webp`, `<id>-1200.webp` — which is exactly what the
 * `{w}` template in `projects.json` expands to. An optional phone-shaped
 * original `assets-src/<id>-mobile.png` writes `<id>-mobile-<width>.webp` the
 * same way and is served below 768px by a <picture> source.
 *
 * Cropping: every candidate is 16:10. The crop is anchored to the TOP, never
 * centred, so an app header and nav survive. A source that is already 16:10
 * (within 1px) is not cropped at all, only resized.
 *
 * Run with `npm run images`. Outputs are committed, so a static deploy needs no
 * build-time image step.
 */

import { mkdir, readdir, stat } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SOURCE_DIR = "assets-src";
const OUTPUT_DIR = "public/images";

/** Widths the data's `{w}` template expands to. */
const WIDTHS = [480, 768, 1200];

const QUALITY = 80;

/** Every screenshot, in the grid and in the detail panel, is 16:10. */
const ASPECT = 16 / 10;

/** A source within this many pixels of 16:10 is treated as already 16:10. */
const ASPECT_SLACK = 1;

const SUPPORTED = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

/** Prints a left-aligned table with the columns padded to a fixed width. */
const printTable = (headers, rows) => {
  const widths = headers.map((header, column) =>
    Math.max(header.length, ...rows.map((row) => String(row[column]).length)),
  );
  const line = (cells) =>
    cells.map((cell, column) => String(cell).padEnd(widths[column])).join("  ");
  console.log(line(headers));
  console.log(line(widths.map((width) => "-".repeat(width))));
  for (const row of rows) console.log(line(row));
};

/**
 * The largest 16:10 region of the source, anchored to the top. A source that is
 * wider than 16:10 is trimmed at the sides (kept centred); a source that is
 * taller loses the bottom.
 */
const cropRegion = (width, height) => {
  const alreadyTarget =
    Math.abs(width - height * ASPECT) <= ASPECT_SLACK &&
    Math.abs(height - width / ASPECT) <= ASPECT_SLACK;
  if (alreadyTarget) return null;

  if (width / height > ASPECT) {
    const regionWidth = Math.min(width, Math.round(height * ASPECT));
    return { left: Math.floor((width - regionWidth) / 2), top: 0, width: regionWidth, height };
  }

  const regionHeight = Math.min(height, Math.round(width / ASPECT));
  return { left: 0, top: 0, width, height: regionHeight };
};

const isUpToDate = async (source, outputs) => {
  const sourceTime = (await stat(source)).mtimeMs;
  for (const output of outputs) {
    try {
      if ((await stat(output)).mtimeMs < sourceTime) return false;
    } catch {
      return false;
    }
  }
  return true;
};

const renderOne = async (source, name) => {
  const outputs = WIDTHS.map((width) => join(OUTPUT_DIR, `${name}-${width}.webp`));

  if (await isUpToDate(source, outputs)) {
    return { source, name, skipped: true, outputs };
  }

  const { width, height, format } = await sharp(source).metadata();
  if (width === undefined || height === undefined) {
    throw new Error(`${source}: could not read image dimensions`);
  }

  const region = cropRegion(width, height);
  const written = [];

  for (const [index, target] of WIDTHS.entries()) {
    // A source smaller than a target is enlarged: the `{w}` template must never
    // have a hole, whatever the original's size.
    let pipeline = sharp(source);
    if (region !== null) pipeline = pipeline.extract(region);
    pipeline = pipeline.resize({ width: target });

    const info = await pipeline
      .webp({ quality: QUALITY })
      .toFile(outputs[index]);
    written.push({ width: target, bytes: info.size });
  }

  return {
    source,
    name,
    skipped: false,
    outputs,
    sourceSize: `${width}x${height}`,
    region: region === null ? "16:10 already" : `crop ${region.width}x${region.height} at top`,
    format,
    written,
  };
};

const main = async () => {
  let entries;
  try {
    entries = await readdir(SOURCE_DIR);
  } catch {
    console.error(
      `${SOURCE_DIR}/ not found. Add originals named after each project id (${SOURCE_DIR}/<id>.png) and run again.`,
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  // Dotfiles such as .DS_Store are noise, not data; anything else that is not a
  // supported image is a mistake worth failing on rather than skipping silently.
  const files = [];
  const rejected = [];
  for (const entry of entries.sort()) {
    if (entry.startsWith(".")) continue;
    const extension = extname(entry).toLowerCase();
    if (SUPPORTED.has(extension)) {
      files.push({ file: join(SOURCE_DIR, entry), name: basename(entry, extname(entry)) });
    } else {
      rejected.push(entry);
    }
  }

  if (files.length === 0) {
    console.log(`No images found in ${SOURCE_DIR}/.`);
  }

  const rows = [];
  const failures = [];

  for (const { file, name } of files) {
    try {
      const result = await renderOne(file, name);
      if (result.skipped) {
        rows.push([result.name, "-", "up to date", "-"]);
        continue;
      }
      for (const output of result.written) {
        rows.push([
          result.name,
          output.width === result.written[0].width ? result.sourceSize : "",
          output.width === result.written[0].width ? result.region : "",
          `${output.width}px  ${kb(output.bytes)}`,
        ]);
      }
    } catch (error) {
      failures.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (rows.length > 0) {
    console.log("");
    printTable(["name", "source", "crop", "written"], rows);
  }

  for (const entry of rejected) {
    failures.push(
      `${join(SOURCE_DIR, entry)}: unsupported format (use png, jpg, jpeg, webp, or avif)`,
    );
  }

  if (failures.length > 0) {
    console.error("");
    for (const failure of failures) console.error(`error: ${failure}`);
    console.error(`\n${failures.length} file(s) failed; no candidates were written for them.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nDone. ${WIDTHS.join("/")}px WebP written to ${OUTPUT_DIR}/.`);
};

await main();
