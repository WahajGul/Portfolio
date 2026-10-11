import { useEffect, useRef, useState } from "react";
import { getProfile } from "../api";
import { useAsync } from "../hooks/useAsync";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Navbar.module.css";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export const Navbar = () => {
  // The monogram is derived from data, never hardcoded in the component.
  const { data: profile } = useAsync(getProfile);
  const [activeId, setActiveId] = useState<string | null>(null);
  const visible = useRef<Set<string>>(new Set());

  useEffect(() => {
    const visibleIds = visible.current;
    const sections = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleIds.add(entry.target.id);
          else visibleIds.delete(entry.target.id);
        }
        // SECTIONS is in document order, so the first visible one is the topmost.
        const first = SECTIONS.find(({ id }) => visibleIds.has(id));
        setActiveId(first ? first.id : null);
      },
      // A section is active while it sits in the band below the 56px bar and
      // above the lower 55% of the viewport.
      { rootMargin: "-72px 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      visibleIds.clear();
    };
  }, []);

  const monogram = profile
    ? profile.name
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
    : "";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Decorative: the hero h1 already carries the name to assistive tech. */}
        <span className={styles.logo} aria-hidden="true">
          {monogram}
        </span>
        <nav aria-label="Sections">
          <ul className={styles.links}>
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={`${styles.link} ${activeId === id ? styles.linkActive : ""}`}
                  aria-current={activeId === id ? "location" : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.toggleSlot}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
