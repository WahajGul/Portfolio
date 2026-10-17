# REFERENCES.md — portfolio research for calibration

Gathered 2026-10-10 by fetching each site's actual HTML/text plus public search results.
Method note: fetched sources show structure, copy, links, and (where raw HTML was available) real CSS.
Rendered visuals, licensed fonts, and motion feel are not directly observable this way; anything not
verifiable is marked as such. This file is for calibration only. Nothing here is copied: no layout,
copy, or assets from these sites may appear in this project.

## The sites

### 1. Lauren Waller — https://lauren-waller.com/ (provided)
- First screen: name, one credential sentence ("Award-winning Product Designer working full-time at
  Detail Technologies – winner of Apple's iPad App of the Year 2025"), a role line ("Framer Developer
  and Partner"), then four text links: Work, About, Shop, Contact. No image, no hero art.
- Layout: single column of large text links; home is essentially a link page, work one click away.
  Copyright line at the bottom.
- Type: structure suggests large display text links with uppercase labels; specific faces not
  observable from the fetched text.
- Motion: not observable from the fetched text.
- Projects: /work is an index of 8 entries, each "Name – Discipline" (e.g. "Superlink – Framer
  Development", "Studio – Product Management"). Disciplines span design, no-code build, product
  management, and photography; each entry opens a case page.

### 2. Abhay Singh — https://www.abhaysingh.in/ (provided)
- First screen: "Design rescue for noteworthy brands", one supporting sentence, and a "See" anchor
  jumping straight to the work list.
- Layout: one long page, left-aligned: headline, work list, an opinion section, then contact with the
  mailto address as the primary link.
- Type: not observable; copy is sentence case throughout, no all-caps labels.
- Motion: not observable from the fetched text.
- Projects: each work entry carries a hard outcome inline before you click anything — "Usage
  increased from 1k → 10k teams, and 20x revenue after two years" (Appsmith), "0 → ₹40m revenue in
  five years" (March), "Revenue up by 12x" (Sleepy Owl). Case pages are long-form narrative: a role
  line listing exact contributions, a story section, then a closing stats block (timeline, revenue,
  repeat customers) and real customer testimonials. Next-project links at the bottom.

### 3. Medhavi Bari — Behance module (provided)
- Could not be opened: behance.net returns 403 to automated fetches. Search results confirm the
  project exists under the title "UI/UX & AI Creative Portfolio". Its contents are not verified here.
  A screenshot or a different URL is needed to study it.

### 4. Brittany Chiang — https://v4.brittanychiang.com/ (frontend-focused reference)
- First screen: a full-screen loader showing a monogram logo, then the name and one sentence:
  "software engineer who specializes in building (and occasionally designing) exceptional digital
  experiences."
- Layout (verified from her CSS): fixed left rail, single page of sections, content column capped at
  1000px, left-aligned, large vertical padding. Section headings are numbered with a CSS counter
  ("01." in mono, followed by the heading and a horizontal rule).
- Type (verified): Calibre (licensed sans) for text, SF Mono for labels and accents, size scale
  defined as CSS variables (12–32px, headings via clamp up to 80px).
- Motion (verified): 250ms cubic-bezier hover transitions; 300ms fade-up/fade-down entrances that
  translate and fade only; smooth scrolling; reduced-motion guards on link transitions. Real
  accessibility craft: skip-to-content link, dashed :focus-visible outline, styled ::selection.
- Projects: experience and project lists with tech stacks and outbound GitHub/live links; links get
  an underline-grow hover in the accent color.
- Caution: this specific look (dark navy + one neon green, numbered headings, mono labels) is now the
  most-cloned developer portfolio on the internet. Copying its appearance reads as templated, which
  AGENTS.md explicitly bans. Its accessibility details are the part worth learning from.

### 5. Josh W Comeau — https://www.joshwcomeau.com/ (case-study/proof-through-writing reference)
- First screen: name, nav (categories, courses, goodies, about), then immediately a feed of articles;
  each item is a title plus a two-sentence teaser that states the problem and why it matters.
- Layout: single content feed, category browse, a "Popular Content" ranked list.
- Type and motion: site is known for playful custom type and interaction (his animation course is a
  product), but specifics are not verifiable from the fetched text.
- Projects: no project grid at all. Proof of skill is the published work itself — interactive
  tutorials ("An Interactive Guide to Flexbox", "An Interactive Guide to SVG Paths") and paid courses.
- Takeaway: every item description answers "what problem does this solve" in one concrete sentence.
  That is exactly the shape a project description should take.

### 6. Lee Robinson — https://leerob.com/ (minimal reference)
- First screen: one bio paragraph — role and current employer first ("engineer and writer. I work on
  ML at SpaceX (formerly at Cursor)"), then previous work (Vercel, Next.js), then a human detail.
  Followed by a short "Notes" link list.
- Layout: single column, text only, no images, no cards, no borders. Blog list with month/year on
  every entry.
- Type and motion: minimal, text-driven; no motion observable in the fetched content.
- Projects: none presented as such. The writing list is the portfolio; work history lives inside one
  bio sentence. Every item is dated.

### 7. Rauno Freiberg — https://rauno.me/ (minimal reference)
- First screen: one sentence ("Rauno Freiberg is an Estonian interaction designer working with
  Vercel and Devouring Details"), then 3–4 links, then a seven-line manifesto ending in "Make it."
- Layout: index page plus bare list pages. /projects is a plain list: name, year, outbound link —
  "History of Software Design 2026", "Web Interface Guidelines 2023", "(Basic) Bookmarks 2023",
  "⌘K 2022".
- Type and motion: not observable from the fetched text.
- Projects: name + year + link, nothing else. The artifacts are real tools people use (cmdk ships in
  Linear), so no description is needed. Confidence through brevity.

### 8. Sindre Sorhus — https://sindresorhus.com/ (minimal, open-source reference)
- First screen: profile photo, name, one job title ("Full-Time Open-Sourcerer & App Maker"), two
  links: Apps and Code (GitHub).
- Layout: directory style — apps grouped by platform and price, plus About, Now, and a "Wall of
  Love" reviews page.
- Type and motion: not observable from the fetched text; structure is a dense, scannable link index.
- Projects: the apps pages are the portfolio and GitHub is the proof; volume of shipped work is the
  signal. He also maintains a public "Now" page.

### 9. Paco Coursey — https://paco.me/ (minimal, frontend reference)
- First screen: name, one-liner with role and current employer ("Crafting interfaces... Webmaster at
  Linear"), past work in the second sentence ("developed the Vercel design system, website, and
  dashboard").
- Layout: five short sections — Building, Projects, Writing, Now, Connect. Three projects max on the
  home page.
- Type: plain text with sparse italic emphasis inside sentences; no headings-as-decoration.
- Motion: not observable from the fetched text.
- Projects: each project is a name plus one line of what it is ("cmdk — Composable command menu React
  component") linking to GitHub. The "Now" section states current focus in a personal paragraph.

## Patterns that repeat across the strong sites

1. The first screen is one plain identity sentence plus one or two proof links. Role and employer
   appear in that sentence, never in a separate badge. (All nine.)
2. Left-aligned single column, text-first. Only Sindre uses a photo; nobody needs a hero image to
   make the first screen work.
3. Three to eight projects, each with a name, one concrete line (what it is, or what changed because
   of it), and an outbound link to a real artifact — repo, live tool, article. (Abhay, Brittany,
   Paco, Rauno, Lauren.)
4. Case-study or teaser copy leads with the outcome: metrics (Abhay), or problem-plus-reason in two
   sentences (Josh). Adjectives never substitute for a result.
5. Plain sentence-case copy in first person, full of concrete nouns ("design system", "command
   menu", "shipping labels"). Zero filler phrases anywhere.
6. Motion is minimal and invisible in the fetched sources; where it is verifiable it animates only
   transform and opacity, 250–300ms, and respects reduced motion. (Brittany's CSS.)
7. Writing or notes lists double as portfolios. (Josh, Lee, Paco, Rauno.)
8. Current focus is stated openly — a "Now" page (Paco, Sindre), a "currently learning" style line,
   or current employer in the bio.
9. Contact is one click from the first screen, usually a plain mailto. (Lauren, Abhay, Paco.)
10. Type is one sans plus one mono accent, or the system default. Personality comes from copy and
    spacing, not from decoration.

## Patterns to avoid

1. The cloned "dev portfolio template" look: near-black background, one neon accent, numbered section
   headings, monospace eyebrow labels. It signals template, and AGENTS.md bans it. (Seen in the
   Brittany Chiang style; keep her accessibility craft, drop the look.)
2. Full-screen loaders that gate the content. Brittany's loader delays the first screen behind
   JavaScript — it spends the recruiter's 15 seconds and hurts LCP.
3. Licensed typefaces we cannot ship (Calibre). Pick freely licensable faces instead.
4. Deep pages with no summary above them. Abhay's case studies are long but work because the home
   page already carries every outcome as a one-line metric. The one-screen answer stays at the top.
5. Decorative chrome bought at complexity cost: heavily styled scrollbars, blur-the-page-on-scroll
   effects. Subtle, but they are motion and complexity with no information value.
6. Hero poetry or taglines. Not one strong site uses them; every first screen is a plain statement.
7. Fake testimonials or invented statistics. Abhay's quotes are real customers. We have none yet, so
   we show projects, honest statuses, and a "currently learning" line instead.
