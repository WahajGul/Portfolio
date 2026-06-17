# AGENTS.md

Personal portfolio website for **Wahaj Gul** — Full-Stack Developer.

## Tech Stack

- **Framework**: React 19 + Vite 6
- **Animations**: GSAP (with ScrollTrigger plugin)
- **Icons**: Phosphor Icons
- **Styling**: CSS with custom properties (no Tailwind)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Architecture

```
src/
├── context/PortfolioContext.jsx   Global state for skills & projects
├── hooks/useScrollAnimations.js   GSAP scroll-triggered reveal hook
├── components/
│   ├── layout/                    Navbar, Layout
│   ├── sections/                  Loading, Hero, About, Skills, Projects, Experience, Contact
│   └── shared/                    Button, SectionTitle
```

- **PortfolioContext** provides `skills` and `projects` arrays with `addSkill`, `removeSkill`, `addProject`, `removeProject` for dynamic content management. Modify default data in `src/context/PortfolioContext.jsx`.
- All hover effects use CSS transitions (`.skill-card:hover`, `.project-card:hover`) — do not add JS event handlers.
- GSAP `useScrollAnimations` hook handles section fade-in on scroll. Usage: `useScrollAnimations(ref, { once: false })`.
- Loading screen uses GSAP timeline; `onComplete` callback triggers after progress bar animation.
- Navbar is fixed with backdrop blur on scroll; mobile toggle is CSS-controlled.

## Conventions

- **CSS variables** defined in `src/index.css` under `:root` (--bg-primary, --accent, etc.)
- **File structure**: one component per file, named exports for hooks/context only
- **Phosphor Icons**: import from `phosphor-icons/react`, use `<Icon size={20} weight="bold" />`
- **Sections** are full-width with `max-width: 1200px` centered layout
- **No routing** — single page with anchor-based navigation (`#about`, `#projects`, etc.)
