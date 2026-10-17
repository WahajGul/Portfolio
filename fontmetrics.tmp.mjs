import { open } from "fontkit";

// Arial reference constants (hhea/OS-2, unitsPerEm 2048)
const Arial = { upem: 2048, ascent: 1854, descent: -434, lineGap: 67, xHeight: 1062 };

const files = [
  ["Bricolage 600", "public/fonts/bricolage-grotesque-600-latin.woff2"],
  ["Bricolage 700", "public/fonts/bricolage-grotesque-700-latin.woff2"],
  ["PublicSans 400", "public/fonts/public-sans-400-latin.woff2"],
  ["PublicSans 600", "public/fonts/public-sans-600-latin.woff2"],
];

const r3 = (n) => Math.round(n * 1000) / 1000;
const pct = (n) => r3(n * 100) + "%";
const arialX = Arial.xHeight / Arial.upem;

for (const [label, path] of files) {
  const f = await open(path);
  const upem = f.unitsPerEm;
  const os2 = f["OS/2"];
  const x = os2 && os2.xHeight ? os2.xHeight : null;
  const sizeAdjust = x ? x / upem / arialX : 1;
  console.log(
    JSON.stringify({
      label,
      upem,
      ascent: f.ascent,
      descent: f.descent,
      lineGap: f.lineGap,
      xHeight: x,
      computed: {
        "size-adjust": pct(sizeAdjust),
        "ascent-override": pct(f.ascent / upem / sizeAdjust),
        "descent-override": pct(-f.descent / upem / sizeAdjust),
        "line-gap-override": pct(f.lineGap / upem / sizeAdjust),
      },
    }),
  );
}
