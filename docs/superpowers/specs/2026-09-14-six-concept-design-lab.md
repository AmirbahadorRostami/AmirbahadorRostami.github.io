# Six-Concept Portfolio Design Lab Specification

**Status:** Implemented and verified on 2026-09-15

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
- Typography: Space Grotesk Variable with restrained utility copy.
- Hero: artistic asymmetry with monumental type and one project image entering from the lower-right edge.
- Work: dense editorial plates separated by hairlines, with project facts arranged as an index rather than chips.
- Music: an infinite typographic track marquee followed by three playable destinations.
- Motion: pinned work heading plus image scale/fade as project plates enter and leave.
- Shape language: sharp rectangles; rounded corners only on the inline hero image mask.

### Type/Image Collision

Reference: Elvina Prasad.

- Palette: black, white, smoke gray; no chromatic accent.
- Typography: Archivo Variable with narrow utility copy.
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
- Typography: Archivo Variable with a compressed headline treatment.
- Hero: artistic asymmetry with a narrow vertical project frame and oversized broadcast-style statement.
- Work: sharp full-bleed media sequence with coral active-state typography.
- Music: continuously moving title transmission that pauses on focus and hover.
- Motion: pinned section changes plus card stacking.
- Shape language: hard crop frames and rules.

### Clau Poster Wall

Reference: clau.as.kee.

- Palette: flat periwinkle, black, and one signal green. The periwinkle is a solid field, never a gradient.
- Typography: Space Grotesk Variable with intentionally oversized black letterforms.
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

The approved licensing ruling replaces Satoshi with Space Grotesk and Cabinet Grotesk with Archivo; Outfit and Geist remain. All four families are locally bundled Fontsource variable packages licensed under OFL-1.1. No Fontshare binaries, remote font CSS, or runtime font-service requests are part of the lab.

Self-host the variable packages through the build rather than loading external font CSS at runtime. Each page loads only its selected family, and lab utility text inherits that active family.

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

## Final verification record

Verification on 2026-09-15 used Node 24 and the merge base `434459b1d950aa5a0faf77c5e9f8e2a22df38cc0`.

- The full repository command passed 58 unit tests, an Astro check with 0 errors, 0 warnings, and 0 hints, a 19-page static build, 172 standard browser tests, and 1 contact-fallback browser test before the final focus regression was added.
- A production-preview geometry pass checked the hub and six concepts at 390×844, 768×1024, 1024×768, and 1440×900: 28 route/viewport combinations and 476 focusable targets. It found no document overflow after the verified focus-ring fix.
- Desktop hero line counts for Poster Index, Type/Image Collision, Darkroom Cinema, Printed Signal Lab, Coral Broadcast, and Clau Poster Wall were respectively 2, 1, 3, 3, 2, and 3.
- Printed Signal Lab uses six complete single-column rows at 390 and 768 pixels, then fills all twelve columns as `7+5`, `4+8`, and `6+6` at 1024 and 1440 pixels.
- Full-page production-preview screenshots showed readable media overlays and no empty reserved dense-grid cells at all four review widths.
- The merge-base diff contains only lab routes, lab-only shared files, the new lab test files, lab dependencies, and this documentation. Production pages, the production header/footer, existing production components, and pre-existing tests are unchanged.
- `npm audit --omit=dev` reports three pre-existing findings in Astro/esbuild/sharp (1 low, 1 high, 1 critical). `npm audit` adds the pre-existing Vitest/@vitest/mocker chain for five total findings (1 low, 2 moderate, 1 high, 1 critical). GSAP and the four Fontsource packages introduce no reported production vulnerability. The available blanket remediation requires forced breaking upgrades and is intentionally deferred.
- The successful test commands still emit pre-existing Astro Markdown deprecation notices in two unit tests and Playwright's `NO_COLOR`/`FORCE_COLOR` environment notice; Astro's own diagnostic result remains clean.
