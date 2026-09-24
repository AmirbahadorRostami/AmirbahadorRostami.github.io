# Personal Portfolio Design and Build Plan

**Owner:** Amir Bahador Rostami

**Status:** Darkroom Cinema implemented and release-verified; owner media and launch inputs remain

**Last updated:** 2026-09-23

## Purpose

This is the living source of truth for Amir's portfolio. It records the current goals, approved direction, content inventory, implementation phases, owner inputs, and decision history.

The detailed production specification is:

- [Darkroom Portfolio Redesign](./2026-09-21-darkroom-portfolio-redesign-design.md)

When this summary and the detailed specification differ, the newer Darkroom Portfolio Redesign specification controls.

## Outcomes

Primary outcomes:

1. Encourage employment, freelance, and client inquiries.
2. Encourage exhibition, commission, and residency consideration.

Secondary outcomes:

1. Invite creative and technical collaboration.
2. Present music released as Baha as part of the same practice.
3. Give visitors a memorable, credible account of Amir's work across software, public space, sound, and interactive art.

## Audience and positioning

The site serves a hybrid creative-technology audience:

- Employers and technical hiring teams
- Freelance clients and studios
- Curators and cultural organizations
- Commissioners and residency programs

Approved homepage copy:

> Part engineer. Part musician. Entirely too curious.

> I design and build interactive systems, immersive artworks, and digital experiences that explore how technology can change the way people connect.

Approved actions:

- See what I've been building
- Work with me

## Approved direction

The production site uses the Darkroom Cinema direction selected from the six-concept design lab.

Core characteristics:

- Near-black, graphite, warm off-white, and one deep-red signal colour
- Outfit Variable typography with IBM Plex Mono metadata, both self-hosted
- Full-bleed media, asymmetric editorial grids, numbered chapters, and hard rectangular edges
- No purple gradients, glossy three-dimensional blobs, colourful feature-row palettes, generic icon grids, system-only typography, or rounded-everything friendliness
- Restrained motion with complete reduced-motion and no-JavaScript fallbacks

The old 10 PRINT sketch is a PixiJS homepage field. BioWords is a second PixiJS experience using a separate testable simulation core. Both preserve static HTML and usable fallbacks if JavaScript or WebGL fails.

## Information architecture

Primary navigation:

- Work
- Experiments
- Music
- About
- Contact

Homepage:

1. Generative hero
2. Three flagship projects in a cinematic grid
3. Three selected Baha tracks in a listening grid
4. Curated experience preview
5. Experiments invitation
6. Contact invitation

Implemented production sections:

- Work: five projects, with three full flagship case studies and two short studies
- Experiments: seven video-study entries, with Cellular Automata documented and six neutral placeholders awaiting media
- Music: seven Baha tracks
- About: biography, thirteen-entry timeline, education, skills, and résumé
- Contact: short private form when `PUBLIC_CONTACT_FORM_ENDPOINT` is configured; LinkedIn fallback when its URL is supplied

The static output also includes `/404.html`. `/work/remote-realities/` redirects to `/work/ephemeral-pulses-of-a-finite-scroll/`; `/work/cellular-automata/` redirects to the Cellular Automata anchor on `/experiments/`. The six-concept design lab remains unlinked and `noindex, nofollow`.

## Work inventory

Flagship case studies:

1. Encounters
2. Luminous Trails
3. Ephemeral Pulses of a Finite Scroll

Short case studies:

4. BioWords
5. Person Is a Data Structure

Cellular Automata moves from Work to the seven-entry Experiments page.

Confirmed project facts:

- Encounters: 2023; Congress 2023; created by Amir and Elahe Rostami through Artifacts Lab; Amir was co-creator, Technical Lead, systems architect, and client/AR developer; Unity, AR Foundation, ARKit, ARCore, Node.js, and AWS.
- Luminous Trails: 2022; Nuit Blanche Toronto; Amir was Lead Technical Architect, built the complete client and AR interactions, and architected the Node.js/AWS backend implemented by another team member.
- Ephemeral Pulses of a Finite Scroll: 2020; Remote Realities commission; created by Amir and Elahe Rostami; co-presented by Trinity Square Video and Dames Making Games; supported by EQ Bank; Raspberry Pi, MPU-6050, Python, SuperCollider, wireless master coordination, and physical fabrication.
- BioWords: 2019; solo York University final project; original Twitter hashtag artwork; direct-input PixiJS adaptation implemented. The result uses only original surviving words, ordered by survival time and then remaining energy.
- Person Is a Data Structure: 2018; Eleanor Winters Art Gallery; collaborative university installation; collaborator names omitted; Amir's documented technical role is credited accurately.

## Experiments

The Experiments page contains seven video-study entries:

1. Cellular Automata
2. Experiment 02
3. Experiment 03
4. Experiment 04
5. Experiment 05
6. Experiment 06
7. Experiment 07

The six unknown entries remain neutral placeholders until the final media pass. No titles, dates, descriptions, tools, or algorithms are invented. `state: "placeholder"` is a deliberate content readiness value; Cellular Automata is `ready` with its current poster and source link.

## Music

Music is released under the alias Baha.

Approved statement:

> Baha is the musical project of Amir Bahador Rostami—a place where electronic and acoustic instruments drift into the same orbit, forming spacey textures, vibrant colours, and sweet harmonies across big landscapes.

Platform order:

1. SoundCloud
2. Spotify
3. Apple Music

The existing seven-track catalog remains. Audio never autoplays; third-party players load only after activation. The current SoundCloud profile value needs owner confirmation, while LinkedIn, Spotify, and Apple Music profile values are still empty.

## About and experience

Approved biography:

> I build systems with a pulse: software that remembers where people have walked, sculptures that listen to movement, and small virtual organisms born from language.

> My name is Amir. I'm an engineer, artist, musician, and persistent tinkerer working in Toronto. Code is one of my materials, alongside sound, light, sensors, space, and occasionally a pile of hardware that looked much smaller in the diagram. I'm most interested in technology when it becomes a place to meet—something people can enter, disturb, and transform together.

Approved timeline introduction:

> A trail through systems, studios, labs, and classrooms.

> Thirteen stops, each one teaching me a different way to turn ambitious ideas into things people can actually use, inhabit, or hear.

The timeline is curated. The downloadable résumé preserves complete professional detail.

## Contact

Approved copy:

> Have a role, a commission, or a strange problem worth solving?

> I'm open to employment, freelance collaborations, exhibitions, commissions, and residencies. Tell me what you're working on, what you need, and where you think I might fit.

Public options:

- Short private contact form
- LinkedIn
- Toronto, Canada

Amir's email address and phone number must not be present in generated HTML, JavaScript, configuration, metadata, or documents.

## Technical architecture

- Astro
- TypeScript
- Static output compatible with GitHub Pages
- Astro content collections
- PixiJS only on the homepage and BioWords page, with complete static fallbacks
- Replaceable contact endpoint
- GitHub Actions deployment

No production backend, CMS, database, authentication, analytics platform, or server-rendered personalization is required.

## Media strategy

All absent media uses intentional, accessible placeholders. Each placeholder identifies the project, expected content, media type, preferred aspect ratio, and caption or alternative-text requirement.

The final owner media pass will:

- Import original photographs, renders, diagrams, video, posters, and interface captures
- Produce responsive images
- Compress MP4/WebM video
- Create poster frames
- Write captions and alternative text
- Check for private data
- Replace the remaining intentional placeholders by updating collection media records, not page templates

## Implementation phases

### Phase 1: Documentation and plan

- [x] Complete copy workshop
- [x] Approve information architecture
- [x] Approve visual system
- [x] Approve page design
- [x] Approve PixiJS interaction design
- [x] Approve technical architecture and verification
- [x] Create separate codex/darkroom-portfolio branch
- [x] Update living documentation
- [x] User reviews written redesign specification
- [x] Write detailed implementation plan

### Phase 2: Production design system — complete

- Implement Darkroom Cinema tokens, typography, shell, navigation, footer, focus, and motion
- Preserve semantic HTML and static primary content
- Implement the PixiJS hero with fallbacks

### Phase 3: Content and routes — complete

- Update project records and attribution
- Rename the Remote Realities route and add compatibility redirect
- Add the Experiments collection and page
- Move Cellular Automata and add its compatibility redirect
- Update Music, About, Contact, metadata, and navigation

### Phase 4: Case studies and media placeholders — complete

- Build flagship editorial templates
- Build compact case-study template
- Add structured placeholder galleries and diagrams
- Preserve existing usable documentation

### Phase 5: BioWords — complete

- Build the deterministic TypeScript simulation
- Build the PixiJS renderer and accessible controls
- Implement reduced-motion, skip-to-result, static fallback, and local-only processing

### Phase 6: Verification — complete for the current content

- Unit tests
- Astro diagnostics and build
- Browser and accessibility tests
- Responsive review
- Performance and bundle review
- Privacy and metadata checks

On 2026-09-23, `npm test` passed: 111 unit tests, Astro diagnostics with 0 errors/0 warnings/0 hints, 21 static pages, 230 configured Playwright tests, and the unconfigured-contact test. Representative screenshots of eight routes at 320×568, 390×844, 768×1024, and 1440×900 showed no horizontal overflow or clipped headings; keyboard focus and responsive layout also have automated coverage. The broad source/output text scan matched numeric literals and two comments inside bundled PixiJS. Authored source and generated HTML had no unfinished markers or private contact details. See the [detailed release record](./2026-09-21-darkroom-portfolio-redesign-design.md#release-verification) for scope and caveats.

### Phase 7: Final media and launch

- Replace placeholders
- Confirm external profile links
- Configure contact delivery
- Run production smoke tests
- Merge only after review

## Open owner inputs

- [ ] Exact LinkedIn URL
- [ ] Confirm the current SoundCloud profile URL for Baha
- [ ] Spotify profile URL for Baha
- [ ] Apple Music profile URL for Baha
- [ ] Final private contact endpoint
- [ ] Final imagery, video, diagrams, and captions
- [ ] Titles and metadata for Experiments 02 through 07
- [ ] Final track artwork and optional track descriptions
- [ ] Optional custom domain

These inputs do not block the verified static implementation because the design includes honest placeholders and fallbacks. They remain launch inputs; do not mark them complete without Amir's confirmation.

## Verification requirements

- WCAG 2.1 AA
- Keyboard access and visible focus
- Reduced-motion support
- No autoplaying audio
- No horizontal overflow at 320 CSS pixels
- Complete static content without JavaScript
- PixiJS failure fallback
- Media failure fallback
- Contact success, failure, validation, retry, and unconfigured states
- Unique metadata and canonical URLs
- No private contact details in generated output
- PixiJS absent from routes that do not use it

The detailed test matrix lives in the Darkroom Portfolio Redesign specification.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-08-30 | Target a hybrid creative-technology audience | Amir's strength is the combination of art, engineering, XR, and music |
| 2026-08-30 | Prioritize work inquiries and cultural opportunities | Employment/freelance and exhibitions/commissions/residencies are the main outcomes |
| 2026-08-30 | Use a playful, curious voice | The portfolio should sound like a musician, nerd, and builder rather than a corporate profile |
| 2026-08-30 | Use a curated multi-page portfolio | It balances narrative, case-study depth, search visibility, and growth |
| 2026-08-30 | Use three flagship case studies | Deep evidence is concentrated where it is strongest |
| 2026-08-30 | Give Music a dedicated page and homepage grid | Music is a first-class practice without overtaking the primary portfolio |
| 2026-08-30 | Use a curated experience timeline plus résumé | The site tells a coherent story while preserving complete professional detail |
| 2026-08-30 | Keep email and phone private | Public contact uses LinkedIn and a short form |
| 2026-08-31 | Launch on GitHub Pages with hosting-neutral Astro output | GitHub Pages satisfies the static launch |
| 2026-09-21 | Productionize Darkroom Cinema | Amir selected it from the six-concept design lab |
| 2026-09-21 | Use PixiJS for the hero and BioWords | It provides a shared high-performance visual language while preserving static fallbacks |
| 2026-09-21 | Rename Remote Realities to Ephemeral Pulses of a Finite Scroll | Remote Realities is the commission program, not the artwork title |
| 2026-09-21 | Add a seven-video Experiments page | Generative video work needs a dedicated archive |
| 2026-09-21 | Move Cellular Automata to Experiments | It belongs with Amir's other generative video studies |
| 2026-09-21 | Credit Person Is a Data Structure as collaborative | The source proposal documents divided group responsibilities |
| 2026-09-21 | Release music under Baha | This is Amir's approved artist alias |
| 2026-09-23 | Release-verify the Darkroom static implementation | The full test gate, output audit, and four-width visual review passed for current content; owner media and profile inputs remain |

## Documentation maintenance

- Update status and date when a phase or material decision changes.
- Record significant decisions in the decision log.
- Keep detailed interaction and test requirements in the linked redesign specification.
- Keep development commands in the README.
- Never mark an owner input complete without Amir's confirmation.
