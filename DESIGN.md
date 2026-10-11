# DESIGN.md — design plan (Phase 1)

Concept in one sentence: **a left-aligned work ledger** — identity at the top, then proof,
where each project is a full-width row on hairlines instead of a card in a grid, and the only
theatrical motion is the name assembling itself once on load.

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
| background  | `#F7F8F9`  | `#12151A`  | Page background                                             |
| surface     | `#FFFFFF`  | `#1B2027`  | Raised areas: code blocks, expanded highlight panels        |
| text        | `#14181F`  | `#E8EAED`  | Headings, body                                              |
| muted       | `#5B6470`  | `#9AA3AE`  | Meta, descriptions, status labels, unselected chips         |
| border      | `#D9DEE4`  | `#2C333D`  | Hairlines and dividers only (decorative)                    |
| accent      | `#1F4FD8`  | `#7FA2FF`  | Links, focus rings, primary button, selected chip, live status |

Derived (alpha of accent only): `--accent-tint` = accent at 10% (selected chip background);
`--accent-tint-strong` = accent at 5% on surface (row hover). Verified below.

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
| text on row-hover tint           | 16.48  | pass   |
| muted on row-hover tint          | 5.55   | pass   |
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
| text on row-hover tint           | 12.11  | pass   |
| muted on row-hover tint          | 5.72   | pass   |
| accent focus ring on bg/surface  | 6.6+   | pass   |

**Failures, and the rule that resolves them:** the hairline `border` colors score 1.27–1.44
against their backgrounds — below the 3:1 required of *UI component boundaries*. They are used
only as decorative dividers (row separators, section rules), which WCAG 1.4.11 exempts. Any
boundary that identifies a control — chip outlines, button edges, input borders — uses `muted`
(5.64–6.41, pass) or `accent`. Focus rings are always `accent` at 2px with 2px offset. No
information is carried by a decorative border alone.

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
| Section head   | `clamp(1.5rem, 5vw, 2rem)`             |                                |
| Project title  | `clamp(1.125rem, 3vw, 1.375rem)`       |                                |
| Body           | `1rem` (16px)                          | max width 62ch, line-height 1.6|
| Meta           | `0.875rem`                             | stack strings, statuses        |

Headings use `text-wrap: balance`; paragraphs `text-wrap: pretty`. Body measure stays under
70 characters everywhere.

## Layout

Left-aligned, single column, one scale. Spacing base 4px. Radius scale with intent:
`0` for structure (rows, rules, panels), `4px` for controls (buttons, chips), `8px` for media
(screenshots). Breakpoints (min-width only): 640, 768, 1024, 1280. Container:
`width: min(100% - 2rem, 64rem)` with `padding-inline` and safe-area insets.

### Hero wireframe (320px phone → desktop)

```
 phone (320px)                 desktop (>=1024)
 +--------------------------------+  +-------------------------------------------+
 | [skip to content]              |  | [skip to content]                        |
 | Projects Skills Contact [theme]|  | sticky nav: Projects Skills Contact      |
 +--------------------------------+  | [theme toggle]                           |
 |                                |  +-------------------------------------------+
 | Wahaj Gul                      |  | Wahaj Gul                                 |
 |                                |  |                                           |
 | React and TypeScript           |  | React and TypeScript on the front end.    |
 | on the front end.              |  |                                           |
 |                                |  | Looking for a React developer role.       |
 | Looking for a React            |  |                                           |
 | developer role.                |  | Currently learning: Docker, Linux, Node   |
 |                                |  |                                           |
 | Currently learning:            |  | [View projects]  [Contact]  [Resume]      |
 | Docker, Linux, Node            |  |                                           |
 |                                |  +-------------------------------------------+
 | [View projects] [Contact]      |
 | [Resume]                       |
 +--------------------------------+
```

Sticky nav is 56px tall on phones and holds one row with no logo, as drawn. The math at
320px: the container is `min(100% - 2rem, 64rem)`, so 288px of content width. Label
estimates at 16px Public Sans 600 (re-measured at build): "Projects" ≈ 62px + 16px padding
= 78px, "Skills" ≈ 44 + 16 = 60px, "Contact" ≈ 54 + 16 = 70px; 8px gaps between the three
targets = 16px; theme toggle 44px. Total = 268px, 20px slack. The logo monogram is not
shown below 640px at all. If a future label change breaks the fit, the theme toggle moves
from the nav into the hero's action row; the links themselves never collapse into a
hamburger, because three links do not justify a menu.

The hero is content-height: vertical padding plus its content, no viewport-relative height
at all — no `min-height` in `dvh`/`vh`, ever. Rechecked budget with the hero buttons
wrapping to two rows: on a 390x844 phone ≈ 640px is visible with the address bar shown;
nav 56 + hero ≈ 382 (32 top pad, name 42, headline ≈ 56 over two lines, looking-for 28,
learning 28, buttons 96 as two wrapped rows with an 8px gap, 40 bottom pad, 12–24px gaps)
= ≈ 438px, leaving ≈ 200px: the Projects heading and the top of the first row — title,
status, and stack — still visible without scrolling. On a 320x568 phone the same content
runs ≈ 494px against ≈ 468px visible, so the first row needs one short scroll while the
Projects heading stays on screen; that is the accepted floor, and the hero never grows
past it.

### Projects wireframe (320px phone → desktop)

```
 phone (320px)               desktop
 +----------------------+    +------------------------------------------+
 | Projects             |    | Projects                                 |
 |                      |    |                                          |
 | -------------------  |    | +--------------------------------------+ |
 | Example Project      |    | | featured row: large title,          | |
 | (featured)           |    | | screenshot, problem line,            | |
 | live                 |    | | status, stack, outcome, links        | |
 | React, TypeScript    |    | +--------------------------------------+ |
 | one line: problem    |    |                                          |
 | solved               |    | [All] [React] [TypeScript] [Node] [...] |
 | [View project] [Code]|    | (chips only when >= 5 projects)        |
 |                      |    |                                          |
 | [All][React][Node]   |    | ------------------- ... ----------------|
 | (chips only when     |    | Example Side Project                     |
 | >= 5 projects)       |    | in progress                              |
 |                      |    | Node, Express                            |
 | -------------------  |    | ...                                      |
 | Example Side Project |    +------------------------------------------+
 | in progress          |
 | Node, Express        |
 | ...                  |
 +----------------------+
```

The featured row is always first, directly under the heading; the filter chips sit between
the featured row and the rest, and render only when there are 5 or more projects (a shorter
list does not need filtering).

Status and stack are separate elements in the DOM and on screen — a status line, then a
stack list beneath it — never a combined meta string (no middle dots anywhere).

Cards are not used. Projects are **rows separated by 1px hairlines**: featured project first
(larger title, screenshot at `8px` radius), the rest compact. Status is a plain word —
`live` in accent, `in-progress` and `planned` in muted — never color alone, since the word is
the information. Stack strings sit in meta type. Highlight expansion: the toggle is a real
`<button>` with `aria-expanded` and `aria-controls` pointing at the panel's `id`; the panel
never animates height — it fades in with `opacity` only — and the rows below it reposition
through Framer Motion `layout="position"` (position only, never size), so nothing measures
or tweens a height value. Filter chips derive from the union of stack values, render only
when there are 5 or more projects, wrap onto multiple lines, and are 44px minimum targets.

Skills: group heading + a plain wrapped list of items, no bars, no stars, no icons.
Contact: a list of links; email uses `mailto:` and a "Copy email" button with a lucide
`Copy` icon (meaningful icon, per stack rules).

## Signature moment

The hero entrance: the name, then the headline, then the "currently learning" line reveal in
sequence through a `clip-path` inset wipe with a 12px rise — three steps of 400ms with a 90ms
stagger (starting at 0, 90, and 180ms), easing `cubic-bezier(0.22, 1, 0.36, 1)`, complete at
580ms. The text nodes are present as soon as React mounts — assistive tech and search see
the full content immediately after hydration — while visually each line is uncovered by its
own step; the
h1 is the first step, so it begins revealing at 0ms and is never fully hidden for more than
400ms. It runs once on load, never repeats, depends on nothing (no hover), and is fully
disabled under `prefers-reduced-motion`, where everything simply appears.

Everything else in the motion budget is a response: chip filtering with `AnimatePresence` +
`layout`, highlight expansion, hover/focus on rows and buttons. The theme toggle switches
instantly with no crossfade — color changes snap, and nothing in the page transitions color
on theme change. Scroll reveal exists only on the Projects rows (stagger 12px, light). Only
`transform`, `opacity`, `clip-path` animate. Durations 150–400ms, defined once in
`tokens.css` and `lib/motion.ts`. Framer Motion runs through `LazyMotion` with `domAnimation` and the `m`
component. Nothing loops, nothing runs continuously, and any motion that reads as choppy at
4x CPU throttling gets removed in review.

## Review pass

### Against the Banned list

- **No gradients.** Flat color fills only; the two tints are flat alpha washes of the accent,
  not gradients. Confirmed: this plan contains no gradients, and none will appear in code.
- **No emojis.** Confirmed anywhere in UI, copy, README, comments, and seed data.
- No glassmorphism, blur, glow, or drop shadows — structure comes from hairlines and space.
- Not the near-black-plus-neon default: dark theme is a cool, blue-leaning charcoal with a
  soft periwinkle accent, and light is the designed-first theme.
- Not the cream-serif-terracotta default: cool neutral grays, grotesque display face.
- No identical rounded cards: the projects section is a row list; radius scale is 0/4/8 with
  roles.
- No tracked all-caps eyebrows, no 01/02/03 markers, no single-word accent in the headline.
- No filler copy: the headline names the actual stack and focus (React and TypeScript, front
  end); Node and Docker live in the learning line, and a separate line states what is being
  looked for.
- No typing effect, particles, parallax, custom cursors, or autoplay anything.

### Against REFERENCES.md

Adopted: one identity sentence with proof links at the top (all nine sites); outcome-led
project lines (Abhay); name-plus-one-line artifacts (Paco, Rauno); "currently learning" in the
open (the Now pattern); motion confined to transform/opacity/clip-path at 250–400ms
(Brittany's verified CSS); skip link and visible focus rings (Brittany's craft).

Rejected: the cloned navy/neon look and numbered headings (Brittany's appearance); full-screen
loaders (Brittany's loader spends the recruiter's 15 seconds); dense link directories
(Sindre's site needs his volume to work); long case pages with no summary above them (the
ledger row *is* the summary, with details expanding in place).

### What changed from a generic version, and why

A generic version of this plan would be a dark hero with a gradient blob, a 3-column card
grid, and skills with progress bars. Changed: projects became a row ledger because rows
communicate hierarchy (one featured, many compact) without the identical-card ban;
screenshots became optional per-row media because seed data has none and the layout must not
change shape when images arrive; the signature moment was reduced to a sub-second mask wipe
because the mobile spec forbids delaying the first screen and the 15-second recruiter budget
cannot be spent on animation.
