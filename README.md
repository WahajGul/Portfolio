# Wahaj Gul — Portfolio

Personal portfolio website built with React, Vite, and GSAP.

## Tech Stack

- **React 19** — UI framework
- **Vite 6** — build tool and dev server
- **GSAP** — scroll-triggered animations and loading screen
- **react-icons** — icon library (Phosphor, Font Awesome, Simple Icons)
- **CSS custom properties** — theming with no external CSS framework

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Structure

```
src/
├── context/PortfolioContext.jsx   Global state for skills & projects
├── hooks/useScrollAnimations.js   GSAP ScrollTrigger reveal hook
├── components/
│   ├── layout/                    Navbar, Layout
│   ├── sections/                  Loading, Hero, About, Skills, Projects, Experience, Contact
│   └── shared/                    Button, SectionTitle
```

- **Dynamic content**: Edit default skills/projects in `src/context/PortfolioContext.jsx` or use the `addSkill`/`removeSkill`/`addProject`/`removeProject` helpers.
- **Sections** are full-width with `max-width: 1200px` centered content.
- **Animations** use GSAP; hover effects use CSS transitions.
- **Single page** — anchor-based navigation (`#about`, `#projects`, etc.).
