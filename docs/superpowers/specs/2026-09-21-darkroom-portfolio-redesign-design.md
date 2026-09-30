# Darkroom Portfolio Redesign

**Owner:** Amir Bahador Rostami

**Status:** Implemented and verified

**Date:** 2026-09-21

**Branch:** codex/darkroom-portfolio

**Base:** codex/six-concept-design-lab at 777a152

**Task 13 implementation commit:** 06b3b390 (`test: harden portfolio metadata privacy and bundles`)

## Purpose

Productionize the approved Darkroom Cinema concept as Amir's complete portfolio. The redesign must present Amir as an engineer, artist, musician, and creative technologist to employers, clients, curators, commissioners, and residency programs.

The finished site remains a static Astro application on GitHub Pages. It adds two progressive PixiJS experiences, a dedicated Experiments archive, complete flagship copy, and structured media placeholders without introducing a production server or exposing Amir's email address.

## Success criteria

- The first viewport communicates Amir's creative and technical identity and Toronto location, with a clear path to contact him.
- Employers can identify concrete architecture and implementation responsibilities.
- Cultural audiences can understand each artwork's premise, experience, context, authorship, and technical system.
- The production site carries the Darkroom Cinema visual language across every route.
- The homepage and production subpage heroes share one accessible, resilient PixiJS 10 PRINT experience; BioWords remains a separate interactive experience.
- Missing imagery and video appear as intentional placeholders rather than broken media.
- Work, Experiments, Music, About, Contact, metadata, and redirects build as static pages.
- The site remains usable without JavaScript, WebGL, animation, audio, or third-party embeds.
- The site meets WCAG 2.1 AA, has no horizontal overflow at 320 CSS pixels, and honors reduced motion.

## Audiences and outcomes

Primary outcomes:

1. Employment, freelance, and client inquiries.
2. Exhibition, commission, and residency consideration.

Secondary outcomes:

1. Creative and technical collaboration.
2. Listening and discovery for music released as Baha.
3. A memorable account of a practice spanning software, public space, sound, and interactive art.

## Approved information architecture

Primary navigation:

- Work
- Experiments
- Music
- About
- Contact

Routes:

| Route | Purpose |
| --- | --- |
| / | Generative hero, flagship work, selected Baha music, experience preview, experiments invitation, and contact |
| /work/ | Five-project archive |
| /work/encounters/ | Flagship case study |
| /work/luminous-trails/ | Flagship case study |
| /work/ephemeral-pulses-of-a-finite-scroll/ | Flagship case study |
| /work/biowords/ | Short case study plus live adaptation |
| /work/person-is-a-data-structure/ | Short case study |
| /work/remote-realities/ | Static compatibility redirect to the renamed project |
| /work/cellular-automata/ | Static compatibility redirect to the experiment anchor |
| /experiments/ | Seven generative-video entries |
| /music/ | Eight Baha releases plus platform links |
| /about/ | Biography, portrait, curated experience timeline, education, skills, and LinkedIn |
| /contact/ | Contact form and LinkedIn fallback |
| /404.html | Recovery path |

The design lab remains available as an internal, noindexed reference unless the implementation plan explicitly removes it from production output.

## Approved homepage copy

Eyebrow:

> Creative technologist / musician / nerd

Headline:

> Part engineer. Part musician. Entirely too curious.

Supporting statement:

> I design and build interactive systems, immersive artworks, and digital experiences that explore how technology can change the way people connect.

Actions:

- See what I've been building
- Work with me

Homepage sequence:

1. PixiJS generative hero
2. Three flagship projects in a cinematic grid
3. Three selected Baha tracks in a listening grid
4. Curated experience preview
5. Experiments invitation
6. Contact invitation

The flagship and music sections must be grids, never horizontal carousels or scrolling rows.

## Approved page introductions

### Work

> Things to enter, follow, swing, listen to, and occasionally get lost inside.

> Interactive installations, augmented worlds, living simulations, and the technical systems that make them possible.

### Experiments

> Small systems making big, strange pictures.

> A collection of generative video studies built from cellular automata, simulations, procedural rules, and other algorithms left alone long enough to become interesting.

### Music

> Music by Baha

> Baha is the musical project of Amir Bahador Rostami—a place where electronic and acoustic instruments drift into the same orbit, forming spacey textures, vibrant colours, and sweet harmonies across big landscapes.

Platform order:

1. SoundCloud
2. Spotify
3. Apple Music

### About

> I build systems with a pulse: software that remembers where people have walked, sculptures that listen to movement, and small virtual organisms born from language.

> My name is Amir. I'm an engineer, artist, musician, and persistent tinkerer working in Toronto. Code is one of my materials, alongside sound, light, sensors, space, and occasionally a pile of hardware that looked much smaller in the diagram. I'm most interested in technology when it becomes a place to meet—something people can enter, disturb, and transform together.

Timeline introduction:

> A trail through systems, studios, labs, and classrooms.

> Thirteen stops, each one teaching me a different way to turn ambitious ideas into things people can actually use, inhabit, or hear.

### Contact

> Have a role, a commission, or a strange problem worth solving?

> I'm open to employment, freelance collaborations, exhibitions, commissions, and residencies. Tell me what you're working on, what you need, and where you think I might fit.

Actions:

- Send the signal
- Find me on LinkedIn

## Work archive

The production Work archive contains five entries:

1. Encounters
2. Luminous Trails
3. Ephemeral Pulses of a Finite Scroll
4. BioWords
5. Person Is a Data Structure

With five entries, category filters are not justified. The three flagship case studies receive stronger scale and full editorial narratives. BioWords and Person Is a Data Structure use shorter formats.

### Flagship template

1. Opening image or video
2. One-sentence premise
3. Context and participant experience
4. Amir's contribution
5. Technical system
6. Process and architecture
7. Credits and public context
8. Documentary media
9. Related or next project

Project galleries must be data-driven. Every media record supports type, aspect ratio, alternative text, caption, poster, source, and readiness state.

## Project facts and attribution

### Encounters

- Year: 2023
- Context: Main app-based artistic experience commissioned for Congress 2023 at York University's Keele Campus
- Created by: Amir Bahador Rostami and Elahe Rostami
- Produced through: Artifacts Lab
- Amir's roles: co-creator, Technical Lead, systems architect, client and AR developer
- Stack: Unity, AR Foundation, ARKit, ARCore, Node.js, and AWS
- Experience: Participants invite a nearby person on a choreographed AR walk toward shared virtual bodies of water for conversation, silence, and remembrance.
- Public source: https://www.yorku.ca/yfile/2023/05/30/encounters-brings-augmented-reality-to-congress-2023/

The case study may describe body-aligned avatars, wayfinding, the York Quad, and imagined underwater environments. It must not invent outcomes, attendance, or unconfirmed backend implementation responsibilities.

### Luminous Trails

- Year: 2022
- Context: Nuit Blanche Toronto 2022
- Team credit: Artifacts Studio Ltd., Roozbeh Moayyedian, Elahe Rostami, Amir Bahador Rostami, Can Baris Candan, and Emad Moradian
- Amir's role: Lead Technical Architect
- Amir's implementation: the complete client application and AR interactions
- Stack: Unity, AR Foundation, ARKit, ARCore, Node.js backend, and AWS hosting
- Backend attribution: Amir architected the backend; another team member implemented it
- Experience: Participants created geolocated trails through Toronto. Intersections became shared AR bodies of water and ceremonial landmarks.

The database remains unspecified because Amir does not recall it. The site must not guess.

### Ephemeral Pulses of a Finite Scroll

- Year: 2020
- Program: Remote Realities Themed Commission
- Created by: Amir Rostami and Elahe Rostami
- Co-presented by: Trinity Square Video and Dames Making Games
- Supported by: EQ Bank
- Amir's contribution: co-creation, coding, hardware design, hardware sourcing, system integration, fabrication, and assembly
- System: Raspberry Pi, MPU-6050 accelerometer and gyroscope, Python, SuperCollider, audio interface, amplifier, and surface transducer
- Network: Swing units communicated wirelessly with a master computer
- Synchrony behavior: The master compared live gyroscope and acceleration data, detected rhythmic and harmonic synchronization, and instructed the swings to play an additional note that completed a chord
- Public source: https://remoterealities.jenniefaber.com/project/ephemeral-pulses-of-a-finite-scroll/

Remote Realities is program context, not the artwork's public title.

### BioWords

- Year: 2019
- Authorship: solo project by Amir
- Context: York University final project and exhibition
- Original interaction: Posts using #biwords were collected from Twitter, analyzed for sentiment, divided into words, and transformed into biomorphs
- Original concept: Genome and sentiment affected flocking, community formation, environmental survival, and the sentence returned to Twitter
- Production adaptation: Visitors enter text directly; no X or Twitter service is required
- Renderer: PixiJS with WebGL

The adaptation uses only original words in its result. Surviving words are ordered by survival time, longest-lived first, with remaining energy as the tie-breaker. Grammatical coherence is not required.

### Person Is a Data Structure

- Year: 2018
- Venue: Eleanor Winters Art Gallery, York University
- Context: collaborative university installation
- Original proposal title: Thank You For Your Face
- Final title: Person Is a Data Structure
- Public attribution: individual collaborators remain unnamed
- Amir's role: technical artist and systems developer
- Amir's documented responsibilities: Microsoft Azure Face API, Max/MSP, Processing, facial-data handling, and shared integration of cameras, displays, sensors, networked components, and physical systems

The portfolio must not call this a solo project. It must distinguish proposal language from the final installation and must not imply that Amir alone performed responsibilities assigned to other team members.

## Experiments

The Experiments page contains exactly seven video entries. Cellular Automata remains first. The video originally catalogued internally as `05-experiment-05` is now titled Agent Trails and appears second, beside Cellular Automata in the desktop grid. Amir described the study as an artificial-life simulation where invisible agents follow each other's paths and leave visible trails; its short public description reflects that account. It links to Amir's CodePen source at `https://codepen.io/amirbahadorrostami/pen/aXqebP`. Both named studies use the concise “Open video” action, and Agent Trails uses “View source.” The remaining five films have no public titles or numbered card indices. Stable internal record IDs and order values are retained without presenting them as artwork names. The implementation must not invent titles, descriptions, dates, tools, or algorithms for those five. Each record supports an optional public title, year, description, technique, tools, poster, MP4/WebM sources, process notes, source link and label, and readiness state.

September 29 verification: 131 unit tests, 254 configured browser tests, the unconfigured-contact browser test, and the static build passed. Desktop and mobile visual checks at 320, 390, and 1440 pixels found no horizontal overflow, and the Agent Trails actions have distinct spacing.

Videos never autoplay with sound. Poster images and reduced-motion fallbacks are required.

## Music

The current eight-track catalog includes COMOTION (2025) as the eighth release, linking to Amir's supplied Spotify track. The page presents music under the alias Baha and links to the supplied Spotify artist profile and existing SoundCloud profile. The Apple Music profile remains unconfigured pending an exact URL.

Audio never autoplays. Third-party players load only after explicit activation and retain outbound links as fallbacks.

## Darkroom Cinema visual system

Character:

- Screening room and installation catalogue
- Near-black, precise, and atmospheric
- Editorial rather than application-like
- Playful through language, motion, and scale rather than decorative UI

Palette:

- Near-black
- Graphite
- Warm off-white
- Deep red as the single signal colour, inherited from the original sketch

Avoid purple gradients, glossy three-dimensional blobs, colourful feature-row palettes, generic icon grids, system-only typography, and rounded-everything friendliness.

Typography:

- Outfit Variable, already used by the approved Darkroom Cinema concept, for display and body copy
- IBM Plex Mono, self-hosted through Fontsource, for dates, technical metadata, roles, and captions
- Oversized titles, narrow tracking, deliberate line breaks, and clear reading sizes

Layout:

- Hard rectangular edges
- Full-bleed documentary media
- Asymmetric editorial grids
- Numbered chapters
- Generous negative space
- No generic card shadows or floating rounded panels

Motion:

- Restrained reveals
- Slow image scaling
- No scroll hijacking
- No content delay
- Static or simplified equivalents under reduced motion

Mobile layouts collapse into clear single-column sequences without losing chapter numbering, typographic hierarchy, or cinematic framing.

## Shared PixiJS hero artwork

The homepage and production subpage heroes use the same PixiJS reinterpretation of the old p5.js 10 PRINT sketch. Each page includes one field. The horizontal shading remains, while a vertical fade takes the artwork to solid black at the bottom so the next section has no hard seam. A static SVG remains the fallback.

Behavior:

- A responsive grid fills with forward or backward diagonal marks
- A seeded random probability controls the distribution
- Deep-red marks vary subtly in tone and alpha
- The field draws progressively in one top-left-to-bottom-right pass, then holds its finished composition instead of looping endlessly
- PixiJS builds the full line field once; a small row-major canvas clipping mask handles the reveal without rebuilding line geometry on each frame
- Resize regenerates the composition
- Drawing pauses when the tab or hero is not visible, then resumes from the same point
- Device pixel ratio is capped for mobile performance
- Reduced motion draws the complete field immediately
- WebGL or JavaScript failure retains a pre-generated static composition

The original sketch is a behavioral reference, not a production dependency. Its incomplete nameAnimation function is not carried forward.

## BioWords live adaptation

The adaptation has two isolated layers:

1. A framework-independent TypeScript simulation for tokenization, local sentiment, genomes, flocking, energy, environmental pressure, selection, and sentence reconstruction.
2. A PixiJS renderer responsible only for drawing and animation.

Lifecycle:

1. The visitor enters up to 280 characters.
2. The system separates the sentence into original words and computes sentiment locally.
3. Each word becomes a biomorph whose letters shape its visual genome.
4. Sentence sentiment influences energy and behavior.
5. Separation, alignment, and cohesion create communities.
6. Compatible proximity supports survival; isolation drains energy.
7. Creatures fade as their energy reaches zero.
8. The run ends when one stable community remains or a safe time limit is reached.
9. Only surviving original words become the result.
10. Result order is longest survival time first, with remaining energy as the tie-breaker.

Accessible HTML controls:

- Text input
- Begin
- Pause
- Resume
- Restart
- Skip to Result

Status changes and the result use live announcements. Reduced-motion users receive stepped progression and an immediate-result option. The simulation sends no input to a server and stores nothing.

## Technical architecture

- Astro static output
- TypeScript
- Astro content collections
- PixiJS 10 PRINT field on production heroes; BioWords renderer isolated to its case study
- GitHub Pages deployment
- Replaceable public contact endpoint
- No production backend, database, authentication, or exposed secrets

Collections:

- projects
- experiments
- music
- experience

The experiments schema supports placeholder and ready states. Project and experiment media are structured records rather than hard-coded component imports.

## Failure handling and privacy

- A missing required content field fails the build with a useful error.
- Missing optional media renders a labelled placeholder frame.
- PixiJS failure retains static art and complete written content.
- Video failure retains its poster, title, caption, and outbound link.
- The contact form preserves validation, sending, success, failure, retry, and unconfigured states.
- If the contact endpoint is absent, LinkedIn is the visible fallback.
- Email addresses, phone numbers, credentials, participant locations, and backend data never enter generated output.
- BioWords text remains local to the visitor's browser.

## Media placeholder strategy

Every placeholder states:

- Project
- Intended content
- Media type
- Preferred aspect ratio
- Required alternative text or caption
- Status

Flagship placeholder sequences:

Encounters:

- Pair using the app
- Invitation and pairing interface
- Onboarding screen
- AR wayfinding and avatar
- Virtual water and underwater environment
- Interaction flowchart
- Campus map and process

Luminous Trails:

- Nighttime hero image or video
- AR trails and intersections
- Participant documentation
- App journey
- App Store material
- Client and backend architecture
- Map, prototype, and testing

Ephemeral Pulses of a Finite Scroll:

- Installation hero
- Participant interaction
- Sculpture and floor-layout renders
- Sound Synthesis Unit architecture
- Hardware components
- Fourteen-note directional mapping
- Fabrication and assembly

The final media pass replaces placeholders, creates responsive images, compresses video, writes captions and alt text, and verifies that no sensitive data is visible.

### September 28 owner-media intake

- Preserve every uploaded source in `Media/`; publish only selected, optimized WebP images and H.264 MP4 video in `src/assets/` or `public/media/`. Do not publish the multi-gigabyte ProRes masters. `InteractionVideo-001.mov` and `InteractionVideo-002.mov` are byte-identical; use one source without deleting either.
- Add all seven supplied generative clips to the Experiments screening room with generated poster frames. Cellular Automata becomes the moving homepage preview. The original neutral labels were provisional; Amir subsequently named Agent Trails and removed visible titles from the other five studies. Do not infer metadata from filenames.
- Replace project placeholders only when the supplied material actually depicts the promised subject. Use the Encounters interface, interaction flowchart, campus map, and local footage; Luminous Trails trails/app screens, on-site documentation and prototype footage; Ephemeral Pulses installed interaction, hardware, sound-unit diagram, key mapping and documentary video. Keep any unsupported architecture/App Store/fabrication claim labelled as pending or reshape the slot to match a real asset.
- Add representative original footage to BioWords and Person Is a Data Structure, preserving their working browser experience and short case-study narrative. Use source glyph artwork as reference material, not fifty redundant public images.
- Derive alt text/captions from what the images actually show, preserve video controls and standalone links, and add full-size links for diagrams whose labels cannot be read at page width. Check mobile cropping, loadability, accessibility, and published payload sizes before handoff.

### September 28 media implementation

- All seven experimental films have playable local MP4s and posters. Cellular Automata and Agent Trails are the only publicly named films; five remain untitled. The homepage uses a separate 15-second Cellular Automata excerpt beginning after the source's near-black opening; the full study remains on `/experiments/`.
- Selected Encounters, Luminous Trails, Ephemeral Pulses, BioWords, and Person Is a Data Structure media now appear in their case studies. Diagrams have full-size links, and local films retain controls and direct links. The Encounters flowchart is named as a flowchart, not a backend architecture diagram.
- Supplied masters stay in Git-ignored `Media/final/` and `Media/experiments/`; these local files are not a repository backup. Generated WebP derivatives and 14 H.264 MP4s are the deployable assets. The identical multi-gigabyte installation masters were preserved, not duplicated into the site.
- Luminous Trails App Store and client/backend architecture media were not substantiated by the supplied files. Do not mark those subjects ready based on nearby app screenshots or the prototype footage.
- Verification on September 28: 128 unit tests, Astro check with 0 errors/warnings/hints, 247 configured browser tests, and the unconfigured-contact browser test passed. A mobile browser played the local Encounters and Cellular Automata films without horizontal overflow. The 14 deployable MP4s occupy about 59 MB combined; each is below 25 MB. Desktop image review confirmed the homepage excerpt begins with visible artwork and the Luminous Trails documentary frame no longer stretches beneath its caption. The Encounters mark was subsequently revised on September 29.

### September 29 Encounters and Luminous Trails refinement

- Enlarge and center the supplied Encounters title mark over the underwater case-study hero. Keep the “E” artwork as the compact project card image, but remove its repeated opening slot from the case-study gallery.
- Regenerate the Luminous Trails card and case-study hero from `Media/final/projects/luminous-trails/hero.png`. Present selected Nuit Blanche booth and participant photographs, two AR trail views, and two app screens as three paired portrait rows with dimensions matched to the source images. Retain the early prototype video.
- Remove the unsupported Luminous Trails App Store and client/backend diagram placeholders entirely at Amir's request. The remaining gallery has six ready images and one ready video. Do not invent claims about either removed artifact.
- Preserve BioWords' empty-input feedback across visibility and resize updates; the validation message remains until the next valid control action.
- Final verification (Node 24): 128 unit tests, 0 Astro errors/warnings/hints across 118 files, 21 static pages, 249 configured browser tests, and the unconfigured-contact test passed. The new Encounters mark position and Luminous Trails image ratios were checked at desktop and mobile widths.

### Encounters visual review and project links

- Homepage Selected Work cards omit their numeric labels and redundant “View case study” link; the artwork and title remain direct links. The complete Work archive now uses that same card treatment for all five projects.
- Encounters uses the existing underwater artwork as its case-study hero with the owner-supplied `Media/final/projects/encounters/hero.png` title mark layered over it. The mark was originally shown at native size, then enlarged and centered on September 29. The “E” artwork remains the compact card image. The project-specific hero also becomes the case study's social preview.
- The two portrait demo films are paired at smaller widths on desktop. The owner-supplied `onboarding-1` screen joins the gallery; it and the virtual-water still retain their portrait proportions. The virtual-water still is centered as a standalone image, and the social-gathering video card is removed. The flowchart expands beyond the normal text container on wide screens without horizontal page overflow. Mobile layouts return to one column with capped portrait widths.
- Documentation contains one direct York University link on Encounters and one direct Remote Realities project link on Ephemeral Pulses; duplicate links were removed.

## Accessibility and performance

- WCAG 2.1 AA
- Semantic landmarks and heading hierarchy
- Keyboard access and visible focus
- Minimum 44-pixel touch targets
- No essential information conveyed only by colour or motion
- No autoplaying audio
- Reduced-motion support for all nonessential motion
- No horizontal overflow at 320 CSS pixels
- Lazy loading below the fold
- Third-party embeds excluded from the critical path
- BioWords simulation and renderer absent from routes that do not use them
- Offscreen render loops paused
- Static HTML contains every essential narrative

## Verification

Unit tests:

- Content inventory and schema
- Redirect targets
- BioWords tokenization, genomes, sentiment, energy, selection, deterministic seeds, and survivor ordering
- Contact validation and payload behavior
- URL and metadata helpers

Browser tests:

- Navigation and current-page state
- All production routes and redirects
- Homepage project and music grids
- Project templates and media placeholders
- Experiments inventory
- Music activation without autoplay
- BioWords controls, reduced motion, and fallback
- Contact success, failure, invalid, and unconfigured states
- Keyboard navigation and focus containment
- Accessibility checks
- Representative 320, 390, 768, and 1440-pixel layouts

Build checks:

- Astro diagnostics
- Static route generation
- Sitemap
- Canonical and social metadata
- Internal links
- No private contact details in output
- Shared 10 PRINT entry point on production pages; BioWords entry point only on its case study

### Release verification

Verified on 2026-09-23 on `codex/darkroom-portfolio` after the consolidated final-review fixes based on `c814e9e0`. Node 24 `npm test` passed its complete chain: 22 unit-test files and 115 tests; `astro check` on 116 files with 0 errors, 0 warnings, and 0 hints; 21 static pages built with a sitemap; 233 configured Chromium Playwright tests; and one unconfigured-contact Chromium test. The browser suite covers the inventory, three flagship and two short case studies, redirects, static and graphics fallbacks, music activation, contact states, accessibility, metadata, privacy, and bundle scope.

Representative screenshots covered `/`, `/work/`, `/work/encounters/`, `/work/biowords/`, `/experiments/`, `/music/`, `/about/`, and `/contact/` at 320×568, 390×844, 768×1024, and 1440×900. All 32 captures had no horizontal overflow or clipped first- and second-level headings. At that earlier stage, Experiment 02-07 labels were present at every width; the later owner-approved naming update removed those public labels. Visual samples at each width showed readable hierarchy and mobile sequencing. Keyboard focus and single-column behavior have browser-test coverage.

The explicit `rg` source/output audit returned matches, which were classified: phone-shaped matches were numeric literals and decimals in the 10 PRINT code and minified PixiJS bundle; two `TODO` comments came from bundled PixiJS. Authored `src` has no `TODO`, `TBD`, or matching public email; generated HTML has none either. The production privacy tests also audit built HTML, scripts, and the public résumé PDF. No authored unfinished marker or private email/phone output was found. The exact audit command and classification are recorded in the Task 14 release report.

The final-review wave resolved the stale BioWords status after invalid Begin/Restart and added controlled model-flocking, unique-title, full-HTML privacy, and bounded BioWords request coverage. Ephemeral Pulses now explicitly credits the confirmed implementation responsibilities. The two homepage CTAs and three track links measure 44px high at 320px, retain visible focus, and passed a fresh visual check. Local-video fallback links remain visible outside both players and use safe local sources. The build still emits an optional large PixiJS chunk warning, and Astro emits markdown deprecation notices in unit tests. The separately reported `npm audit --omit=dev` findings affect Astro (critical), sharp (high), and esbuild (low); resolving them requires a dependency review rather than an automatic breaking upgrade. Final owner-supplied media, profile URLs, contact endpoint, experiment metadata, and any custom domain remain open below.

### September 25 refinement — implemented on `codex/darkroom-portfolio`

- Initial implementation used a static, full-bleed version of the homepage 10 PRINT art on production subpages. Amir subsequently requested the same live field as the homepage; the shared field now runs in every production hero and keeps its SVG fallback.
- Remove decorative navigation numbers. Shorten the homepage Experiments invitation and feature the existing Cellular Automata visual as its preview, linked to the study. This is a still preview until Amir provides an actual video file; do not describe it as playable video.
- Recompose the BioWords live experiment as a two-column control panel and viewport. Enlarged orbital biomorphs reference the original BioWords visual; labels appear on hover instead of remaining visible. Completed surviving words overlay the viewport, and Reset clears the drawing and returns to ready state.
- Remove music-card private-player loaders and embedded iframe behavior while keeping platform listening links.
- Keep long results scrollable inside the BioWords viewport on narrow screens. Offer touch reveal for creature labels and a screen-reader list of the active words alongside the hover treatment.

### September 25 shared-hero and About navigation correction

- Reuse `TenPrintField` in `SubpageBackdrop` so Work, Experiments, Music, About, Contact, project details, and the 404 hero draw with the same seeded PixiJS field and horizontal scrim as Home. This deliberately adds the optional renderer to those routes while preserving the static fallback and keeping BioWords-specific code isolated.
- Remove the About page's negative top margin: it pulled the intro over the site header and intercepted pointer navigation. Retain its bottom spacing adjustment.
- Cover the shared hero, renderer isolation, and pointer navigation away from About with browser regression tests.
- Verification on September 25: `npm test` passed 111 unit tests, Astro diagnostics with zero errors or warnings, a 21-page static build, 236 configured browser tests, and the unconfigured-contact browser test. The preview confirmed the About hero starts below the header and shares Home's generated line field.

### September 25 hero fade and drawing pass

- Amir approved a one-time, progressive 10 PRINT drawing pass on the homepage and every production subpage. The field holds its finished frame; it does not loop. Reduced-motion visitors get the complete frame immediately, and the existing static fallback remains available when JavaScript or WebGL is unavailable.
- Apply the same top-to-bottom fade over the existing horizontal scrim on each hero. The bottom edge, including the bottom-left corner, reaches the site's black background with no hard border between Home and the next section.
- Verification on September 25: `npm test` passed 112 unit tests, Astro diagnostics with zero errors or warnings, a 21-page static build, 239 configured browser tests, and the unconfigured-contact browser test. Browser checks cover the progressive frames, completed still frame, offscreen pause, reduced-motion still, and desktop/mobile fade. The Home and About previews were visually checked.

### September 25 animation smoothness pass

- The first progressive implementation appended strokes to one PixiJS `Graphics` object on every frame, causing its growing geometry to be rebuilt repeatedly. On the local About preview this produced two stalls over 300 ms during the five-second pass.
- The field now renders once behind the SVG fallback. A six-point CSS clipping polygon exposes completed rows and the current partial row, so animation frames do not re-render PixiJS geometry. The existing one-time timing, visibility pause/resume, reduced-motion still, resize behavior, and fallback remain unchanged.
- Local About-page measurement at 1440 × 900 after this change: 617 sampled frames over approximately 5.4 seconds, 16 ms at the 95th percentile, 17 ms maximum, and no long tasks during the pass. These are device-specific observations, not a guaranteed performance budget. The finished page was visually checked.
- Verification: the focused seven 10 PRINT browser checks and the full `npm test` suite passed, including the static build, 239 configured browser checks, and the contact fallback check.

### September 25 navigation flash and timing refinement

- On navigation, the completed SVG fallback appeared while the page loaded its renderer, then disappeared when the masked pass began. Hide this SVG only during JavaScript startup; preserve it for no-JavaScript visitors and after a graphics-initialization error.
- Shorten the one-time row-major reveal from five seconds to four seconds, without changing its completed still, offscreen pause/resume, or reduced-motion behavior.
- Browser regression checks cover the hidden startup image while scripts are pending and the approximately four-second completion, alongside the existing fallback and animation checks.
- Verification: the focused regression checks and full `npm test` chain passed (static build, 241 configured browser checks, and contact fallback). An initial parallel full-suite run had one intermittent BioWords invalid-input status failure; that check passed in isolation and in the subsequent complete run. It was not changed as part of this hero-only refinement.

### September 25 unified Music archive

- Amir replaced the earlier Featured tracks / More music split with one All music section on `/music/`. It contains all seven releases in the existing order, numbered continuously in a single responsive grid.
- The final card fills an otherwise incomplete desktop or tablet row, avoiding empty grid cells. Track links, card styling, and the homepage's separate selected-music feature remain unchanged; the `featured` content field still drives the homepage selection.
- Browser checks cover the single grid, all seven titles and links, continuous numbering, responsive columns, and no horizontal overflow.
- Verification: `npm test` passed the unit suite, type check, 21-page static build, 241 configured browser checks, and the unconfigured-contact browser check. Desktop and phone previews were visually reviewed.

### September 27 compact Music archive

- Amir approved replacing the Music page's archive grid with one compact, full-width track list and removing the “All music” heading. This supersedes the earlier grid treatment on this page only.
- Preserve all seven releases, their order, continuous numbering, and outbound listening links. Leave the homepage's selected-music grid unchanged.
- Use thin row dividers, prominent track titles, and platform/listening details aligned right on desktop and stacked below on phones. Keep the existing Darkroom typography and colours; do not add large card boxes or private players.
- Verify list semantics, title hierarchy, responsive full-width rows, no horizontal overflow, and the existing links before handoff.
- Verification: the new browser checks failed against the old grid, then passed with the list. Desktop and phone screenshots were reviewed. A complete `npm test` rerun passed 113 unit tests, Astro diagnostics, the 21-page build, 241 configured browser tests, and the unconfigured-contact test. The first full run hit the previously observed intermittent BioWords invalid-input check; no unrelated BioWords code was changed.

### September 30 Experiments, Music, and About content pass

- Agent Trails now has Amir's approved invisible-agent / accumulating-trail description. Both named experiment video actions say “Open video”; the Agent Trails CodePen action says “View source.”
- Add the supplied Spotify artist profile and the confirmed Baha track COMOTION as release 08. Keep outbound links only and preserve the compact Music list.
- Replace the About hero's résumé action with Amir's supplied public LinkedIn profile. The sanitized public résumé artifact remains for now but is no longer linked from About. The Contact fallback and footer can also use the newly configured LinkedIn URL.
- The LinkedIn PDF export supplied on September 30 is a private reference and must not be copied into `public/` or the repository. It confirms all previously dated timeline periods except two corrections: Sector Growth ends January 2026, and Artifacts Lab ends August 2025. It also dates AliceLab (September 2019–January 2020), Living Architecture Systems Group (January–May 2018), and York University's student-association role (September 2015–April 2016). The degree stays in the separate Education section. The timeline remains a curated thirteen entries; STEM Minds and Dispersion Lab appear in the export but are not added in this pass.
- Verification: the new focused browser checks first failed against the old pages, then all 17 passed after implementation. The full `npm test` run passed 131 unit tests, Astro diagnostics with zero errors or warnings, the 21-page static build, 255 configured browser tests, and the unconfigured-contact fallback test.
- September 30 follow-up: remove the explicit employment/freelance availability line from the homepage hero while retaining the location and “Work with me” link. Remove Cellular Automata's technique and tools facts from the Experiments card; keep its title, description, video, and source link.

## Approved implementation approach

### September 29 case-study credits and image composition

- Luminous Trails credits name each collaborator once, identify Amir's lead technical architect role, and include Artifacts Studio Ltd., Nuit Blanche Toronto 2022, and the City of Toronto as text credits. Do not add logos in this pass.
- Ephemeral Pulses presents the full portrait participant image, gives the sculpture view about 30% more width, reduces the sound-unit diagram, and reduces the hardware montage while preserving its full composition. Media aspect ratios should match the optimized assets.
- Browser regression checks cover desktop and phone framing, relative image sizes, no horizontal overflow, and non-duplicated credits.
- Verification: `npm test` passed 128 unit tests, Astro diagnostics with zero errors or warnings, the 21-page static build, 251 configured browser tests, and the unconfigured-contact browser check. Desktop gallery previews were visually reviewed.

### September 29 BioWords media and letter dictionary

- Keep the existing animated project card, but use `Media/final/projects/biowords/hero.png` for the BioWords case-study hero and opening documentary image.
- The approved nine-tile dictionary shows isolated L, O, V, and E marks from `Single/`, their corresponding `Layerd/` files explicitly labelled as cumulative A–letter alphabet studies, and one new LOVE example assembled from the supplied marks on the original circular body. The layered files are not misrepresented as stages of spelling LOVE.
- Publish a silent version of the original simulation excerpt with its audio stream removed. Preserve the local master and keep the export recipe reproducible.
- Place the dictionary between documentary media and the live experiment; verify the nine images load, captions describe their provenance, and the layout has no phone-width overflow.

Productionize Darkroom Cinema inside the existing Astro architecture.

Do not:

- Apply a superficial dark theme over current components
- Rebuild the site as a separate frontend
- Copy the design-lab component directly into production
- Port the p5.js files line by line
- Add a CMS, server, database, analytics platform, or authentication

## Open owner inputs

These do not block the initial implementation:

- Apple Music profile URL for Baha
- Final private contact endpoint
- Owner review of event-attendee photos and captions
- Optional titles and metadata for the five deliberately untitled experiment videos
- Final track artwork and any track-specific descriptions
- Optional custom domain

## Documentation and branch policy

- The six-concept design-lab branch remains unchanged.
- All redesign work occurs on codex/darkroom-portfolio.
- The living portfolio plan links to this document.
- This design specification is committed and reviewed before an implementation plan is written.
- Production code begins only after the implementation plan is approved.
