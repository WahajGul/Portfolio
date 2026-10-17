# DESIGN.md — design plan (Phase 1)

Concept in one sentence: **a left-aligned work ledger** — identity at the top, then proof, laid
out as flat bordered plates (0 radius, hairline edges, no shadows) where the lead project spans
the full width and everything else steps down by span and one type step, with the long tail
behind a "More projects" expander.

Light theme is designed first and is the default when the OS expresses no preference;
`prefers-color-scheme` decides for users who do.

## Color

All values are used exactly as given. No other hex values appear anywhere in the codebase.
The two tint values below are not new colors: they are the accent at low alpha
(`color-mix(in srgb, var(--accent) 10%, transparent)`), computed here so contrast is known in
advance.

### Tokens

| Token       | Light      | Dark       | Role                                                        |
| ----------- | ---------- | ---------- | ----------------------------------------------------------- |
| background  | `#F7F8F9`  | `#12151A`  | Page background, hero and Skills bands                      |
| surface     | `#FFFFFF`  | `#1B2027`  | Raised areas: Projects and Contact bands, project plates     |
| text        | `#14181F`  | `#E8EAED`  | Headings, body                                              |
| muted       | `#5B6470`  | `#9AA3AE`  | Meta, descriptions, status labels, unselected chips         |
| border      | `#D9DEE4`  | `#2C333D`  | Hairlines, plate edges, and the hero dot grid (decorative)  |
| accent      | `#1F4FD8`  | `#7FA2FF`  | Links, focus rings, primary button, selected chip, live status |

Derived (alpha of accent only): `--accent-tint` = accent at 10% (selected chip background);
`--accent-tint-strong` = accent at 5% on surface (block hover on fine pointers). Verified below.

### Contrast verification (WCAG 2.1: 4.5:1 text, 3:1 large text and UI boundaries)

Light theme:

| Pairing                          | Ratio  | Result |
| -------------------------------- | ------ | ------ |
| text on background               | 16.73  | pass   |
| text on surface                  | 17.79  | pass   |
| muted on background              | 5.64   | pass   |
| muted on surface                 | 6.00   | pass   |
| accent link on background        | 6.23   | pass   |
| accent link on surface           | 6.63   | pass   |
| surface text on accent (button)  | 6.63   | pass   |
| accent on selected-chip tint     | 5.35   | pass   |
| text on selected-chip tint       | 14.37  | pass   |
| text on plate-hover tint         | 16.48  | pass   |
| muted on plate-hover tint        | 5.55   | pass   |
| accent focus ring on bg/surface  | 6.2+   | pass   |

Dark theme:

| Pairing                          | Ratio  | Result |
| -------------------------------- | ------ | ------ |
| text on background               | 15.18  | pass   |
| text on surface                  | 13.59  | pass   |
| muted on background              | 7.16   | pass   |
| muted on surface                 | 6.41   | pass   |
| accent link on background        | 7.42   | pass   |
| accent link on surface           | 6.64   | pass   |
| background text on accent (btn)  | 7.42   | pass   |
| accent on selected-chip tint     | 5.20   | pass   |
| text on selected-chip tint       | 10.65  | pass   |
| text on plate-hover tint         | 12.11  | pass   |
| muted on plate-hover tint        | 5.72   | pass   |
| accent focus ring on bg/surface  | 6.6+   | pass   |

**Failures, and the rule that resolves them:** the hairline `border` colors score 1.27–1.44
against their backgrounds — below the 3:1 required of *UI component boundaries*. They are used
only as decorative dividers and as the 1px edge of project plates whose *title* is the
identifier (the border is never the only thing that says "this is a control"), which WCAG 1.4.11
exempts; the hero dot grid is a faint tint of `border`, never sits behind text, and is texture,
not information. Any
boundary that identifies a control — chip outlines, button edges, input borders, the plate edge,
the `Details` button's outline, the screenshot's hairline — uses `muted` (5.64–6.41, pass) or
`accent`. Focus rings are always
`accent` at 2px with 2px offset. No information is carried by a decorative border alone.
The same rule extends to underlines: the underline that says "this row is a link" on a contact
entry, and the one on the footer's repository link, carry information, so they are drawn in
`muted` — never in the hairline color.

## Type

Two Google Fonts families with clearly distinct roles, neither of which is a template default:

- **Bricolage Grotesque** (display) — name, section headings, project titles. Quirky
  grotesque with real personality; this face is the portfolio's voice.
- **Public Sans** (body) — everything else: prose, meta, links, buttons, chips. Neutral,
  civic, built for long reading; it disappears so the content reads.

Both families are self-hosted as woff2 files with Latin-only subsets, served from the app's
own origin (no third-party font request, no `preconnect` needed). The display font is
preloaded with `<link rel="preload" as="font" type="font/woff2" crossorigin>` since the h1
depends on it; the body font loads via `@font-face` with `font-display: swap`. Weights are
limited to what is used (Bricolage 600/700, Public Sans 400/600), and a fallback stack with
`size-adjust`-tuned `@font-face` metrics keeps the swap from shifting layout. Latin subsetting
keeps the four woff2 files under about 100KB total; if a subset exceeds its budget, drop a
weight before shipping a larger file.

Scale (fluid via `clamp`, rem units, 16px body floor):

| Role           | Size                                   | Notes                          |
| -------------- | -------------------------------------- | ------------------------------ |
| Name (h1)      | `clamp(2.5rem, 9vw, 4.25rem)`          | line-height 1.05               |
| Headline       | `clamp(1.25rem, 4vw, 1.75rem)`         | the one-line role/focus line   |
| Section head   | `clamp(1.5rem, 5vw, 2rem)`             | also the lead project title    |
| Project title  | `clamp(1.125rem, 3vw, 1.375rem)`       | every non-lead block           |
| Body           | `1rem` (16px)                          | max width 62ch, line-height 1.6|
| Meta           | `0.875rem`                             | stack strings, statuses        |

Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`. Body measure stays under
70 characters everywhere.

## Layout

Left-aligned, single column, one scale. Spacing base 4px. Radius scale with intent:
`0` for structure (plates, bands, rules), `4px` for controls (buttons, chips), `8px` for media
(screenshots). Breakpoints (min-width only): 640, 768, 1024, 1280. Container:
`width: min(100% - 2rem, 64rem)` with `padding-inline` and safe-area insets.

### Section bands

Full-bleed flat bands alternate `background` and `surface` so sections read as physical
strata without shadows: hero `background`, **Projects `surface`**, Skills `background`,
Contact `surface`, footer `background`. Bands carry no gradient and no divider rule of their
own; the Projects band's `surface` is what separates the grid from the hero, and the plates
inside it sit on `surface` too (their edges, not a shadow, define them). Every text pairing
in a band is already verified above (`text`/`muted` on both band colors).

**Built:** every section is a full-bleed band that holds its own `.container`, and two utilities
in `global.css` carry the system: `.band` (the band's own vertical room) and `.band-surface`
(the fill). The hero, the Skills band, and the footer are `background`, which is also the page
color, so they need no rule at all — only Projects and Contact paint. A band's `padding-block`
*is* the section gap, which is what leaves the fold math untouched: the hero keeps its own
padding and its band adds none, so the distance from the hero's last line to the Projects
heading is the hero's own 40px plus the Projects band's top padding.

**The gap is fluid, and it grew.** It was a flat 48px a side (96px between sections) until a
review of the built page found the Skills band sitting too close under the More-projects button:
a section that ends in a bordered control has no internal air below it the way a project plate
does, so the same 96px reads much tighter there. `.band` now uses
`clamp(var(--space-16), 6vw, var(--space-20))` — 128px between sections on phones and tablets,
opening to 160px on a desktop, where the fixed 48px looked mean next to a 1024px column. 6vw only
passes the 64px floor past roughly a 1070px viewport, so phones and tablets share one value.

The 16px it adds at the top of the Projects band is the only part of this that touches the first
screen, and the phone height budget below carries the new figure. The hero → Projects distance
grows from 88px to 104px, which is the same complaint answered at the boundary above.

### Background elements (exactly two)

1. **Alternating flat bands** (above): `background` and `surface` full-bleed strata. No
   gradient, no rule, no texture — a flat color change is the whole device.
2. **Dot grid — hero only.** One static inline SVG `<pattern>` of 1px-radius dots on a 24px
   grid, `aria-hidden`, filled from a CSS variable (`border` at very low opacity, so it follows
   both themes without a second hex value). No animation, no gradient, no canvas, ~0.4KB of
   HTML. It sits in the hero's empty area only — never behind the name, the headline, or any
   body text — so text contrast is untouched. It never appears in another band.

Those two are the entire background system; nothing else in the page is decoration. No CSS
gradient function exists anywhere in the stylesheet: bands are flat colors and the dot grid is an
SVG pattern. Verified by grep in review.

**Built, and where:** the bands are the `.band` / `.band-surface` utilities; the dot grid is the
`<svg>` at the top of `Hero.tsx` (24px tall, so it covers exactly the hero's top padding strip
and can never reach the name below it).

**The accent-tint plate was cut.** A third element — a flat `--accent-tint` rectangle inset 8px
beyond the hero's action row — was specified here, built in the Step 8 pass, and removed the same
day after seeing it in the browser. Two reasons, both fatal to its job:

- **In dark theme it is the surface band.** `--accent-tint` is the accent at 10% alpha, so over
  the dark background it composites to `#1D2331`, and `--surface` is `#1B2027` — within a few RGB
  steps. An element whose whole purpose is to mark one group of controls instead read as a piece
  of the Projects band that had slipped into the hero.
- **It broke the left spine.** Insetting it 8px on every side put its left edge 8px *left* of the
  column edge that the name, the headline, every plate, and the footer all align to. The page's
  one strong alignment line is worth more than a highlight that the accent-filled primary button
  already provides.

Measured in retrospect against AGENTS.md's rule, this is the right outcome anyway: the rule is
*at most one* flat accent-tint shape, and zero satisfies it. A tint plate may come back only with
a value that cannot be confused with `surface` in either theme, aligned to the container edge
rather than outdented — both conditions to be checked in both themes before it ships again.

### Hero wireframe (320px phone → desktop)

```
 phone (390px)
 +--------------------------------+
 | [skip to content]              |
 | Projects Skills Contact [theme]|
 +--------------------------------+
 | (dot grid band, hero only)     |
 |                                |
 | Wahaj Gul                      |
 |                                |
 | React and TypeScript           |
 | on the front end.              |
 |                                |
 | Looking for a React            |
 | developer role.                |
 |                                |
 | Currently learning:            |
 | Docker, Linux, Node            |
 |                                |
 | [View projects] [Contact]      |
 | [Resume]                       |
 +--------------------------------+

 desktop (>=1024)
 +---------------------------------------------+
 | [skip to content]                           |
 | Projects  Skills  Contact            [theme]|
 +---------------------------------------------+
 | (dot grid band, hero only)                  |
 |                                             |
 | Wahaj Gul                                   |
 |                                             |
 | React and TypeScript on the front end.      |
 |                                             |
 | Looking for a React developer role.         |
 |                                             |
 | Currently learning: Docker, Linux, Node     |
 |                                             |
 | [View projects]  [Contact]  [Resume]        |
 +---------------------------------------------+
```

The action row sits **directly on the band**, left-aligned with everything above it. An earlier
draft drew a flat accent-tint plate around it; that box was cut after review — see *Background
elements* for the two reasons.

The hero contains **no images and no Framer Motion** — text, the dot-grid SVG, and CSS
keyframes only, so the h1 is the LCP element and nothing competes with it. Sticky nav is 56px
tall on phones and holds one row with no logo, as drawn. The math at 320px: the container is
`min(100% - 2rem, 64rem)`, so 288px of content width. Label estimates at 16px Public Sans 600:
"Projects" ≈ 62px + 16px padding = 78px, "Skills" ≈ 44 + 16 = 60px, "Contact" ≈ 54 + 16 = 70px;
8px gaps between the three targets = 16px; theme toggle 44px. Total = 268px, 20px slack. The nav
carries the links and the toggle and nothing else — a monogram would repeat the name that the h1
states 40px below it, in a row that has no room to spare on a phone. If a future label change
breaks the fit, the theme toggle moves from the nav into the hero's action row; the links
themselves never collapse into a hamburger, because three links do not justify a menu.

The hero is content-height: vertical padding plus its content, no viewport-relative height at
all — no `min-height` in `dvh`/`vh`, ever.

### Projects wireframe (phone → desktop)

The rules drawn as `+----` lines are the plate hairlines: plates are separated by their own
1px edges, never by a shadow and never by a card drop.

```
 phone (390px), one column
 +--------------------------------+
 | Projects                       |
 | [All] [React] [TypeScript] ... |
 | (chips render only at 5+)      |
 +--------------------------------+
 | Lead plate, full width         |
 | [screenshot 16:10]             |
 | SMDB Movie App          live   |
 | A Movie and TV show ...        |
 | React, TypeScript, Vite        |
 | [View project] [Code]          |
 +--------------------------------+
 | Plate (half-width at 768+)     |
 | [screenshot 16:10]      live   |
 | Recipe Finder                  |
 | React, TypeScript, Vite        |
 | [View project] [Code]          |
 +--------------------------------+
 | (repeat up to 4 featured)      |
 | [More projects (2)]            |
 | (expander, image-free rows)    |
 +--------------------------------+

 desktop (>=768px), two columns
 +-----------------------------------------------------------------+
 | Projects                                                        |
 | [All] [React] [TypeScript] [Node]                               |
 | (chips render only at 5+ projects)                              |
 +-----------------------------------------------------------------+
 | Lead plate, spans both columns                                  |
 | [screenshot 16:10]                                              |
 | SMDB Movie App                                            live  |
 | A Movie and TV show information web app                         |
 | React, TypeScript, Vite          [View project] [Code]          |
 +-----------------------------------------------------------------+
 | Plate (half)              | Plate (half)                        |
 | [screenshot]      live    | [screenshot]       live             |
 | Recipe Finder             | Perfume E-Commerce Store            |
 | [View project] [Code]     | [View project] [Code]               |
 +-----------------------------------------------------------------+
 | Fourth plate, spans both columns (only when 4 are featured)     |
 +-----------------------------------------------------------------+
 | [More projects (2)]   expander: image-free rows                 |
 +-----------------------------------------------------------------+
```

**The grid.** One column on phones; two columns from 768px up. The featured projects render in
the grid, **capped at 4**; everything else lives in the More list (below). Cell rules, which are
what keep this from being a card wall:

- **Spans are recomputed for the currently visible set** every time that set changes — a chip
  filter, or a project added or removed in data — so there is never an orphaned half-empty
  cell. The first visible plate is the **lead** and spans the full grid width; the plates after
  it fill the two-column row in pairs; if the trailing remainder is a single plate, that plate
  spans the full width as well. The counts that follow from that: 1 → full; 2 → full, full;
  3 → full, half, half; 4 → full, half, half, full; 6 → full, half, half, half, half, full.
  On phones the column is single, so every plate is full width whatever the count.
- Only the lead is larger: it carries the `--text-section` title and the widest screenshot.
  Every other plate shares the `--text-project` type step.
- Every plate is a flat `surface` box with a hairline `border`, **0 radius, no shadow**. Grid
  rows stretch so half-width plates in a row share a height; nothing is a fixed aspect card.
- Plates animate their placement with **`layout="position"`**: only translation animates, so a
  span change moves a plate without scaling its screenshot or its type.
- Plates hold, in order: the screenshot when the project has one, the title (`h3`), status, stack,
  description, and the action row — `Details`, then the `View project` / `Code` links. `Details`
  is a real `<button>`, named after its project (`<title> details`), and it is the only route a
  keyboard or screen reader takes into the panel. The screenshot is a pointer-only shortcut over
  the image (`tabindex="-1"`, `aria-hidden="true"`), so the image keeps its alt text in the
  accessibility tree and the panel is never the only way to reach a project's live demo or code.
  **A featured project without an image renders as a clean text-only plate — no empty box, no
  placeholder, no reserved gap** — and it keeps the same `Details` button, so its highlights stay
  reachable. Status and stack are separate elements in the DOM and on screen — a status line, then
  a stack list beneath it — never a combined meta string (no middle dots anywhere).
- Status is a plain word: `live` in accent, `in-progress` and `planned` in muted. The word
  carries the information; color is the second channel, never the only one.
- No horizontal scrolling, ever: the grid wraps, chips wrap onto multiple lines, and long tech
  names or URLs break with `overflow-wrap: anywhere`.

**Filter chips** derive from the union of all `stack` values in first-seen order, render only
when there are 5 or more projects, and sit directly under the heading above the grid (a grid
has no "between the featured row and the rest", so the chips lead the section and the lead
project stays the first grid item). 44px targets, muted outlines, accent-tint selected state,
`aria-pressed`, wrapping. They filter the grid and the More list together; while a filter is
active the More list renders open under a plain "Other projects" heading, so a match is never
hidden behind a collapsed control. Filtering recomputes the grid's spans for the new visible
set, and the plates glide to their new positions through `layout="position"`.

**More projects expander.** Everything not in the grid — the non-featured projects, plus any
featured projects past the cap of 4 — lives behind a real `<button aria-expanded aria-controls>`
labelled `More projects (n)`. Its contents are **image-free** compact rows on hairlines:
title, status, stack, one line, and the same links. This is where the original ledger row
treatment survives, applied only to the long tail. The rows fade in with a light stagger when
the expander opens.

**Highlight expansion moves into the detail panel.** Plates stay scannable; outcomes are read in
the panel, which is where a recruiter has already decided to look. Each plate still carries its
own `View project` and `Code` links, so the proof is one tap away even if the panel is never
opened.

### Skills wireframe (compact two-column grouped list)

```
 phone (390px), one column
 +--------------------------------+
 | Skills                         |
 +--------------------------------+
 | Frontend                       |
 | React, TypeScript, Vite        |
 | Backend (learning)             |
 | Node, Docker                   |
 | Tools and DevOps               |
 | Git, Vite, Linux               |
 | Mobile                         |
 | React Native                   |
 +--------------------------------+

 desktop (>=640px), two columns
 +-----------------------------------------------------------------+
 | Skills                                                          |
 +-----------------------------------------------------------------+
 | Frontend                  | Backend (learning)                  |
 | React, TypeScript, Vite   | Node, Docker                        |
 | Tools and DevOps          | Mobile                              |
 | Git, Vite, Linux          | React Native                        |
 +-----------------------------------------------------------------+
```

Group heading (`h3`) plus one plain wrapped list of items, no bars, no stars, no icons, one
column on phones and two from 640px up. Items stagger in lightly (see motion inventory).

### Contact

A list of links; email uses `mailto:` and a `Copy email` button with a lucide `Copy` icon
(meaningful icon, per stack rules). No form. Contact links are part of the motion inventory's
stagger on first view.

Each row is a channel name and its value inside the one link, with the channel's mark to the left:
`mail`, `phone`, and `globe` map to their lucide icons, and anything else — including `github` and
`linkedin`, which lucide no longer ships as brand marks — falls back to a plain link icon, so a new
entry in `contacts.json` always renders. An `http(s)` address opens in a new tab (with a visually
hidden note); `mailto:` and `tel:` are handed to the browser untouched, so the real mail and phone
handlers open. The copy button appears only on the `mailto:` row, and its confirmation is a visible
`role="status"` line, so the outcome is both seen and announced, in words — including the failure
path where the Clipboard API is unavailable. Every row is a 44px target, and the underline is the
non-color cue that the row is a link (there on touch, where hover never happens).

**Footer.** The year and a link to the repository, on the footer's own band. Nothing else: no
newsletter, no columns of filler links.

## Signature moment

The hero entrance is still the one theatrical moment: the name, then the headline, then the
"currently learning" line reveal in sequence through a `clip-path` inset wipe with a 12px rise
— three steps of 400ms with a 90ms stagger (starting at 0, 90, and 180ms), easing
`cubic-bezier(0.22, 1, 0.36, 1)`, complete at 580ms. The text nodes are present as soon as
React mounts — assistive tech and search see the full content immediately — while visually each
line is uncovered by its own step; the h1 is the first step, so it begins revealing at 0ms and
is never fully hidden for more than 400ms. It runs once on load, never repeats, depends on
nothing (no hover), and everything simply appears under `prefers-reduced-motion`.

**It is now CSS keyframes, not Framer Motion.** Each of the three lines carries one
`@keyframes` wipe (`clip-path` + `transform` only) with `animation-delay` and
`animation-fill-mode: both`; a `@media (prefers-reduced-motion: reduce)` block sets
`animation: none`. This removes the animation library from the first screen entirely: the hero
paints from CSS, and the Framer Motion chunk is fetched at the first idle moment after the first
commit (see Performance). Only
`transform`, `opacity`, and `clip-path` animate; the signature step never touches another
property.

### Motion inventory (ordered by priority; the top three ship first)

Build order follows the priority column. **P1–P3 are implemented first** — the hero entrance, the
scroll reveals and heading wipes, and the detail panel — and nothing else is built until those
three are right. **At most two motions are in flight at any moment:** while the hero wipe runs
there are no reveals; a filter reflow never overlaps a reveal; a panel morph suppresses hover
transitions. Each motion is gated on the others rather than queued, so nothing is ever queued up
and dumped.

| Priority | Motion                                        | Trigger                     | Properties                    | Duration / stagger                | Reduced motion |
| -------- | --------------------------------------------- | --------------------------- | ----------------------------- | --------------------------------- | -------------- |
| P1       | Hero wipe (the signature moment, CSS keyframes)| load, once                  | `clip-path`, `transform`      | 400ms × 3, 90ms stagger           | none (visible) |
| P2       | Heading wipes and content reveals, all sections | enters view, once           | `clip-path`, `opacity`, `transform` | 400ms wipe; 300ms reveal, 50ms stagger (max 4) | none (visible) |
| P3       | Detail panel (shared element)                  | `Details` button; screenshot click (pointer only) | `layoutId` projection, `opacity` | 300ms                          | dialog appears |
| P4       | Filter reflow                                  | chip select                 | `layout="position"`           | 200ms                             | instant        |
| P4       | Chips stagger                                  | chips mount or filter change| `opacity`, `transform`        | 200ms, 30ms stagger (max 6)       | none           |
| P5       | More-projects rows                             | expander opens              | `opacity`, `transform`        | 250ms, 40ms stagger               | none           |
| P5       | Nav underline                                  | active section change       | `transform`                   | 200ms                             | instant        |
| P6       | Hover arrow and screenshot shift (fine pointers)| hover                      | `transform`, `opacity`        | 150ms                             | none           |
| P6       | Touch press state                              | `:active` on a plate        | `background-color`            | 150ms max                         | n/a            |

P2 covers every section: section headings wipe, and project plates, skill groups, and contact
links reveal with the same light stagger.

Rules that hold across all of it: only `transform`, `opacity`, and `clip-path` animate;
durations stay 150–400ms; easing comes from `tokens.css` / `lib/motion.ts`; every motion is
visible-by-default and enhanced (see Performance); nothing loops, nothing runs continuously,
nothing parallaxes; scroll work is `IntersectionObserver` only — the reveal hook and the nav's
active-section observer, each disconnecting when it is done — never a scroll handler doing layout;
and every motion above respects `prefers-reduced-motion`.

**Nav active-section underline** is a flat 2px bar pinned to the links row and driven by two
transforms only: `translateX` to move it under the active label and `scaleX` (with
`transform-origin: left center`) to stretch it to that label's width. Scaling X leaves the 2px
thickness untouched; the element's `width` is set instantly and never animated. The bar is
Framer-free (a CSS transition on `transform`), so the nav keeps working before the motion chunk
lands.

**Hover and press.** On `(hover: hover) and (pointer: fine)` only, hovering a plate shifts the
screenshot 4px up and fades in a small `ArrowUpRight` in its corner (meaningful: it opens the
detail panel) and tints the plate with `--accent-tint-strong`. On touch, the arrow is always
visible (never hover-only information) and `:active` gives a flat press tint over 150ms or
less. Focus-visible rings are unchanged and always `accent`.

### Project detail panel (shared element)

The `Details` button opens a **detail panel** that shares the screenshot and title with the plate
through Framer Motion `layoutId` (`project-<id>-shot`, `project-<id>-title`), so the image and
heading travel rather than fade. A click on the screenshot opens the same panel as a pointer-only
shortcut. The panel carries the deeper proof: title, status, stack, the full description, every
highlight, the mobile screenshot when one exists, and the `Play demo` link when the data has one.

- **Built on a native `<dialog>`**, opened with `showModal()`: the browser supplies the modality,
  the focus trap, `Escape` to close, and the `::backdrop` layer. A thin wrapper still returns
  focus to the plate's `Details` button on close — whichever route opened the panel — sets
  `overflow: hidden` on `<body>` while open (no scroll behind, no layout shift), and closes on a
  backdrop click. Only one panel is ever open.
- **On phones the panel is a full-screen sheet** (`inset: 0`, 0 radius, its own scroll region,
  safe-area padding). From 768px up it is a centred plate, at most `min(100% - 2rem, 48rem)`
  wide, with the 8px radius on the media only and 0 on the container.
- **Both images in the morph are exactly 16:10, and that is load-bearing.** The panel's screenshot
  is capped at 60svh **by width** (`max-width: min(100%, 96svh)`), never by `max-height`: a height
  clamp would leave the panel box a different shape from the plate's, and the shared-element scale
  would then stretch X and Y by different factors — a screenshot visibly stretching mid-animation.
  Capping the width keeps the ratio and derives the height from it, so the morph is always a
  uniform scale.
- **`live` and `repo` links stay on every plate.** The panel is extra detail, never the only
  route to a project's live demo or code.
- The `::backdrop` is a flat alpha fill — never a gradient, never `backdrop-filter`.
- Motion: the `layoutId` morph is an enhancement layered over the dialog; nothing animates
  height. Under reduced motion the dialog simply appears, already complete.

## Images and the image pipeline

Every **featured** project is expected to carry a screenshot: **16:10, 8px radius, 1px `border`
edge**, shown both in its grid plate and in the detail panel. The More-projects list stays
image-free. The hero and nav stay text-only, so LCP is unaffected by any image. **A featured
project with no image is not an error:** its plate renders as a text-only plate with no empty
box, no placeholder, and no reserved gap, so a screenshot can be added or removed in data alone.

- **`image` (expected on featured projects)** — a `{w}` template such as
  `/images/smdb-browse-{w}.webp`. It expands to real 480/768/1200w `srcSet` candidates with
  `sizes`; a plain URL stays a single `src` rather than inventing candidates that could 404.
- **`imageAlt` (required whenever `image` is set)** — authored, descriptive text such as
  "SMDB browse screen with genre filters open". **The guard treats a missing `imageAlt` as bad
  data on the image, not on the project**: it strips the image (warn naming the project's `id`)
  and keeps the project, which then renders text-only. A project is never dropped over an image,
  and an image is never shipped with decorative or empty alt text.
- **`imageMobile` (optional)** — a second, phone-shaped screenshot used in a `<picture>` source
  at `max-width: 767px`, so a phone reads a phone-shaped shot instead of a shrunken desktop
  one. It uses the same three widths and the same `imageAlt` (one `<img>`, one alt).
- **`demo` (optional)** — a click-to-play demo URL, rendered in the detail panel as a
  `Play demo` link (lucide `Play`, a meaningful icon) that opens the URL and never embeds a
  player. **Nothing autoplays, ever**: there is no `<video>`/`<audio>`/iframe on the page, so
  autoplay is impossible by construction.

Every `<img>` carries `width`, `height`, `alt`, `loading="lazy"`, `decoding="async"`, and
`srcSet`+`sizes` where candidates exist; the 16:10 box is enforced in CSS with `aspect-ratio`
and `object-fit: cover; object-position: top` (matching the script's top-anchored crop), so any
source ratio lands without shift. Images sit below the fold in every layout, so all of them are
lazy.

### Build script (`scripts/build-images.mjs`)

`sharp` is a dev dependency (approved), used only by this script — never shipped.

- `npm run images` reads every original in `assets-src/` (png, jpg, jpeg, webp, avif) and writes
  WebP (quality 80) at **480, 768, and 1200px wide** to `public/images/`, named
  `<name>-480.webp`, `<name>-768.webp`, `<name>-1200.webp` — exactly matching the `{w}`
  template the data uses (`/images/<name>-{w}.webp`). A phone-shaped original named
  `<name>-mobile.png` writes `<name>-mobile-{w}.webp` the same way.
- Cropping is **anchored to the top**, never centred, so the app header and nav survive; a
  source that is **already 16:10 (within 1px) is not cropped at all**, only resized.
- It prints a per-file size table, skips outputs newer than their source, and fails loudly on an
  unsupported format rather than writing a broken candidate.
- Originals in `assets-src/` are the owner's to keep or ignore; `public/images/` outputs are
  committed so a static deploy needs no build-time image step. README documents the one command
  and the naming rule.

## Performance

**Gate, Lighthouse mobile:** Performance ≥ 90, **LCP < 2.5s, CLS < 0.1**. Accessibility ≥ 95 and
Best Practices ≥ 90 stay separate gates. **JavaScript budget: about 95 KB gzip initial and about
35 KB gzip deferred** for the motion chunk; this replaces the earlier 75 KB estimate, which the
React floor alone made unreachable (see Bundle size below).

Two structural decisions carry most of this:

1. **The hero wipe is CSS keyframes**, so the first screen needs no animation JavaScript and the
   h1 paints as soon as the (preloaded) display font is ready.
2. **Framer Motion loads at the first idle moment after the first commit.** `LazyMotion` takes a
   loader function (`() => import("./motionFeatures")`); it is only ever called from LazyMotion's
   mount effect, and the import itself waits for `requestIdleCallback` (with a `timeout` of 1000ms,
   and a `setTimeout` fallback where it is unavailable), so `domMax` becomes its own chunk that
   leaves the network well after the first screen has painted. `m` stays the only API (`strict`),
   and `domMax` is required because the grid uses `layout="position"` projection and the detail
   panel uses `layoutId`, which `domAnimation` does not ship.

**Reveals are visible by default and only enhanced once motion is ready.** The pre-reveal state
(`opacity: 0`, the 12px offset, the clip-path wipe) is never written in the base stylesheet: it
is applied by Framer only after the motion chunk has resolved — which now means after the first
idle moment — and only to an element that is still below the viewport at that moment
(`src/hooks/useReveal.ts`). A slow, blocked, or failed chunk therefore shows the finished page —
every heading, plate, skill group, and contact link is readable from the first paint — and the
animations simply never run. Anything already on screen when the chunk lands stays visible and
does not animate, so no row ever fades in under the reader's eyes one frame after the paint.
**Nothing on this site is blank while JavaScript loads, and no content is hidden behind a
loader.**

### Bundle size: budget and measured (Step 8 review build)

| Chunk                                                            | Budget (gzip) | Minified   | Measured (gzip) |
| ---------------------------------------------------------------- | ------------- | ---------- | --------------- |
| Initial JS (React, app, and the Framer Motion core)               | ≈ 95 KB       | 306.98 KB  | 98.73 KB        |
| Deferred motion chunk (`domMax` features), fetched at first idle  | ≈ 35 KB       | 85.95 KB   | 28.49 KB        |
| CSS (tokens, type, keyframes, bands, three skeletons, plates, panel, skills, contact, footer) | — | 19.37 KB | 4.22 KB |
| HTML (incl. the inline dot-grid SVG)                              | —             | 2.62 KB    | 1.19 KB         |
| Fonts (Bricolage 700 + Public Sans 400 on first load; 74 KB total for four files) | — | — | ≈ 40 KB |

The deferred chunk is inside budget. The initial chunk is **3.73 KB (3.9%) over the ≈ 95 KB
figure**: Step 6b's grid, More-projects list, dialog wrapper, and image helper added 3.39 KB gzip
over Step 6a's 92.79 KB, Step 7's Skills and Contact sections, their two skeletons, and five
channel/copy icons added a further 2.21 KB gzip, and this review pass — the band utilities, the
hero's dot-grid SVG, and the shared heading-wipe variant — added 0.34 KB gzip. It
is left in place rather than trimmed, because the gate is Lighthouse Performance ≥ 90 with
LCP < 2.5s and these kilobytes do not move either number — but the number is reported rather than
rounded away. If it must come down, the only real levers are the ones below, not a config tweak.

Split measured against a React-only probe built with the same config (**React 19 + react-dom +
lucide + the React Compiler runtime = 223.50 KB minified / 70.30 KB gzip**), the real decomposition
is:

| Part                                 | Gzipped |
| ------------------------------------ | ------- |
| React, react-dom, lucide, compiler runtime | 70.30 KB |
| Framer Motion core (`m`, `AnimatePresence`, the hooks; needed on first render) | ≈ 21 KB |
| App code, section components, project data, icons | ≈ 7.4 KB |
| **Initial JS**                       | **98.73 KB** |
| Deferred `domMax` feature bundle (renderer, animations, gestures, drag, layout) | 28.49 KB |

`m` plus `LazyMotion` is not "no Framer on first paint": the module entry, `motion-dom`, and
`motion-utils` are what the minimal `m` component renders with, and they are ~20 KB gzip of the
initial chunk, which is why the early 75 KB estimate was never reachable — the React-only floor
alone is 70.3 KB gzip. Only the feature implementations (including projection and drag) are
deferred, at 28.5 KB gzip. Against the same build with Framer in the initial chunk (391.66 KB
minified / 126.88 KB gzip, i.e. the two chunks above added together), this arrangement moves
**28.5 KB gzip off the critical path**, and the hero finishes with no motion JavaScript at all.

The idle scheduling does not change these numbers: it changes *when* the deferred chunk is
requested. Reveals stay visible by default until it resolves (see above), so the delay is
invisible except as the absence of motion.

If the initial number needs to come down further, the only real lever is a design change, not a
config tweak: **write the reveals as CSS transitions driven by IntersectionObserver, keep Framer
only for the P3 detail-panel morph, and `React.lazy` that panel**, which would take Framer's core
out of the initial chunk and land it near the React-only floor of ≈ 70 KB gzip. That trades the
shared-element panel's `layoutId` morph and the plates' `layout="position"` reflow for CSS, so it
is a decision for the owner, not a build detail.


### Page weight estimate (updated for images)

Per screenshot candidate, WebP q80 at 16:10 for a UI screenshot: **480w ≈ 45 KB, 768w ≈ 95 KB,
1200w ≈ 175 KB**.

The phone cap is built in as a `<picture>` source, not as a `sizes` lie. `src/lib/images.ts`
returns a second candidate list, `phoneSrcSet`, limited to 480w and 768w, and the plate and the
panel both offer it under `media="(max-width: 767px)"`. `sizes` alone cannot do this job: it is
multiplied by the device pixel ratio, so a `100vw` slot on a DPR-3 phone asks for ≈ 1170 device
pixels and takes the 1200w file whatever the stylesheet says. Capping the candidate list stops it
at 768w, which is the difference between an ≈ 880 KB grid scrolled and an ≈ 565 KB one, at the cost
of a ≈ 1.4x upscale on the sharpest screens. That is a deliberate trade, not an accident: the
images sit near the fold, so they are the LCP candidate, and 45 KB beats 175 KB there. First screen
plus a scroll through Projects therefore transfers roughly:

| Part                                          | 390×844, DPR 3 |
| --------------------------------------------- | -------------- |
| HTML + CSS (measured build)                   | ≈ 22 KB        |
| Fonts (first load)                            | ≈ 40 KB        |
| Initial JS                                    | 98.4 KB (gz)   |
| Deferred motion chunk                         | 28.5 KB (gz)   |
| Lead screenshot (near fold, lazy, 768w)       | ≈ 95 KB        |
| Remaining featured screenshots (3, lazy, 768w)| ≈ 285 KB       |
| **Total after scrolling the whole grid**      | **≈ 569 KB**   |

Images dominate, as they should on a portfolio. The estimates above are deliberately pessimistic:
the seed screenshots are flat UI shots and compress much better than a photograph — measured, 480w
is 18–27 KB, 768w is 39–56 KB, 1200w is 78–111 KB, and the phone-shaped crops are 5–45 KB. The
remaining levers, in order, if Lighthouse flags weight: add a 640w candidate to the script, or drop
the fourth featured project. Neither changes the layout.

### Phone height budget (updated for the grid)

Measured from CSS values at each width; ≈ 640px is visible on a 390×844 phone with the address
bar shown, and ≈ 468px on a 320×568 phone, both below the 56px nav.

| Item                                       | 320px | 390px | 768px | 1440px |
| ------------------------------------------ | ----- | ----- | ----- | ------ |
| Hero (pads, gaps, four lines, buttons)       | 364\* | 332 | 345 | 345 |
| Projects band top pad (the section gap, fluid) | 64  | 64    | 64    | 80     |
| Projects heading + its margin below it       | 56    | 56    | 56    | 56     |
| Chips row (only at 5+ projects)             | 76    | 76    | 76    | 76     |
| Lead plate top pad (offset before its title) | 24    | 24    | 24    | 24     |

\* The 320px figure is the hero's own padding (32 + 40), four 16px gaps, the h1 at 40px, a
two-line headline, a two-line looking-for line, the meta learning line, and a single row of
buttons; the 320px figure is the worst case of those two-line wraps. (The cut tint plate would
have added 8px to each of these numbers; cutting it took them back down.)

What the fold promise is now:

- **390×844 (the primary target):** nav (56) + hero (332) + band top pad (64) + heading and
  margin (56) = 508px, leaving ≈ 132px. The lead plate starts at 508 and its padding plus title,
  status, and stack (≈ 97px) are fully visible, with room to spare. **With chips present** (5+
  projects only) the chips add 76px and the plate's title sits right at the fold — accepted,
  because chips only appear once the list is long enough to need them, and the lead plate is
  still the first thing after them.
- **320×568:** nav (56) + hero (364) + band pad (64) + heading and margin (56) = 540px against
  ≈ 468px visible, so the Projects heading lands just below the fold and the lead plate needs one
  short scroll. That is the accepted floor: the hero never grows past this, and no arrangement of
  the grid can bring the plate above the fold on a 568px-tall screen without shrinking the hero
  copy (which the first-screen rules forbid).
- **768px and up:** the hero, the heading, and the lead plate's screenshot all start inside the
  first screen, so the strongest proof is visible almost immediately; the plate's title and stack
  follow as the reader scrolls into the grid, and the two-column row begins below them.

## Review pass

### Against the Banned list

- **No gradients.** Flat color fills only; the dot grid is an SVG pattern of flat dots and bands
  are flat colors. Confirmed: no gradient function in any stylesheet, and none will appear in code.
- **No emojis.** Confirmed anywhere in UI, copy, README, comments, and seed data.
- No glassmorphism, blur, glow, or drop shadows — structure comes from hairlines, flat bands,
  and space; `backdrop-filter` is banned even for the panel scrim.
- Not the near-black-plus-neon default: dark theme is a cool, blue-leaning charcoal with a soft
  periwinkle accent, and light is the designed-first theme.
- Not the cream-serif-terracotta default: cool neutral grays, grotesque display face.
- **Not identical rounded cards.** The grid is plates with 0 radius, hairline edges, and no
  shadow; hierarchy is expressed by span (lead and fourth block full width, the rest half) and
  by one type step (only the lead is larger), grid rows stretch instead of every box sharing a
  fixed ratio, and the long tail leaves the grid entirely for a compact image-free list.
- No tracked all-caps eyebrows, no 01/02/03 markers, no single-word accent in the headline.
- No filler copy: the headline names the actual stack and focus (React and TypeScript, front
  end); Node and Docker live in the learning line, and a separate line states what is being
  looked for.
- No typing effect, particles, parallax, custom cursors, or autoplay anything. The demo is a
  link, never a player.

### Against REFERENCES.md

Adopted: one identity sentence with proof links at the top (all nine sites); outcome-led
project lines (Abhay); name-plus-one-line artifacts (Paco, Rauno); "currently learning" in the
open (the Now pattern); motion confined to transform/opacity/clip-path at 150–400ms (Brittany's
verified CSS); skip link and visible focus rings (Brittany's craft); a dense bordered grid with
a lead item (the common shape of engineering-portfolio work sections) made specific by 0 radius,
flat bands, and the ledger tail. Rejected: the cloned navy/neon look and numbered headings
(Brittany's appearance); full-screen loaders; dense link directories (Sindre's volume); long
case pages with no summary above them (the plate is the summary, and the panel is the detail).

### What changed from the first approved plan, and why

- **Rows became a grid with a long-tail expander.** Four featured plates read faster than an
  unbounded row list, and the expander keeps the page short without hiding work. The ledger row
  survives where it still wins: the image-free More list.
- **The hero wipe left the animation library.** It was the last reason Framer Motion had to be
  on the critical path; as CSS keyframes it makes the first screen depend on nothing but HTML,
  CSS, and one font.
- **Motion was formalised into an inventory** instead of two sentences, because the plan earned
  the right to more motion (panel, headings, stagger, nav) and each addition now has a stated
  trigger, property set, duration, and reduced-motion behaviour.
- **Images became a pipeline rather than a hope.** Seed data had none, so the rule was "the
  layout must not change shape when images arrive"; now that featured projects are expected to
  carry a screenshot (and render cleanly without one), the ratio, radius, border, alt rule, and
  three-width WebP outputs are fixed and scripted, and the weight is estimated instead of
  assumed.

### Second review pass (corrections applied)

- **The imageAlt guard strips the image, not the project:** it warns with the project `id` and
  renders that project text-only, so bad image data can never remove a project from the site.
- **Reveals are visible by default.** The pre-reveal state lives in Framer only, never in the
  base CSS, and it is applied only to an element that is still below the viewport at the moment
  the motion chunk resolves (`useReveal`): a slow, blocked, or failed chunk shows a complete static
  page, and nothing already on screen ever blinks out or animates.
- **Spans are recomputed from the visible set** (no orphan cell for any count, including after a
  filter) and plates travel with `layout="position"`, which animates translation without scaling
  media or type.
- **The detail panel is a native `<dialog>`** (`showModal()`, focus trap, `Escape`, `::backdrop`,
  scroll lock) and becomes a full-screen sheet on phones. `live` and `repo` links stay on every
  plate, so the panel is never the only route to a project.
- **The nav underline is a flat 2px bar moved with `translateX` and stretched with `scaleX`**,
  which keeps transform-only motion and a constant 2px thickness.
- **Motions are prioritised**, the top three (hero wipe, scroll reveals and heading wipes across
  all sections, detail panel) are built first, and at most two run at once.
- **The image script anchors its crop to the top** and leaves an already-16:10 source uncropped.
- **A featured project without an image renders cleanly** — no empty box, no placeholder, no gap.

### Third review pass (full audit against AGENTS.md)

An audit of the whole site against the Banned list, the design rules, and the Definition of done
found the built page consistent with the plan except in the places listed here. Everything below
was fixed in this pass; the deferred items are named at the end.

- **The background system was specified but never built.** The bands and the hero dot grid were
  two paragraphs of this document and were absent from the page. Both are built now (see *Section
  bands* and *Background elements* above). The third element specified in that pass, the
  accent-tint plate behind the hero's action row, was built and then cut the same day after
  review: in dark theme it composited within a few RGB steps of the `surface` band and its 8px
  outdent broke the left spine. *Background elements* records the reasoning.
- **The P2 heading wipes were missing** while P2 was marked done: only the content reveals
  existed. Section headings now wipe in with `clip-path` through the same `useReveal` contract as
  the plates, so a blocked chunk still shows a complete heading.
- **`Profile.bio` was required and rendered nowhere.** Worse, the guard required it, so deleting
  a field that never appears would have thrown and replaced the whole hero with an error state.
  It is optional now, the placeholder sentence is gone from `profile.json`, and the reason is
  recorded in `src/types.ts`: the hero is budgeted to four lines, and a bio paragraph would push
  the lead plate's stack below the fold at 390px. A later "about" line can read the field without
  a data change.
- **The two underlines that carry the "this is a link" cue were drawn in `--border`**, the color
  this document declares decorative-only and exempt from 3:1 (1.27:1 light, 1.44:1 dark). A cue
  that carries information cannot be drawn with a decorative value: the contact row labels and the
  footer link now underline in `muted` (5.64–6.41:1), and the accent still takes over on hover and
  press.
- **The nav monogram is gone.** It was not in either wireframe, it was `aria-hidden` (so it said
  nothing to assistive tech), it repeated the h1's name, it was not a link, and it was the only
  reason the nav fetched the profile — a second `getProfile()` call, and in Phase 3 a second
  request for the same payload. Removing it left the nav with no data dependency at all.
- **`body` had `min-height: 100svh` with no fallback**, against the rule that `svh`/`dvh` always
  ships with a `100vh` line before it.
- **Verified clean, not just claimed:** all 38 text and UI pairings (both themes) computed from
  the tokens — every one passes; zero gradient functions and zero emojis in the shipped output;
  one global `:focus-visible` ring and no `outline: none` anywhere; reduced motion turns off the
  hero keyframes, every reveal, the plate layout animation, and the shared-element morph; the
  pointer-only screenshot shortcut does not trip axe's `aria-hidden-focus` (its checks read
  `tabbableElements`, and `tabindex="-1"` is focusable but not tabbable — confirmed in the
  axe-core source); no `max-width` media queries anywhere; `100vh` appears once, as the documented
  fallback behind `100dvh` in the panel; every tap target is ≥ 44px; no scroll listeners, no
  looping animation, no `will-change`, no `backdrop-filter`.
- **Still deferred, by its own rule:** motion rule 4 keeps P4 to P6 until P1 to P3 are right. The
  filter reflow and the More-projects rows are built; still to build are the chip stagger (P4),
  the nav's sliding underline bar (P5), and the hover arrow, 4px screenshot shift, plate tint, and
  plate press tint (P6).

## Data model deltas (for the type layer and the guard)

- `Project.image` — optional, expected on every `featured` project; `{w}` template. Its absence
  renders a clean text-only plate.
- `Project.imageAlt` — **required whenever `image` is set**; the guard **strips the image**,
  warns with the project `id`, and keeps the project. It never drops the project.
- `Project.imageMobile` — optional; same template and widths, phone breakpoint source, same alt.
- `Project.demo` — optional URL; rendered as a link in the detail panel, never autoplayed.
- `Project.featured` — unchanged, but at most 4 are shown in the grid; the rest, plus every
  non-featured project, render in the More-projects list.
- `Profile.bio` — **optional and not rendered.** The hero is budgeted to four lines (see the
  height budget), so a bio paragraph has no place on the first screen; the guard no longer
  requires the field, which means removing it from `profile.json` cannot break the page.
