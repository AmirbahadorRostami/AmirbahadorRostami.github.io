# Amir Rostami portfolio

The Darkroom Cinema portfolio for Amir Rostami: creative technologist, software engineer, XR developer, artist, and musician. Astro builds static pages for GitHub Pages; PixiJS progressively enhances the 10 PRINT hero artwork across production pages and the BioWords experiment.

## Requirements and local development

Use Node.js 24 locally. The `.nvmrc`, `package.json` engine, and deployment workflow all pin that major version so local development, clean installs, and GitHub Pages builds use the same runtime.

```bash
npm install
npx playwright install chromium
npm run dev
```

Open `http://localhost:4321/`. Run `npm test` before publishing; it runs unit tests, Astro diagnostics and a static build, configured browser tests, then the unconfigured-contact browser test.

Useful commands:

```bash
npm run media:prepare  # regenerate optimized images from approved source media
npm run media:prepare:videos  # regenerate web video and posters from local masters (requires FFmpeg)
npm run build          # type check and create dist/
npm test               # complete release gate
```

Use `npm ci` for a clean, lockfile-based install in CI or when reproducing a build.

## Production pages and content

The static routes are `/`, `/work/`, five project case studies, `/experiments/`, `/music/`, `/about/`, `/contact/`, and `/404.html`. Work has five entries: Encounters, Luminous Trails, Ephemeral Pulses of a Finite Scroll, BioWords, and Person Is a Data Structure. Experiments has seven entries: Cellular Automata, Agent Trails, and five intentionally untitled video studies. Music presents eight tracks under Amir's alias Baha in one compact archive list; About has thirteen timeline entries. The old `/work/remote-realities/` and `/work/cellular-automata/` URLs are compatibility redirects.

- Projects: `src/content/projects/<slug>/index.md`; project media records are in each file's frontmatter.
- Experiments: `src/content/experiments/*.json`; all seven supplied videos are connected. Agent Trails is second with an external CodePen source link, and five videos have no public title or card number.
- Music: `src/content/music/*.json`; timeline: `src/content/experience/*.json`.
- Collection schemas: `src/content.config.ts`; public profile URLs and the site origin: `src/config/site.ts`.

The homepage and production subpage heroes share the same PixiJS 10 PRINT field and horizontal/vertical shading. PixiJS draws each composition once; a lightweight canvas clipping mask reveals its lines over four seconds and then holds. The full-pattern SVG is hidden during JavaScript startup to avoid a flash, but remains available without JavaScript or when graphics initialization fails. Reduced-motion visitors see the completed field immediately. The artwork fades to the site's black background at the bottom of each hero. BioWords keeps its project story, controls, and result in HTML, while its simulation and PixiJS renderer stay separate and load only on its project page; input remains in the browser.

The homepage Experiments invitation previews a short Cellular Automata excerpt that starts after its near-black opening, with a still for reduced-motion visitors. The full film remains in Experiments. BioWords places its controls beside the viewport and displays survivors over the drawing at completion. Music tracks link directly to listening platforms without embedded-player loaders.

The five cards on `/work/` share the homepage's unnumbered, no-extra-CTA treatment; artwork and title still open each case study. Encounters includes the owner-supplied `onboarding-1` screen. Its portrait stills use frames matched to their source dimensions; the duplicate opening artwork and social-gathering video card have been removed at Amir's request. The Encounters title mark is centered over its underwater case-study hero.

## Design lab

The earlier comparison lab remains available as a reference. Darkroom Cinema is the chosen production direction. Start the local server with `npm run dev`, then open `http://localhost:4321/design-lab/`. The six concept URLs are:

- `http://localhost:4321/design-lab/poster-index/`
- `http://localhost:4321/design-lab/type-image-collision/`
- `http://localhost:4321/design-lab/darkroom-cinema/`
- `http://localhost:4321/design-lab/printed-signal-lab/`
- `http://localhost:4321/design-lab/coral-broadcast/`
- `http://localhost:4321/design-lab/clau-poster-wall/`

The same paths are statically generated on GitHub Pages under `https://amirbahadorrostami.github.io`. They are intentionally absent from production navigation and marked `noindex, nofollow`, but those measures are not access control: anyone with an exact deployed URL can view a concept.

The lab remains separate from production navigation and templates.

## Editing content and media

- Projects live in `src/content/projects/<slug>/index.md`.
- Music records live in `src/content/music/*.json`.
- Timeline/experience records live in `src/content/experience/*.json`.
- Their schemas live in `src/content.config.ts`; a build validates every record.

Project fields such as `alternateTitle`, `year`, and `context` are optional. Empty optional lists are hidden by the project layout, so leave them empty rather than writing placeholder headings. `detailHero` and `detailHeroAlt` can override a case study's header image without changing its card image; `detailHeroMark` can layer a small decorative title mark over that header.

Each `media` item has an `id`, `type` (`image`, `video`, or `diagram`), `intention`, `aspectRatio` (for example `16 / 9`), `alt`, `caption`, and `state` (`ready` or `placeholder`). A ready image or diagram needs `image`; video playback requires typed MP4/WebM `sources` or an HTTPS `externalUrl`. A `poster` is optional and does not make a video playable by itself. For missing media, keep `state: placeholder` and provide a useful intention, alt text, and caption. The frame then shows the project, expected content, media type, preferred ratio, and status without changing the page template.

Selected owner-supplied images are mapped in `scripts/prepare-media.mjs`; video clips and matching poster frames are mapped in `scripts/prepare-videos.mjs`. Their source folders, `Media/final/` and `Media/experiments/`, are local-only and Git-ignored because they contain multi-gigabyte masters (including a duplicate installation file). Back up those originals separately. Only optimized `src/assets/` images/posters and `public/media/` MP4 files are versioned and needed to build or deploy the site. Regenerating requires the local masters plus FFmpeg and Sharp. Video exports strip source metadata and stay under 25 MB each; the video script uses excerpts for longer project recordings. Do not treat an excerpt as the full documentation.

Most planned project media is now connected. Luminous Trails uses six selected stills from `Media/final/projects/luminous-trails/` plus the existing prototype clip. Its former App Store and client/backend diagram placeholders were removed at Amir's request; no diagram or App Store claim is inferred from the supplied images. Diagram captions elsewhere link to a full-size asset. Review alt text, captions, and identifiable event attendees before publication. LinkedIn and Spotify URLs are configured in `src/config/site.ts`; the five untitled experiments can receive names and metadata later if Amir supplies them. The current SoundCloud profile value still needs owner confirmation.

The September 29 case-study pass removes duplicate personal names from the Luminous Trails credits, adds Nuit Blanche Toronto and City of Toronto as text credits (no logos), and refines four Ephemeral Pulses media frames and widths so the portrait photo and hardware montage are fully visible.

The BioWords case study uses its supplied final hero artwork while retaining the original work-card image. Its nine-image letter dictionary contains four isolated LOVE marks, four clearly labelled cumulative alphabet studies, and a LOVE example composited from the source marks. The published simulation excerpt has no audio stream; the original recording stays in `Media/final/`, and `scripts/prepare-videos.mjs` preserves the silent export on regeneration.

## Contact endpoint

The site is static, so form delivery goes to a replaceable external endpoint. Create a local `.env` (which is ignored by Git) from `.env.example` and configure only the public endpoint value:

```dotenv
PUBLIC_CONTACT_FORM_ENDPOINT=https://your-form-provider.example/submit
```

Never commit `.env`, a recipient email address, or provider credentials. When the variable is empty, the form explains that direct delivery is being connected and disables its controls. LinkedIn appears as the fallback when its URL is configured; otherwise the page asks visitors to check back. The endpoint receives a JSON POST with `name`, `email`, `intent`, `message`, and the honeypot `company`. It must return a successful HTTP status for the success message. A provider can be replaced later by changing this value without changing page templates.

For GitHub Pages, add an Actions repository variable named `PUBLIC_CONTACT_FORM_ENDPOINT` under **Settings → Secrets and variables → Actions → Variables**. The deployment workflow passes that public value to Astro at build time. Do not put a recipient address or provider credential in this variable; browser form endpoints are public by design. Leaving the variable unset keeps the deployed form safely unavailable.

## Deployment

`.github/workflows/deploy.yml` runs on pushes to `main` and by manual dispatch. It checks out the repository with `actions/checkout@v7`, builds and uploads Astro’s static artifact on Node 24 through `withastro/action@v6`, then deploys the artifact with `actions/deploy-pages@v5`. The deploy job uses the GitHub Pages environment and publishes its URL in the workflow result.

This is the username site `amirbahadorrostami.github.io`, so Astro has no `base` path configured. In GitHub repository settings, set Pages **Source** to **GitHub Actions** before the first deployment. That setting and any deployment are intentionally outside this repository change. If hosting moves later, retain the static build, update the deployment integration and canonical `site`/origin configuration as needed, and replace the contact endpoint without coupling pages to a provider.

## Project documents

Media-pass verification (2026-09-29, Node 24): 128 unit tests, 0 Astro errors/warnings/hints across 118 files, 21 static pages, 251 configured browser tests, and one unconfigured-contact test passed. All 14 published MP4s are below 25 MB each; desktop and mobile browser checks confirm the updated portrait image layout without horizontal overflow. The Encounters, Luminous Trails, and Ephemeral Pulses adjustments are documented in the [Darkroom Cinema specification](docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md).

Experiments update verification (2026-09-29, Node 24): 131 unit tests, 254 configured browser tests, the unconfigured-contact browser test, and the static build passed. The reordered archive was visually checked at 320, 390, and 1440 pixels with no horizontal overflow.

- [Living design specification](docs/superpowers/specs/2026-08-31-personal-portfolio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-08-31-core-portfolio-implementation.md)
- [Design lab specification](docs/superpowers/specs/2026-09-14-six-concept-design-lab.md)
- [Design lab implementation plan](docs/superpowers/plans/2026-09-14-six-concept-design-lab.md)
- [Darkroom production specification](docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md)
