# Personal Portfolio Redesign: Design and Build Plan

**Owner:** Amir Rostami  
**Status:** Core portfolio implemented; content completion and launch review in progress
**Last updated:** 2026-09-03

## Purpose

Rebuild Amir's existing GitHub Pages portfolio as a modern, maintainable, multi-page site that presents his hybrid identity as a creative technologist, software engineer, XR developer, artist, and musician.

The portfolio must be playful and memorable while giving employers, clients, curators, commissioners, and residency programs enough evidence to understand Amir's skills and contact him confidently.

This file is the living source of truth for the portfolio's design, content requirements, implementation phases, and launch criteria. Update it when a product decision changes; use the decision log at the end to preserve the reasoning.

## Outcomes

### Primary outcomes

1. Encourage employment, freelance, and client inquiries.
2. Encourage exhibition, commission, and residency inquiries.

### Secondary outcomes

1. Invite creative and technical collaboration.
2. Let visitors explore Amir's work and remember his name.
3. Present music as a meaningful part of the same creative practice.

### Success criteria

- A visitor understands Amir's hybrid creative-technical identity within the first viewport.
- A technical employer can find concrete roles, tools, responsibilities, and engineering experience.
- A curator can find project intent, context, documentation, collaborators, and outcomes.
- A visitor can reach the appropriate contact path without Amir's email address or phone number being public.
- All six launch projects and the selected music catalog are represented.
- The site works well on mobile, tablet, and desktop.
- Adding or revising a project does not require duplicating page markup.

## Audience and positioning

### Primary audience

A hybrid creative-technology audience, with particular attention to:

- Employers and technical hiring teams
- Freelance clients and studios
- Curators and cultural organizations
- Commissioners and residency programs

### Positioning copy

**Headline:**

> Creative tinkerer. Musician. Professional maker of curious things.

**Supporting statement:**

> I create immersive experiences, software, and sound that bring people together in unexpected ways.

This can be refined editorially during implementation, but the voice should remain playful, curious, technically credible, and human rather than corporate.

### Supporting identity

- Creative technologist
- XR developer
- Software engineer
- Musician
- Artist and researcher
- Enthusiastic nerd and builder

## Scope

### Launch scope

- A narrative homepage
- A complete work archive containing six projects
- Three full flagship case studies
- Three shorter project entries
- A dedicated Music page
- An About page with biography and curated experience timeline
- A downloadable full resume
- A private contact form and LinkedIn link
- Responsive navigation and footer
- A custom 404 page
- Search and social-sharing metadata
- GitHub Pages deployment through GitHub Actions

### Pinned post-launch scope

- A working BioWords demo embedded in the BioWords project page
- The demo will be ported from Amir's original Processing/Java source after that source is supplied and reviewed
- The project-page system must support an optional `Live Experiment` block from the beginning

### Not in the initial scope

- User accounts or authentication
- A database-backed CMS
- E-commerce or payments
- A private analytics platform
- Server-rendered personalization
- Rebuilding every historical experiment as an interactive demo

## Information architecture

### Global navigation

- Work
- Music
- About
- Contact

The homepage logo/name returns to the homepage. Navigation remains consistent across all pages.

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Narrative introduction, selected work, selected music, experience preview, and contact invitation |
| `/work/` | Complete six-project archive with lightweight category filtering |
| `/work/encounters/` | Flagship case study |
| `/work/luminous-trails/` | Flagship case study |
| `/work/remote-realities/` | Flagship case study |
| `/work/biowords/` | Short entry with a future live-demo area |
| `/work/person-is-a-data-structure/` | Short project entry |
| `/work/cellular-automata/` | Short project entry |
| `/music/` | Selected releases, sound experiments, and platform links |
| `/about/` | Biography, curated experience timeline, education, and resume download |
| `/contact/` | Private contact form, opportunity types, LinkedIn, and location |
| `/404.html` | Helpful recovery path into Work, Music, and Contact |

### Primary visitor journey

`Home -> flagship case study -> About/Experience -> Contact`

Visitors can branch from any stage into the complete work archive or Music page.

## Homepage design

The homepage is a narrative surface, not a generic portfolio grid.

### Section order

1. **Hero**
   - Playful positioning statement
   - Clear description of Amir's practice
   - Toronto, Canada
   - Availability for work and commissions when accurate
   - Primary action: explore selected work
   - Secondary action: start a conversation
2. **Selected work**
   - Three-card visual grid
   - Encounters
   - Luminous Trails
   - Remote Realities
3. **Selected music**
   - Four-tile listening grid
   - Three selected tracks or sound experiments
   - One tile leading to the complete Music page
4. **Experience preview**
   - A short curated timeline teaser
   - Link to the complete About/Experience page
5. **Contact invitation**
   - One invitation covering employment, freelance, commissions, exhibitions, and residencies

### Homepage behavior

- Project and music grids become one or two columns at smaller breakpoints.
- Motion supports the experience but never blocks navigation or reading.
- No audio autoplays.
- The first viewport contains identity, value, location, availability, and clear actions.

## Project system

### Launch projects

| Project | Launch treatment |
| --- | --- |
| Encounters | Full flagship case study |
| Luminous Trails | Full flagship case study |
| Remote Realities / Ephemeral Pulses of a Finite Scroll | Full flagship case study; final public title must be confirmed during content editing |
| BioWords | Short entry with future embedded demo |
| Person Is a Data Structure | Short entry |
| Cellular Automata | Short entry |

### Flagship case-study structure

1. Title, year, category, and concise premise
2. Large hero media
3. Amir's role
4. Context, venue, client, or commission
5. Collaborators and credits
6. Tools and technologies
7. Artistic question or problem
8. Participant/user experience
9. Process and technical approach
10. Media documentation: images, video, diagrams, or captures
11. Outcomes, recognition, lessons, and reflection
12. Relevant links
13. Next-case-study navigation

The writing must work for both cultural and technical audiences. Concepts should be clear without hiding technical substance.

### Short project structure

1. Title, year, category, and premise
2. Role, format, and tools
3. One polished explanation of the experiment
4. Selected media
5. External link or live-demo block when relevant
6. Return to the work archive

### Project content model

Each project record should support:

- Slug
- Public title and optional alternate title
- Year or date range
- Summary and short card description
- Project depth: `flagship` or `short`
- Categories and tags
- Roles
- Tools and technologies
- Context, venue, client, or commission
- Collaborators and credits
- Hero image and responsive media gallery
- Optional video embeds
- Optional external links
- Optional live-experiment component
- Structured story sections
- Outcomes and recognition
- Accessibility text and captions
- Search and social metadata

## Music experience

Music is a dedicated creative practice within the portfolio, not a sidebar of third-party widgets.

### Homepage

- Three selected tracks or sound experiments in a visual grid
- One card leading to the complete Music page

### Music page

- Custom track/release cards
- Lightweight playback where technically and legally appropriate
- Clear titles, release details, and descriptions
- Spotify and SoundCloud links
- Optional third-party embeds loaded only when requested or when they do not harm performance
- A brief personal statement connecting music to Amir's broader creative practice

## About and experience

### Biography

The biography connects:

- Curiosity and making
- Technology as a way to reimagine human connection and communication
- Software engineering and systems thinking
- XR, public space, and interactive media
- Music and sound

### Curated timeline

The timeline should not reproduce every resume bullet. It should foreground roles that best explain the path between engineering and creative technology.

Candidate entries include:

- Product Madness - Mobile Software Engineer
- Sector Growth - Integration Engineer
- Artifacts Lab - Co-Founder and Lead Engineer
- Hard Rock Digital - Senior Software Engineer
- Circuit Stream - Senior Software Engineering Instructor
- TerraZero - Senior Software Engineer
- Infinite Frame Media - Interactive Systems
- Antimodular Research - R&D Software Engineer
- Studio Above & Below - AR Applications
- BMS Lab, University of Twente - Research Software Engineer
- AliceLab, York University
- Living Architecture Systems Group / Philip Beesley Architect
- Education: Computational Arts with a minor in Game Development, York University

The implementation may group overlapping or short engagements into thematic timeline entries so the page remains readable. The downloadable resume preserves the complete chronology.

## Contact experience

### Public contact options

- LinkedIn
- Short private contact form
- Toronto, Canada

Amir's email address and phone number must not be displayed publicly.

### Opportunity types

- Employment or freelance
- Exhibition or commission
- Residency
- Collaboration or other

### Fields

- Name
- Reply email
- Opportunity type
- Message

### Form states

- Ready
- Validation error
- Sending
- Success
- Delivery failure with a retry option and LinkedIn fallback

### Delivery architecture

GitHub Pages cannot process the form itself. The form component will submit to a replaceable external endpoint. Provider-specific configuration must remain isolated so a later host or serverless function can replace it without changing the page UI or content model.

## Visual direction: Curious Signal

### Character

- Dark and precise
- Playfully technical
- Contemporary and professional
- A mature evolution of the original generative background
- Inventive rather than corporate

### Visual system

- Near-black primary background
- Warm off-white text
- Electric mint/teal for primary interactive signals
- Coral/red for project metadata and energetic accents
- Bold, compact sans-serif display type
- Monospaced labels for dates, categories, system-like details, and navigation accents
- Strong editorial image grids
- Thin lines, signal marks, and restrained generative geometry
- Moderate corner radii rather than a heavily rounded application aesthetic

### Motion

- Subtle generative background or signal field
- Small reveal and hover transitions
- Motion never delays content access
- `prefers-reduced-motion` disables or simplifies nonessential animation
- No autoplaying sound or video

## Technical architecture

### Framework and output

- Astro
- TypeScript where appropriate
- Static output compatible with GitHub Pages
- Component-level client JavaScript only where interaction requires it
- Content collections for projects, music, and experience
- GitHub Actions for build and deployment

### Hosting strategy

- Launch on GitHub Pages from the existing repository
- Keep the application hosting-neutral
- Use relative/base-aware URLs compatible with the user-site domain
- Keep the contact endpoint behind one adapter/configuration boundary
- Preserve the option to move later to a static host with serverless functions
- A hosting move becomes relevant when the site needs first-party form processing, a CMS, durable data, authentication, server rendering, or larger interactive applications

### Proposed source organization

```text
src/
  components/
    layout/
    navigation/
    projects/
    music/
    timeline/
    contact/
    interactive/
  content/
    projects/
    music/
    experience/
  layouts/
  pages/
    work/
    index.astro
    music.astro
    about.astro
    contact.astro
    404.astro
  styles/
public/
  images/
  media/
  documents/
```

The exact file split may change during implementation, but content must remain separate from reusable page structure.

### Data flow

1. Structured content files define projects, music, and timeline entries.
2. Astro validates the records at build time.
3. Listing pages query and sort those collections.
4. Project routes are generated from project slugs.
5. Shared records generate cards, detail pages, related links, metadata, and navigation.
6. The contact form sends only its submitted fields to the configured delivery endpoint at runtime.

## Resilience and error handling

- Missing optional media does not break a project page.
- Required content is validated during the build.
- Failed music/video embeds retain readable titles and outbound links.
- Interactive demos include a loading state and a non-interactive fallback.
- Contact delivery errors preserve the user's message locally in the form until retry or navigation.
- External services load after primary content and cannot block page rendering.
- The custom 404 page links to Work, Music, About, and Contact.

## Accessibility requirements

- Semantic landmarks, headings, navigation, links, buttons, and forms
- Keyboard access for every interactive control
- Visible focus states
- Useful alternative text and media captions
- Sufficient text and control contrast
- Reduced-motion support
- No autoplaying audio
- No essential information communicated by color alone
- Form labels and understandable validation messages
- Responsive media and no horizontal page overflow
- Embedded experiences include titles and fallbacks

Target: WCAG 2.1 AA for the launch experience.

## Performance requirements

- Resize and compress current oversized media before use
- Produce responsive image variants and modern formats
- Lazy-load below-the-fold images, video, audio players, and interactive work
- Load project-specific JavaScript only on routes that need it
- Keep third-party players off the critical rendering path
- Preserve static, cacheable HTML for primary content
- Avoid committing additional unoptimized source media to the repository

## Search and sharing

- Unique title and description for every route
- Canonical URLs
- Open Graph and social-sharing metadata
- A site-wide social preview plus project-specific previews using each project's primary image
- Structured, descriptive URLs
- Sitemap and robots metadata
- Clear heading hierarchy and crawlable project descriptions

## Implementation roadmap

### Phase 1: Foundation

- Preserve the current site while creating the new Astro structure
- Add dependency management and local development commands
- Configure TypeScript, content collections, formatting, and build scripts
- Configure GitHub Actions for a static GitHub Pages build
- Establish base URL and asset-path handling

### Phase 2: Design system and shell

- Create Curious Signal color, typography, spacing, border, and motion tokens
- Build responsive page shell, navigation, footer, skip link, and mobile menu
- Implement reduced-motion behavior
- Build reusable section, grid, card, button, metadata, and media components

### Phase 3: Content system

- Define schemas for projects, music, and experience
- Migrate the six current project records
- Import and optimize existing media
- Add the resume as a downloadable document
- Add content validation and useful build errors

### Phase 4: Primary pages

- Build the homepage and its project/music grids
- Build the Work archive and category filters
- Build flagship and short project templates
- Build Music, About/Timeline, Contact, and 404 pages

### Phase 5: Content completion

- Edit the three flagship case studies with Amir
- Confirm Remote Realities' title and content
- Select homepage and Music-page tracks
- Curate the experience timeline
- Finalize biography and calls to action
- Add credits, roles, outcomes, captions, and links

### Phase 6: Contact delivery

- Select a static-site-compatible form endpoint
- Configure private delivery without exposing Amir's email
- Add validation, spam protection, success, failure, and retry behavior
- Document how to replace the form provider later

### Phase 7: Quality and launch

- Verify all routes, links, media, embeds, metadata, and downloads
- Test mobile, tablet, and desktop layouts
- Test keyboard and reduced-motion behavior
- Run accessibility, SEO, and performance checks
- Verify contact success and failure flows
- Deploy through GitHub Actions to GitHub Pages
- Verify the production deployment and configure a custom domain when desired

### Phase 8: BioWords live experiment

- Receive and archive the original Processing/Java source
- Document the original behavior and controls
- Decide whether the closest browser implementation is p5.js, Canvas, or another client-side runtime
- Port behavior incrementally with visual comparisons to the original
- Add performance limits, mobile controls, reduced-motion behavior, and a static fallback
- Embed the completed demo in the BioWords project page

## Verification plan

### Automated checks

- Production build
- Content-schema validation
- Type checking
- Internal-link checking
- Tests for content utilities and contact-form state logic
- Component or browser tests for navigation, filters, forms, and interactive controls

### Browser checks

- Homepage
- Work archive
- All three flagship case studies
- At least one short project
- Music
- About/Timeline
- Contact success and failure states
- Custom 404

Test representative mobile, tablet, and desktop sizes. Confirm no horizontal overflow, clipped media, unreachable controls, or layout shifts that interfere with reading.

### Launch acceptance checklist

- [ ] All six projects are published
- [ ] The three flagship case studies contain complete role, context, process, outcome, and credit information
- [ ] Selected music is confirmed and playable or linked
- [ ] The curated timeline is accurate
- [x] The full resume downloads correctly
- [ ] LinkedIn URL is correct
- [x] Amir's email and phone number are not public
- [ ] Contact messages deliver successfully
- [x] Mobile navigation and grids work correctly
- [x] Keyboard navigation and focus states work correctly
- [x] Reduced-motion behavior works correctly
- [ ] Every route has valid metadata and a social preview
- [x] Images are optimized and responsive
- [ ] Production deployment passes smoke testing

## Content required from Amir

These are explicit inputs, not implementation placeholders:

- [ ] Exact LinkedIn profile URL
- [ ] Approval of the resume file that will be publicly downloadable
- [ ] Preferred private destination for contact-form messages
- [ ] Final selection and ordering of homepage music
- [ ] Final selection and ordering of Music-page releases/experiments
- [ ] Encounters: role, tools, collaborators, credits, process, outcomes, and preferred media
- [ ] Luminous Trails: role, tools, collaborators, credits, process, outcomes, and preferred media
- [ ] Remote Realities: final title, complete description, role, tools, collaborators, credits, outcomes, and preferred media
- [ ] Confirmation of dates and public wording for the curated timeline
- [ ] Any awards, press, exhibition links, or documentation to include
- [ ] Original BioWords Processing/Java source for the post-launch demo
- [ ] Custom domain, if one will be configured for launch

Content gaps should not block building the system. Use clearly labeled draft copy during development and replace it before launch acceptance.

## Launch blockers and owner inputs

The core static portfolio is implemented, but launch acceptance remains blocked on Amir’s confirmation or supply of the unchecked inputs above. In particular, provide the exact LinkedIn URL, choose and configure a real private contact-form endpoint, confirm the public Remote Realities title and final project content, approve the selected music ordering, confirm timeline wording, and decide whether to configure a custom domain. Production deployment also requires the repository’s Pages source to be set to GitHub Actions, a workflow run from `main`, and the production smoke test described in the implementation plan. No final contact provider, LinkedIn URL, custom domain, Remote Realities public title, or music selection has been recorded as a decision yet.

## Decision log

| Date | Decision | Reason |
| --- | --- | --- |
| 2026-08-30 | Target a hybrid creative-technology audience | Amir's strength is the combination of art, engineering, XR, and music |
| 2026-08-30 | Prioritize work inquiries and cultural opportunities | Employment/freelance and exhibitions/commissions/residencies are the main outcomes |
| 2026-08-30 | Use playful positioning | The portfolio should sound like a curious maker, musician, and nerd rather than a corporate profile |
| 2026-08-30 | Choose Curious Signal | It evolves the existing dark generative character while improving professional clarity |
| 2026-08-30 | Use a curated multi-page portfolio | It balances narrative, case-study depth, search visibility, and growth |
| 2026-08-30 | Use three flagship case studies | Deep evidence is concentrated where it is strongest |
| 2026-08-30 | Select Encounters, Luminous Trails, and Remote Realities as flagships | Amir selected these as the strongest launch projects |
| 2026-08-30 | Give Music a dedicated page and homepage grid | Music is a first-class practice without overtaking the primary portfolio |
| 2026-08-30 | Use a curated experience timeline plus resume download | The site tells a coherent story while preserving complete professional detail |
| 2026-08-30 | Keep email and phone private | Public contact uses LinkedIn and a short form |
| 2026-08-31 | Launch on GitHub Pages with a hosting-neutral Astro build | GitHub Pages satisfies the static launch; migration can wait for a real server-side need |
| 2026-08-31 | Pin an embedded BioWords demo for a later phase | The Processing port is valuable but should not block the core portfolio launch |

## Documentation maintenance

- Update the status and last-updated date whenever a phase is completed or a decision changes.
- Record material product decisions in the decision log.
- Check off content inputs and launch criteria as they are confirmed.
- Link future detailed implementation plans from this file rather than duplicating them.
- Keep setup and day-to-day development commands in the project README once the Astro foundation exists.
