# Portfolio

A personal portfolio for a React and TypeScript developer, built so the content lives in data and
the interface never has to change when that data moves to an API.

The UI is static. Every project, skill, contact, and profile line is read through the hooks in
`src/hooks/`, which call `src/api/index.ts`. Components never import JSON, so Phase 3 replaces only
the bodies of the functions in that one file with `fetch` calls and nothing else moves.

## Commands

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Dev server with HMR                               |
| `npm run build`   | Type check (`tsc -b`) then build to `dist/`       |
| `npm run preview` | Serve the built output locally                    |
| `npm run images`  | Rebuild `public/images/` from `assets-src/`       |
| `npm run lint`    | oxlint                                            |

Node 20 or newer.

## Adding or removing content

Each list is one file. Editing it is the whole job — no component knows what is in it.

| Content                                              | File                       |
| ---------------------------------------------------- | -------------------------- |
| Projects (title, description, stack, links, status)  | `src/data/projects.json`   |
| Skill groups                                         | `src/data/skills.json`     |
| Contact links                                        | `src/data/contacts.json`   |
| Name, headline, what I am looking for, resume        | `src/data/profile.json`    |

Entries that do not match the types in `src/types.ts` are dropped with a `console.warn` naming the
offending `id`, so a typo in data cannot take the page down. One deliberate exception: a project
that has an `image` but no `imageAlt` **keeps the project and loses the image**, because the image
is the bad data, not the project.

### Projects

```json
{
  "id": "my-project",
  "title": "My Project",
  "description": "One or two sentences: the problem, what it does, and the outcome.",
  "stack": ["React", "TypeScript"],
  "highlights": ["A concrete outcome, in a sentence."],
  "live": "https://example.com",
  "repo": "https://github.com/me/my-project",
  "image": "/images/my-project-{w}.webp",
  "imageAlt": "What the screen shows, in plain words",
  "imageMobile": "/images/my-project-mobile-{w}.webp",
  "demo": "https://example.com/demo",
  "status": "live",
  "featured": true
}
```

- `status` is `live`, `in-progress`, or `planned`, and it renders as its own word.
- `featured` projects lead the section. At most four render as plates; every other project, and any
  featured project past the cap, renders in the **More projects** list.
- `live` and `repo` are links on every project card, and every card carries a `Details` button that
  opens its panel; `demo` is a link inside the panel only.
- Every field except `id`, `title`, `description`, `stack`, and `status` is optional. Missing
  optional fields simply do not render — no empty boxes, no dead buttons.
- The filter chips are derived from the `stack` values themselves, in first-seen order. They appear
  once there are five or more projects. Nothing is hardcoded.

### Skills

```json
{ "group": "Frontend", "items": ["React", "TypeScript", "Vite"] }
```

- Groups render in file order, one column on phones and two from 640px up.
- A group is a heading and one wrapped list of items. No bars, no stars, no percentages, no icons —
  there is no honest way to score a skill, so the site does not pretend to.
- Group names are used exactly as written, so your capitalization is the capitalization on screen.

### Contacts

```json
{
  "id": "email",
  "label": "Email",
  "value": "me@example.com",
  "href": "mailto:me@example.com",
  "icon": "mail"
}
```

- A new entry appears with no code change: `label` is the channel name, `value` is what the row
  shows, and `href` is the real link.
- `mailto:` and `tel:` links are handed to the browser untouched, so the mail app and the phone
  dialer open. Every other address opens in a new tab.
- `icon` accepts `mail`, `phone`, or `globe`. Anything else — including `github` and `linkedin`,
  which lucide no longer ships as brand marks — falls back to a plain link icon.
- The `Copy email` button appears on any `mailto:` entry, and its confirmation is both shown and
  announced to screen readers.

### The profile

```json
{
  "name": "Wahaj Gul",
  "headline": "React and TypeScript on the front end.",
  "lookingFor": "Looking for a React developer role.",
  "currentlyLearning": "Docker, Linux, Node",
  "resumeUrl": "https://example.com/resume.pdf"
}
```

- `name`, `headline`, and `lookingFor` are required; `currentlyLearning` and `resumeUrl` are
  optional and simply do not render when missing.
- `bio` is accepted but **not rendered**: the first screen is budgeted to the four lines above so
  the lead project stays in view on a 390px phone. It is optional, and deleting it is safe.
- Keep the headline to one line of role and focus, and keep `currentlyLearning` to a short list.

### The footer

The year and a link to the repository. These are site configuration rather than page content: the
URL is the `REPOSITORY_URL` constant near the top of `src/App.tsx`.

## Screenshots

`npm run images` reads the originals in `assets-src/` and writes WebP to `public/images/`. The file
name is the project `id`:

| Original in `assets-src/`         | Written to `public/images/`                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `my-project.png`                  | `my-project-480.webp`, `my-project-768.webp`, `my-project-1200.webp` |
| `my-project-mobile.png` (optional)| `my-project-mobile-480.webp`, `-768.webp`, `-1200.webp`       |

In `projects.json` the `image` field is a `{w}` template, and `{w}` expands to 480, 768, and 1200:

```json
"image": "/images/my-project-{w}.webp",
"imageMobile": "/images/my-project-mobile-{w}.webp"
```

Rules:

- Every `image` needs an `imageAlt`. Without one the guard strips the image (see above), so the
  project still shows and nothing ships an unnamed image.
- `imageMobile` is served below 768px through a `<picture>` source, so a phone reads a phone-shaped
  shot. It shares the same `imageAlt` — one image, one alt.
- Cropping is 16:10 and anchored to the **top**, so an app header survives. A source that is already
  16:10 is only resized. Phone screenshots are treated the same way.
- The script prints a size table, skips outputs that are newer than their source, and fails loudly
  on an unsupported file rather than writing a broken candidate.
- `sharp` is a dev dependency used only by this script, and it is never shipped to the browser.
- Originals in `assets-src/` are not deployed. The WebP in `public/images/` are committed, so a
  static host needs no image step at build time.
- A project with no `image` is a supported state, not a broken one: its card renders as text only.

## Deploying

The build output is a static folder in `dist/`. On Vercel or Netlify set the build command to
`npm run build` and the publish directory to `dist`. Phase 1 needs no environment variables;
Phase 3 adds `VITE_API_URL`.

## Notes

- Dark and light themes come from CSS variables, default to `prefers-color-scheme`, and remember an
  explicit choice. Both are designed, not inverted.
- Motion is one animation library (Framer Motion), loaded only after the first screen is painted,
  plus CSS keyframes for the hero. Section headings wipe in and the content below them reveals,
  both visible by default and only enhanced once that library has loaded, so a slow or blocked
  script still shows a complete page.
- Reduced motion turns the signature entrance, reveals, the heading wipes, and the panel
  transition off, and every layout stays readable.
- The background is a fixed set of two flat elements: the alternating `background` / `surface`
  section bands and the hero's dot grid. There are no gradients, no shadows, and no other
  decoration to add to. A third element was tried and cut — see the note in `DESIGN.md` under
  "Background elements" for why.
- The palette, type scale, spacing, and motion durations live in `src/styles/tokens.css` and
  nowhere else.
