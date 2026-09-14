# Six-Concept Portfolio Design Lab Specification

**Status:** Approved for implementation on 2026-09-14

## Objective

Build an unlinked, `noindex` design-lab area inside the existing Astro portfolio so six complete homepage directions can be compared in a browser without changing the production homepage. Each concept must use Amir Rostami's real portfolio content and media while presenting a genuinely different visual system, layout rhythm, and motion language.

## Audience and conversion priorities

The portfolio serves four audiences:

1. Employers evaluating Amir for creative-technology and engineering roles.
2. Clients considering freelance product, interactive, installation, or technical work.
3. Curators and institutions considering exhibitions, commissions, or residencies.
4. Listeners and collaborators discovering Amir's music.

Employment and freelance inquiries remain the primary conversion goals. Exhibition, commission, residency, and music opportunities remain visible secondary paths.

## Existing-site audit summary

The current site is clear, usable, and semantically sound, but its visual language relies on familiar creative-developer conventions: Inter and monospace typography, neon teal on charcoal, a glowing signal graphic, repeated section introductions, and equal bordered cards. The redesign lab must test stronger identity systems rather than cosmetically recoloring the existing component grid.

The strongest existing foundations to preserve are:

- direct, playful positioning copy;
- clear location and availability information;
- real project imagery;
- the three flagship projects: Encounters, Luminous Trails, and Remote Realities;
- selected music plus a path to the full archive;
- a curated professional timeline;
- semantic navigation, skip links, keyboard support, visible focus, and reduced-motion behavior.

## Lab architecture

The lab lives under `/design-lab/` and is not linked from the production header or footer.

- `/design-lab/` is a neutral comparison index.
- `/design-lab/poster-index/`
- `/design-lab/type-image-collision/`
- `/design-lab/darkroom-cinema/`
- `/design-lab/printed-signal-lab/`
- `/design-lab/coral-broadcast/`
- `/design-lab/clau-poster-wall/`

Every route is statically generated for GitHub Pages. Lab pages use `noindex, nofollow`; this prevents search indexing but is not access control. Anyone with the exact URL can view them after deployment.

The six concepts share only content loading, metadata, accessibility primitives, font assets, and motion utilities. Their page composition and styling remain independent so the comparison does not collapse into six themes applied to one template.

## Shared content contract

Every concept includes:

- a concept-specific navigation bar with links to Work, Music, Experience, Contact, and the lab index;
- the approved identity statement: “Creative tinkerer. Musician. Professional maker of curious things.”;
- a supporting sentence about immersive experiences, software, sound, and human connection;
- Toronto location and current employment/freelance availability outside the hero's primary headline;
- Encounters, Luminous Trails, and Remote Realities with real local media and links to their full case studies;
- Float, Flow, and La Paloma with external listening links and a path to the music archive;
- three selected experience entries;
- a contact action linking to `/contact/`;
- no invented clients, awards, testimonials, statistics, services, or project outcomes.

## Universal visual constraints

- No purple gradients.
- No glossy 3D SaaS blobs, floating spheres, or decorative texture blobs.
- No generic stock photography. Use only Amir's project and profile media.
- No rounded-everything friendliness. Most surfaces are square; rounding is reserved for image masks when structurally meaningful.
- No icon-grid feature rows.
- No Inter or system-font-only typography.
- No evenly distributed rainbow palettes. Each direction is achromatic or uses one concentrated accent.
- No labels such as “SECTION 01,” “QUESTION 05,” or “ABOUT US.” Descriptive labels such as “Selected work” are permitted only where they improve comprehension.
- No invisible or low-contrast controls.
- No hero headline longer than three rendered lines at supported desktop widths.
- No horizontal page overflow at 390, 768, 1024, or 1440 CSS pixels.

## Page structure

Each concept follows the AIDA sequence while remaining compositionally distinct:

1. Navigation.
2. Attention: a wide two-to-three-line hero.
3. Interest: a dense, gapless presentation of flagship work and music.
4. Desire: a motion-led project or experience chapter.
5. Action: a high-contrast contact statement and useful footer links.

Desktop dense grids use twelve columns and fill complete rows with `7+5`, `4+8`, and `6+6` spans. `grid-auto-flow: dense` is required. Tablet and mobile layouts remove fixed spans rather than reserving empty cells.

## Concept directions

### Poster Index

Reference: Doug Alves.

- Palette: warm espresso, bone, graphite, one muted mint signal.
- Typography: Satoshi Variable with a restrained monospace utility face.
- Hero: artistic asymmetry with monumental type and one project image entering from the lower-right edge.
- Work: dense editorial plates separated by hairlines, with project facts arranged as an index rather than chips.
- Music: an infinite typographic track marquee followed by three playable destinations.
- Motion: pinned work heading plus image scale/fade as project plates enter and leave.
- Shape language: sharp rectangles; rounded corners only on the inline hero image mask.

### Type/Image Collision

Reference: Elvina Prasad.

- Palette: black, white, smoke gray; no chromatic accent.
- Typography: Cabinet Grotesk Variable with narrow utility copy.
- Hero: editorial split whose project imagery passes between layers of oversized type.
- Work: horizontal accordion panels that expand to reveal project copy.
- Music: black-and-white title carousel with overlapping square thumbnails derived from project media.
- Motion: sequential text reveal plus image scale/fade.
- Shape language: hard edges and deliberate overlap.

### Darkroom Cinema

Reference: OPX Studio.

- Palette: near-black, warm white, graphite.
- Typography: Geist Variable using broad display spacing and quiet body copy.
- Hero: cinematic center over a full-bleed Luminous Trails image with a dark wash.
- Work: three full-viewport media chapters with a pinned project index.
- Music: minimal horizontal listening strip with duration and platform text.
- Motion: scroll pinning and image scale/fade with reduced-motion static fallbacks.
- Shape language: full-bleed rectangles, no cards and no decorative rounding.

### Printed Signal Lab

Reference: OFF+BRAND.

- Palette: parchment, carbon, oxide red.
- Typography: Outfit Variable with monospaced technical annotations.
- Hero: editorial split with a flat CSS/SVG moiré signal instrument; no sphere, blur, or glossy gradient.
- Work: a complete three-row twelve-column grid resembling a printed technical sheet.
- Music: waveform-like typographic rows with external listening actions.
- Motion: scrubbed text reveal and card stacking.
- Shape language: circles, hairlines, and square modules; no soft product cards.

### Coral Broadcast

Reference: Channel Studio.

- Palette: black, soft bone, concentrated coral.
- Typography: Cabinet Grotesk Variable with a compressed headline treatment.
- Hero: artistic asymmetry with a narrow vertical project frame and oversized broadcast-style statement.
- Work: sharp full-bleed media sequence with coral active-state typography.
- Music: continuously moving title transmission that pauses on focus and hover.
- Motion: pinned section changes plus card stacking.
- Shape language: hard crop frames and rules.

### Clau Poster Wall

Reference: clau.as.kee.

- Palette: flat periwinkle, black, and one signal green. The periwinkle is a solid field, never a gradient.
- Typography: Satoshi Variable with intentionally oversized black letterforms.
- Hero: cinematic center presented as a single poster-like typographic composition.
- Work: monumental project names with inline image apertures and an anti-card poster wall.
- Music: large-scale horizontal marquee acting as the transition into listening links.
- Motion: scrubbed text reveal and image scale/fade.
- Shape language: flat planes, no shadow, no gloss, no rounded containers.

## Motion system

Use GSAP and ScrollTrigger through one shared initializer. Astro pages remain statically rendered and usable without JavaScript. JavaScript progressively enhances elements carrying explicit `data-lab-*` attributes.

- Scroll pinning activates only above 900 CSS pixels.
- Image scale begins no lower than `0.88` to avoid theatrical zoom excess.
- Text words may reveal from `0.14` to `1` opacity while scrubbing.
- Stacked project plates retain readable headings at every scroll position.
- Marquees pause when hovered or keyboard-focused.
- `prefers-reduced-motion: reduce` disables pinning, scrubbing, continuous marquee movement, and transform interpolation.
- Motion cleanup runs before Astro page transitions or hot reload reinitialization.

## Typography and asset delivery

Self-host variable font packages through the build rather than loading external font CSS at runtime. Required families are Satoshi, Cabinet Grotesk, Outfit, and Geist. Each page loads only its selected family plus the shared utility mono family already available locally.

Astro's image pipeline serves the existing WebP project assets with descriptive alt text. Decorative crops use empty alt text; linked project images retain meaningful project-specific descriptions.

## Accessibility and responsive acceptance criteria

- All routes contain one `h1` and a logical heading outline.
- A skip link reaches the main content.
- Every interactive element is keyboard reachable with a visible focus indicator.
- Link purpose is understandable without relying solely on motion or color.
- Text and controls meet WCAG 2.1 AA contrast.
- Motion-reduced mode exposes all content without pinned or hidden intermediate states.
- At 390 pixels, navigation remains operable, project content appears in reading order, and no fixed-width typography causes overflow.
- At 1440 pixels, hero headings render in no more than three lines.

## Testing and completion criteria

- Unit tests validate the six-concept manifest, unique slugs, selected fonts, references, and route data.
- End-to-end tests visit the lab index and all six routes.
- End-to-end tests assert shared content, route navigation, hero line-height guardrails, no horizontal overflow, keyboard focus, and reduced-motion visibility.
- Existing portfolio unit, build, accessibility, responsive, and content tests remain green.
- The production homepage and production navigation receive no visual or behavioral changes.
- The lab index provides a concise comparison note and direct links to all six concepts.

