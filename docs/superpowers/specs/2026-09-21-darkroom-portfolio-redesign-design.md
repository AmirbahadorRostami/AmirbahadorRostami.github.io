# Darkroom Portfolio Redesign

**Owner:** Amir Bahador Rostami

**Status:** Approved for implementation planning

**Date:** 2026-09-21

**Branch:** codex/darkroom-portfolio

**Base:** codex/six-concept-design-lab at 777a152

## Purpose

Productionize the approved Darkroom Cinema concept as Amir's complete portfolio. The redesign must present Amir as an engineer, artist, musician, and creative technologist to employers, clients, curators, commissioners, and residency programs.

The finished site remains a static Astro application on GitHub Pages. It adds two progressive PixiJS experiences, a dedicated Experiments archive, complete flagship copy, and structured media placeholders without introducing a production server or exposing Amir's email address.

## Success criteria

- The first viewport communicates Amir's creative and technical identity, Toronto location, and availability.
- Employers can identify concrete architecture and implementation responsibilities.
- Cultural audiences can understand each artwork's premise, experience, context, authorship, and technical system.
- The production site carries the Darkroom Cinema visual language across every route.
- The homepage hero and BioWords run as accessible, resilient PixiJS experiences.
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
| /music/ | Seven Baha releases plus platform links |
| /about/ | Biography, portrait, experience timeline, education, skills, and résumé |
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

The Experiments page contains exactly seven video entries, including Cellular Automata.

Initial records:

1. Cellular Automata
2. Experiment 02
3. Experiment 03
4. Experiment 04
5. Experiment 05
6. Experiment 06
7. Experiment 07

Unknown entries use neutral placeholder labels. The implementation must not invent titles, descriptions, dates, tools, or algorithms. Each record supports title, year, description, technique, tools, poster, MP4/WebM sources, process notes, source link, and readiness state.

Videos never autoplay with sound. Poster images and reduced-motion fallbacks are required.

## Music

The current seven-track catalog remains. The page presents music under the alias Baha and links to SoundCloud, Spotify, and Apple Music. Exact profile URLs and final artwork arrive during the media pass.

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

## Homepage PixiJS hero

The hero is a PixiJS reinterpretation of the old p5.js 10 PRINT sketch.

Behavior:

- A responsive grid fills with forward or backward diagonal marks
- A seeded random probability controls the distribution
- Deep-red marks vary subtly in tone and alpha
- The field draws once instead of looping endlessly
- Resize regenerates the composition
- Rendering pauses when the tab or hero is not visible
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
- PixiJS scoped to the homepage and BioWords
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
- AR wayfinding and avatar
- Virtual water and underwater environment
- Social gathering
- System architecture
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
- PixiJS absent from routes that do not use it
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
- No PixiJS bundle on unrelated routes

## Approved implementation approach

Productionize Darkroom Cinema inside the existing Astro architecture.

Do not:

- Apply a superficial dark theme over current components
- Rebuild the site as a separate frontend
- Copy the design-lab component directly into production
- Port the p5.js files line by line
- Add a CMS, server, database, analytics platform, or authentication

## Open owner inputs

These do not block the initial implementation:

- Exact LinkedIn URL
- SoundCloud, Spotify, and Apple Music profile URLs for Baha
- Final private contact endpoint
- Final project imagery, video, posters, diagrams, and captions
- Titles and metadata for Experiments 02 through 07
- Final track artwork and any track-specific descriptions
- Optional custom domain

## Documentation and branch policy

- The six-concept design-lab branch remains unchanged.
- All redesign work occurs on codex/darkroom-portfolio.
- The living portfolio plan links to this document.
- This design specification is committed and reviewed before an implementation plan is written.
- Production code begins only after the implementation plan is approved.
