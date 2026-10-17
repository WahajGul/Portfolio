# AGENTS.md: React + TypeScript Portfolio (Phase 1, built to grow into full stack)

Read this file fully before every task. If a request conflicts with it, say so and ask.

## Goal
A personal portfolio for a React developer who is learning backend (Node, Docker, Linux, React Native). It must look deliberate and professional, animate with intent, and let me add or remove Projects, Skills, and Contacts by editing data only. In Phase 3 the data will come from my own API, so the UI must not change when that happens.

The audience is a recruiter or engineering manager who spends roughly 15 seconds on the first screen. The first screen must answer: who is this, what do they build, what are they looking for, and where is the proof.

## Stack (do not add anything beyond this without asking)
- Vite + React 19 + **TypeScript** (`strict: true`). All components are `.tsx`, all hooks and utilities are `.ts`. No `any`. No `@ts-ignore`.
- Plain CSS with CSS variables (CSS Modules allowed, named `*.module.css`). No Tailwind unless I ask.
- Framer Motion for animation (the only animation library), loaded with `LazyMotion` and `domMax` at the first idle moment after the first commit, never before it. The hero entrance is CSS keyframes, not Framer.
- `sharp` as a dev dependency, used only by `scripts/build-images.mjs`.
- No UI kits (no MUI, Chakra, shadcn, etc.).
- Icons: `lucide-react` only, and only where an icon carries meaning (external link, copy, theme toggle, a contact channel). No decorative icons.
- Deploy target: Vercel or Netlify (static).

## Folder structure (create exactly this)
```
src/
├── api/
│   └── index.ts          # the ONLY file that knows where data comes from
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProjectsSection.tsx
│   ├── ProjectRow.tsx     # one project plate, with its own live and code links
│   ├── ProjectDetail.tsx  # the native-dialog detail panel (shared element)
│   ├── SkillsSection.tsx
│   ├── ContactSection.tsx
│   ├── ThemeToggle.tsx
│   └── states/           # Loading.tsx, ErrorState.tsx, EmptyState.tsx
├── context/
│   └── ThemeContext.tsx
├── data/
│   ├── profile.json
│   ├── projects.json
│   ├── skills.json
│   └── contacts.json
├── hooks/
│   ├── useAsync.ts       # generic: { data, loading, error }
│   ├── useProjects.ts
│   ├── useSkills.ts
│   └── useContacts.ts
├── lib/
│   └── motion.ts         # shared Framer Motion variants, easing, durations
├── styles/
│   ├── tokens.css        # colors, type scale, spacing, motion durations
│   └── global.css
├── types.ts              # Profile, Project, SkillGroup, Contact, ProjectStatus
├── App.tsx
└── main.tsx

scripts/
└── build-images.mjs      # sharp pipeline: assets-src/ -> public/images/ at 480, 768, 1200w

assets-src/               # screenshot originals (the script's input, not shipped)
public/images/            # generated WebP widths, named to the {w} template
```
Enable `resolveJsonModule` in `tsconfig`. Also write `DESIGN.md` and `REFERENCES.md` in the project root (see Process).

## Types (src/types.ts)
```ts
export type ProjectStatus = "live" | "in-progress" | "planned";

export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  highlights?: string[];
  live?: string;
  repo?: string;
  image?: string;
  imageAlt?: string;
  imageMobile?: string;
  demo?: string;
  status: ProjectStatus;
  featured?: boolean;
}

export interface SkillGroup { group: string; items: string[]; }

export interface Contact {
  id: string;
  label: string;
  value: string;
  href: string;
  icon?: string;
}

export interface Profile {
  name: string;
  headline: string;
  bio: string;
  currentlyLearning?: string;
  resumeUrl?: string;
}
```

## Data-layer rule (most important)
- Components NEVER import JSON directly. They use the hooks, and the hooks call `src/api/index.ts`.
- Every function in `api/index.ts` is `async`, explicitly typed (`Promise<Project[]>`, etc.), and returns the same shape it will return from the future API.
- JSON imports are not trusted to match the types. Add small runtime guards (`isProject`, `isContact`, ...) that drop invalid entries and log a clear `console.warn` naming the bad entry's `id`. This also protects the site when the data later comes from a network. One deliberate exception: a bad `image` (an `image` with no `imageAlt`) is bad image data, not a bad project, so the guard strips the image, warns with the project's `id`, and keeps the project, which then renders text-only.
- Phase 1 shape:
```ts
import projectsJson from "../data/projects.json";
import type { Project } from "../types";

export const getProjects = async (): Promise<Project[]> =>
  (projectsJson as unknown[]).filter(isProject);

// Phase 3: replace the body with
// fetch(`${import.meta.env.VITE_API_URL}/projects`).then(r => r.json()).then(list => list.filter(isProject))
```
- Every section handles loading, error, and empty states, even though data is local today.
- Adding or removing an item must only require editing a JSON file. Never hardcode project, skill, or contact content in TSX.

## Data schemas (JSON files mirror `types.ts`)
- `projects.json`: array of `Project`. `featured` projects sort first; at most 4 render in the grid and every other project renders in the "More projects" list. Optional fields must be handled gracefully when missing, including a featured project with no image, which renders as a clean text-only plate with no empty box and no gap.
- `skills.json`: array of `SkillGroup`. Start groups: Frontend, Backend (learning), Tools and DevOps, Mobile. No percentage bars or star ratings.
- `contacts.json`: array of `Contact`. Contacts render from this list, so a new entry shows up with no code change. Unknown `icon` values fall back to a generic link icon.
- `profile.json`: one `Profile`.

Seed each file with 2 to 3 clearly fake entries (titles like "Example Project") for me to replace.

## Process: research, plan, review, build

### 1. Research (before any design decision)
If you have web access, look at 6 to 8 real developer portfolios that are used to get hired (search for current lists and case studies, and open the actual sites). Include a mix: a minimal single-page one, a case-study style one, and a frontend-focused one. Write `REFERENCES.md` with, per site: URL, what is on the first screen, layout structure, type choices, how motion is used (if at all), how projects are presented. End with a short list of patterns that repeat and patterns to avoid. Do not copy any site's layout, copy, or assets. Use it to calibrate, not to clone.

If you do not have web access, ask me for 3 to 5 reference URLs and stop.

Known signals to respect (from published hiring guidance):
- A recruiter spends about 15 seconds on first view, so the hero and the best work must be legible immediately.
- 3 to 4 strong projects beat many weak ones, with live demo, code link, and stack for each.
- Performance matters: load in under about 2 seconds, Lighthouse performance 90 or higher.
- Mobile must work, since portfolios get opened on phones.
- Showing growth is valued, so the "currently learning" line and honest `status` badges are features, not weaknesses.

### 2. Design plan (`DESIGN.md`)
Write it before any UI code:
- **Color:** 4 to 6 named hex values (background, surface, text, muted text, one accent, optional border color). If I give hex codes, use them exactly.
- **Type:** one or two typefaces with clearly distinct roles and a defined type scale. Pick faces with character, chosen for this portfolio, not the defaults every template uses. Body line length under about 70 characters.
- **Layout:** a one-sentence concept plus an ASCII wireframe of the hero and the projects section, with alignment stated (left-aligned by default).
- **Signature moment:** the single memorable element, plus a priority-ordered motion inventory (priority, trigger, properties, duration and stagger, reduced-motion behaviour) covering every motion in the design (see Animation).
- **Imagery:** the screenshot ratio, radius, border, crop anchor, and the alt rule, including what happens when an image is missing or malformed.
- **Review pass:** compare the plan against the Banned list below and against `REFERENCES.md`. If any part is what you would produce for any developer portfolio, revise it and say what you changed and why.

Stop after writing `DESIGN.md` and wait for my approval.

### 3. Build, then critique
Build in small steps. After each step run the dev server or build, then review your own output against this file and the plan. Remove one decorative element before declaring a step done.

## Banned (these read as generated or templated)
- **Gradients of any kind** used as decoration: gradient backgrounds, gradient text, gradient borders, gradient buttons, glowing gradient blobs, mesh gradients. Use flat colors. A gradient is allowed only if it is functional (for example a scroll-fade mask that signals overflowing content), and you must justify it in a code comment.
- **Emojis** anywhere: UI text, headings, buttons, README, code comments, commit messages, JSON seed data. Use plain words. Use `lucide-react` icons only where listed under Stack.
- Glassmorphism, frosted blur cards, neon glows, and heavy drop shadows.
- A near-black background with a single acid-green, purple, or neon accent as the default look.
- Warm cream background with a serif display font and a terracotta accent as the default look.
- Every content block as an identical rounded card with the same border radius and the same soft grey shadow. Vary treatment by hierarchy, and use plain lists or tables where they communicate better.
- Tracked all-caps eyebrow labels above every heading.
- Numbered markers (01, 02, 03) on content that is not a real sequence.
- Accenting a single word of the hero headline with a different color or italic.
- Filler copy: "passionate developer", "crafting digital experiences", "building the future", "turning ideas into reality". Write specific, plain statements about what I built and with what.
- Buttons ending in arrows by habit, labels like "WORD: fragment", middle-dot meta strings.
- Particle backgrounds, floating 3D shapes, custom cursors that block usability, typing-effect headlines, parallax, auto-playing video or audio.
- Stock illustrations, fake testimonials, fake statistics, skill percentage bars.

## Design rules
- Mobile-first, responsive from 320px up. The "Mobile and responsive requirements" section below is mandatory, not optional polish.
- One border radius scale, used with intent: `0` for structure (plates, bands, rules), `4px` for controls (buttons, chips), `8px` for media (screenshots).
- Structure (borders, dividers, labels) must carry information. If it does not, remove it.
- The background system is fixed and small: alternating flat `background`/`surface` section bands, one hero-only dot grid (an inline SVG filled from a CSS variable, `aria-hidden`, faint, never behind text), and at most one flat accent-tint shape. No other decoration.
- Dark and light themes via CSS variables and `ThemeContext`, defaulting to `prefers-color-scheme`. Both themes must be designed, not inverted.
- Semantic HTML, visible keyboard focus, alt text, AA contrast, working skip link.
- Copy is plain, specific, sentence case. Buttons say exactly what happens ("View project", "Copy email").
- Show proof: each project states the problem, the stack, and one or two concrete outcomes. Prefer a real screenshot over any illustration.

## Mobile and responsive requirements
Most recruiters will open this on a phone. Design and test phone-first, then scale up. Every item below is a requirement.

### Layout and breakpoints
- Write base CSS for phones, then add `min-width` media queries: 640px, 768px, 1024px, 1280px. No `max-width` query chains.
- Verify at these widths: 320, 360, 390, 430, 768, 1024, 1440. No horizontal scroll at any of them (`document.documentElement.scrollWidth <= window.innerWidth`).
- No fixed pixel widths on containers. Use `max-width`, `width: min(100% - 2rem, 70rem)`, and `padding-inline`.
- Grids use `repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` or a single column on phones. Project plates are one column on phones; from 768px up the grid is two columns and the lead plate spans both. Spans are recomputed for the visible set so no row is ever left with one orphaned half-width plate.
- Filter chips wrap onto multiple lines. Do not make them a hidden horizontal scroller.
- Long URLs, emails, and tech names must never overflow: use `overflow-wrap: anywhere` where needed.
- Use `rem` for type and spacing. Use `clamp()` for fluid headline sizes and section spacing. Body text is at least 16px.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

### Viewport, browser chrome, and safe areas
- `index.html` has `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Never set `maximum-scale` or `user-scalable=no`; pinch zoom must work.
- Never use `100vh` for full-height areas. Use `100svh` or `100dvh` with a `100vh` fallback, and `min-height`, not `height`, so content is never clipped on short landscape phones.
- Respect notches and home bars with `env(safe-area-inset-top|right|bottom|left)` on the sticky navbar, footer, and page padding.
- Add `<meta name="color-scheme" content="light dark">` and a `theme-color` meta for each theme.

### Touch
- Every tappable target is at least 44 by 44 CSS px, with at least 8px between adjacent targets. This includes nav links, filter chips, icon buttons, and contact links.
- Wrap hover-only styling in `@media (hover: hover) and (pointer: fine)`. Provide `:active` and `:focus-visible` equivalents. No information or control may exist only on hover.
- Set `touch-action: manipulation` on buttons and links to remove tap delay. Remove the default tap highlight only if a visible pressed state replaces it.
- Form fields (if any) use 16px or larger text so iOS Safari does not zoom on focus, and the correct `type` and `inputmode`.
- Email and phone contacts use `mailto:` and `tel:` links.

### Navigation on phones
- If the links fit in one row at 320px, show them in a row and do not add a hamburger.
- If a menu is needed, use a real `<button>` with `aria-expanded` and `aria-controls`. It must close on link tap, on `Escape`, and on outside tap. Return focus to the button when closed. Lock body scroll while open without causing layout shift.
- The sticky navbar must stay compact on phones (about 56px or less) and must not jump when the browser address bar collapses.
- The skip link and visible focus styles work on mobile keyboards and external keyboards.

### Images and fonts
- Every `<img>` has `width` and `height` (or `aspect-ratio`) to prevent layout shift, `alt`, `decoding="async"`, and `loading="lazy"` unless it is above the fold.
- Provide `srcset` and `sizes` for project images, at the three generated widths. Serve WebP. No image larger than needed for a phone screen is sent to a phone.
- Project screenshots are 16:10 with an 8px radius and a 1px border, inside an `aspect-ratio` box with `object-fit: cover; object-position: top`. `image` is a `{w}` template (`/images/name-{w}.webp`) that expands to 480/768/1200w candidates; the detail panel reuses the same asset. `imageMobile` is an optional phone-shaped shot served below 768px.
- An `image` with no `imageAlt` never drops the project: strip the image, warn with the project `id`, keep the project (see the data-layer rule).
- `npm run images` (`scripts/build-images.mjs`, `sharp` as a dev dependency) reads `assets-src/` and writes 480, 768, and 1200w WebP to `public/images/`, cropping anchored to the top and skipping the crop when the source is already 16:10.
- A demo is a `demo` URL opened by a user click. Nothing on the page autoplays: no `<video>`, no `<audio>`, no iframe.
- The hero and nav stay text-only, so no image ever competes with the LCP element.
- At most two font families, self-hosted or from Google Fonts with `preconnect`. Use `font-display: swap`, subset to Latin, and load only the weights actually used. Define a fallback stack tuned with `size-adjust` or equivalent so swapping fonts does not shift layout.

### Performance budget (measured in Lighthouse mobile mode)
- **Gate: Lighthouse mobile** — Performance 90 or higher, **LCP under 2.5s, CLS under 0.1**.
- Accessibility 95 or higher and Best Practices 90 or higher stay separate gates.
- JavaScript budget: **about 95 KB gzip initial, about 35 KB gzip deferred** for the motion chunk. This replaces the earlier 75 KB estimate.
- Do not hide the hero headline or the first screen behind a loader or an animation delay longer than 600ms. No full-screen loaders.
- Use `LazyMotion` with the `m` component and load `domMax` **at the first idle moment after the first commit** (`requestIdleCallback` with a `timeout` of 1000ms; a `setTimeout` fallback where it is unavailable). `layout="position"` on the plates and `layoutId` in the detail panel need `domMax`; `domAnimation` ships neither. The hero wipe is CSS keyframes and the nav is plain CSS, so neither needs this library. Never start the fetch before the first commit. Measured at Step 6b: initial JS 297.70 KB minified / 96.18 KB gzip, deferred motion chunk 85.95 KB minified / 28.49 KB gzip. The deferred chunk is inside the ≈ 35 KB budget; the initial chunk is 1.18 KB (1.2%) over the ≈ 95 KB figure, which DESIGN.md explains rather than rounds away. `m` still implies Framer's core on first render (React-only floor with this toolchain is ≈ 223.50 KB / ≈ 70.30 KB gzip), so roughly 21 KB gzip of the initial chunk is Framer core and only the feature bundle is deferred. Report the built numbers at each step.
- Reveals are visible by default and only enhanced once motion is ready: never write the pre-reveal state (opacity 0, offset, wipe) in base CSS, and apply it only to an element that is still below the viewport when the motion chunk resolves (`src/hooks/useReveal.ts`), so a slow or blocked motion chunk still shows a complete, readable page and nothing on screen blinks out.
- Defer anything below the fold that is heavy (images, optional components) with `React.lazy` or `loading="lazy"`.

### Smooth scrolling and rendering on phones
- No scroll hijacking, scroll-snapping the whole page, or custom scrollbars. Native momentum scroll only.
- Use `IntersectionObserver` for reveals (`src/hooks/useReveal.ts`, disconnecting on first hit). No scroll event listeners that do layout work. Any listener is `{ passive: true }`.
- No `backdrop-filter`, no animated `box-shadow`, no animated `filter`, no `background-attachment: fixed`, no large fixed-position layers. These cause jank on phones.
- Use `will-change` only on elements that are animating right now, and remove it after.
- Framer Motion layout animation is `layout="position"` on the project plates, with `layoutId` only for the detail panel. Keep the number of animated items small. On phones, shorten the stagger delay and the distance of reveals (about 12px, not 40px).
- No animation may run continuously in the background. Nothing loops.
- `scroll-behavior: smooth` is applied only inside `@media (prefers-reduced-motion: no-preference)`. Use `scroll-margin-top` on sections so anchor links land below the sticky navbar.

### Mobile testing (do this before calling any step done)
- Check each step in browser device emulation at the widths above, in portrait and landscape, in both themes.
- Run Lighthouse in mobile mode and CPU throttling at 4x, and report the numbers.
- You cannot test on real devices, so end each step by listing 3 specific things I should check on my own phone (for example: menu open and close, address bar collapse on scroll, tapping filter chips, rotating the screen).
- Known quirks to handle: iOS Safari `100vh` and address bar behavior, iOS input zoom, safe-area insets on notched phones, Android Chrome pull-to-refresh interacting with sticky headers.

## Animation rules
Motion is a prioritised budget, not a pile of effects. `DESIGN.md` holds the priority-ordered
inventory; build order follows it, the top three ship first, and no lower-priority motion is
built until those three are right. **At most two motions run at once**: while the hero wipe
plays there are no reveals, a filter reflow never overlaps a reveal, and a panel morph
suppresses hover transitions.

1. **P1 — the signature moment, the hero entrance.** Name, headline, and the "currently learning" line revealed in sequence with a `clip-path` wipe and a 12px rise, 400ms each with a 90ms stagger, complete at 580ms, once on load, never hover-dependent, and it must not delay the content. **Implement it as CSS keyframes.** No animation library on the first screen; only `prefers-reduced-motion` disables it.
2. **P2 — scroll reveals and heading wipes on every section.** Section headings wipe in with `clip-path`; plates, skill groups, and contact links reveal with a light stagger, each once, when it enters view. **Reveals are visible by default and only enhanced once motion is ready**: the pre-reveal state is applied by Framer after its chunk loads, and only to an element still below the viewport at that moment (`src/hooks/useReveal.ts`), never in base CSS, so a slow or blocked chunk still shows a complete, readable page and nothing already on screen blinks out.
3. **P3 — the detail panel.** A shared-element expansion (`layoutId`) into a native `<dialog>`, opened from the plate's `Details` button (or a pointer click on the screenshot): `showModal()` for modality and the focus trap, `Escape` to close, focus returned to that `Details` button, body scroll locked, a flat `::backdrop`, and a full-screen sheet on phones.
4. **P4 to P6, only after P1 to P3 are right:** filter reflow with `layout="position"`, chip stagger, More-projects rows, the sliding nav underline (a flat 2px bar moved with `translateX` and stretched with `scaleX`), and hover and press states. `live` and `repo` links stay on every plate; the panel is never the only route to a project.
5. Animate only `transform`, `opacity`, and `clip-path`. Never width, height, top, or left. The one exception: small controls (buttons, chips, links, the theme toggle) may transition `color`, `background-color`, and `border-color` over 150ms or less. No other properties, no longer durations, and nothing transitions color on theme change — the theme switch is instant.
6. Durations 150 to 600ms (the inventory stays within 150 to 400ms). Easing and durations are defined once in `tokens.css` and `lib/motion.ts`.
7. Respect `prefers-reduced-motion` with `useReducedMotion` and a CSS media query. The signature moment and reveals are disabled, and all content stays readable, in its final position.
8. No animation libraries besides Framer Motion, plus CSS keyframes and CSS transitions.
9. Phones come first: the signature moment finishes in about 1 second, must not delay the first screen's content, and must not depend on hover. Anything hover-only on desktop needs a tap or load-based equivalent on touch.
10. If a motion looks choppy at 4x CPU throttling, simplify or remove it. A smooth static layout beats a janky animation.

## Sections and behavior
- **Navbar:** sticky, anchor links, active-section highlight (a flat 2px underline bar moved with `translateX` and stretched with `scaleX`), theme toggle.
- **Hero:** name, one-line headline stating the role and focus, the "currently learning" line, links to Projects and Contact, resume button if `resumeUrl` is set. Text-only, content-height. Best work reachable without a long scroll.
- **Projects:** a grid of plates, featured first and capped at 4, with every remaining project behind a "More projects" expander (image-free rows on hairlines). Spans are recomputed for the visible set so no cell is orphaned, and plates move with `layout="position"`. Filter chips derive from the union of all `stack` values (never hardcoded) and appear only with 5 or more projects. Each plate carries its status, stack, `live` and `code` links, and a visible `Details` button named after its project, which is the single accessible trigger for the native-dialog detail panel holding the highlights and the optional demo link. A click on the screenshot opens the same panel for pointer users only: that control carries `tabindex="-1"` and `aria-hidden="true"`, and focus always returns to the `Details` button.
- **Skills:** grouped from `skills.json`, a compact two-column list, quiet and minimal.
- **Contact:** list from `contacts.json`, copy-to-clipboard for email, clear `mailto`.
- **Footer:** year and link to the repository.

## Code quality
- Strict TypeScript. Props typed with interfaces. Components small and single-purpose. Hooks for repeated logic.
- Theme through context, everything else local state.
- No dead code, no `console.log` left behind (the guard `console.warn` is the exception).
- `localStorage` only for the theme preference, wrapped in try/catch.
- `index.html`: title, meta description, Open Graph tags, favicon (a simple flat monogram or shape, not an emoji).
- `npm run build` must include a type check (`tsc -b`) and pass.

## Workflow rules
- Small steps. After each, run the build or dev server, then summarize in 3 to 5 lines.
- No new dependency without asking.
- Do not rewrite files you were not asked to touch.
- Fix causes, not symptoms.
- If something is ambiguous, pick the simplest reasonable option, state it in one line, and continue.
- Commit messages: plain imperative sentences, no emojis.

## Definition of done (Phase 1)
- `tsc -b` and `npm run build` pass with no errors
- All three dynamic sections update from JSON edits alone
- Works at 320, 360, 390, 430, 768, 1024, and 1440px, portrait and landscape, in both themes
- No horizontal scroll at any width, and all tap targets are at least 44px
- Lighthouse mobile mode: Performance 90 or higher, Accessibility 95 or higher, Best Practices 90 or higher, with LCP under 2.5s and CLS under 0.1
- Pinch zoom works, safe-area insets are handled, and `100svh`/`100dvh` is used instead of `100vh`
- Smooth at 4x CPU throttling, with no jank from animation or scrolling
- Reveals and heading wipes appear with the motion chunk blocked (nothing blank while JavaScript loads)
- A featured project with no image renders cleanly, with no empty box and no gap
- Reduced-motion mode works
- Zero gradients and zero emojis in the shipped output (search the codebase to confirm)
- README explains how to add or remove a project, skill, and contact, how to add or replace screenshots (`npm run images` and the `{w}` naming rule), and how to deploy

## Phase 3 migration (do NOT do now, keep the door open)
When I say "migrate to API":
1. Replace only the bodies in `src/api/index.ts` with `fetch` calls using `VITE_API_URL`, keeping the same types and guards.
2. Keep response shapes identical to `types.ts`.
3. Add `.env.example` and a JSON fallback if the API is unreachable.
4. No component changes should be needed. If one is, explain why before changing it.
