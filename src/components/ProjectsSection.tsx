import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { getProjects } from "../api";
import { useAsync } from "../hooks/useAsync";
import type { Project } from "../types";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectRow, type PlateSpan } from "./ProjectRow";
import { EmptyState } from "./states/EmptyState";
import { ErrorState } from "./states/ErrorState";
import styles from "./ProjectsSection.module.css";

/* The grid holds at most four featured projects. Everything else — the
   non-featured projects, plus any featured ones past this cap — lives in the
   More-projects list, so a large data file can never bury the best work. */
const GRID_LIMIT = 4;

/* Chips are noise until there is enough in the ledger to filter. */
const CHIP_MINIMUM = 5;

/**
 * Spans for the visible set, recomputed whenever that set changes so no row is
 * ever left with one orphaned half-width plate:
 * 1 -> full; 2 -> full, full; 3 -> full, half, half; 4 -> full, half, half, full.
 */
const spanPattern = (count: number): PlateSpan[] =>
  Array.from({ length: count }, (_, index) => {
    if (index === 0) return "full";
    const hasPartner = index + 1 <= count - 1;
    return index % 2 === 1 && !hasPartner ? "full" : "half";
  });

// Loading reserves roughly the shape of the loaded section — one plate with its
// 16:10 box, then two compact rows — so data landing does not shove the page
// down. Flat fills only; nothing shimmers, because nothing loops.
const ProjectsSkeleton = () => (
  <div aria-hidden="true">
    <div className={styles.skeletonPlate}>
      <span className={`${styles.skelBar} ${styles.skelImage}`} />
      <span className={`${styles.skelBar} ${styles.skelTitle}`} />
      <span className={styles.skelBar} />
      <span className={`${styles.skelBar} ${styles.skelNarrow}`} />
    </div>
    {[0, 1].map((row) => (
      <div className={styles.skeletonRow} key={row}>
        <span className={`${styles.skelBar} ${styles.skelTitleSmall}`} />
        <span className={`${styles.skelBar} ${styles.skelNarrow}`} />
      </div>
    ))}
  </div>
);

export const ProjectsSection = () => {
  const { data: projects, loading, error } = useAsync(getProjects);
  const [filter, setFilter] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  // The control that opened the panel, so focus can be handed back to it. It is
  // state rather than a ref because the panel receives it as a prop.
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  const list = projects ?? [];
  // Chips are derived — never hardcoded — from every stack string in first-seen
  // order, and only when the ledger is long enough to filter.
  const techs = list
    .flatMap((project) => project.stack)
    .filter((tech, index, all) => all.indexOf(tech) === index);

  const matching = filter === null ? list : list.filter((p) => p.stack.includes(filter));
  const grid = matching.filter((p) => p.featured === true).slice(0, GRID_LIMIT);
  const more = matching.filter((p) => !grid.includes(p));
  const spans = spanPattern(grid.length);
  const filtering = filter !== null;
  // While a filter is active the long tail is part of the answer, so it stays
  // open instead of hiding behind a collapsed control.
  const moreExpanded = moreOpen || filtering;
  const openProject = list.find((project) => project.id === openId) ?? null;

  const openPanel = (project: Project, element: HTMLElement | null): void => {
    setTrigger(element);
    setOpenId(project.id);
  };

  return (
    <section id="projects" aria-labelledby="projects-heading" aria-busy={loading}>
      <h2 id="projects-heading" className="section-heading">
        Projects
      </h2>

      {loading && <ProjectsSkeleton />}
      {error !== null && <ErrorState />}

      {!loading && error === null && (
        <>
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {list.length >= CHIP_MINIMUM && (
                <div
                  className={styles.chips}
                  role="group"
                  aria-label="Filter projects by technology"
                >
                  <button
                    type="button"
                    className={`${styles.chip} ${filter === null ? styles.chipSelected : ""}`}
                    aria-pressed={filter === null}
                    onClick={() => setFilter(null)}
                  >
                    All
                  </button>
                  {techs.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      className={`${styles.chip} ${filter === tech ? styles.chipSelected : ""}`}
                      aria-pressed={filter === tech}
                      onClick={() => setFilter(tech)}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              )}

              {grid.length > 0 && (
                <div className={styles.grid}>
                  {/* popLayout takes an exiting plate out of flow in the same
                      frame, so the rest glide to their new spans immediately. */}
                  <AnimatePresence mode="popLayout">
                    {grid.map((project, index) => (
                      <ProjectRow
                        key={project.id}
                        project={project}
                        span={spans[index]}
                        lead={index === 0}
                        index={index}
                        onOpen={openPanel}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {matching.length === 0 && (
                <p className={styles.noMatches}>
                  No projects match {filter}. Choose All to see every project.
                </p>
              )}

              {more.length > 0 && (
                <>
                  {filtering ? (
                    <h3 className={styles.moreHeading}>Other projects</h3>
                  ) : (
                    <button
                      type="button"
                      className={styles.expander}
                      aria-expanded={moreOpen}
                      aria-controls="more-projects"
                      onClick={() => setMoreOpen((open) => !open)}
                    >
                      {moreOpen
                        ? `Hide more projects (${more.length})`
                        : `More projects (${more.length})`}
                    </button>
                  )}

                  {moreExpanded && (
                    <div id="more-projects" className={styles.moreList}>
                      {more.map((project, index) => (
                        <ProjectRow
                          key={project.id}
                          project={project}
                          variant="row"
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* The panel is mounted only while it is open, so the shared-element morph
          always travels between the plate and a freshly mounted panel. */}
      {openProject !== null && (
        <ProjectDetail
          project={openProject}
          trigger={trigger}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
};
