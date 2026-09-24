# Amir Rostami portfolio

The Darkroom Cinema portfolio for Amir Rostami: creative technologist, software engineer, XR developer, artist, and musician. Astro builds static pages for GitHub Pages; PixiJS progressively enhances the homepage artwork and BioWords.

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
npm run build          # type check and create dist/
npm test               # complete release gate
```

Use `npm ci` for a clean, lockfile-based install in CI or when reproducing a build.

## Production pages and content

The static routes are `/`, `/work/`, five project case studies, `/experiments/`, `/music/`, `/about/`, `/contact/`, and `/404.html`. Work has five entries: Encounters, Luminous Trails, Ephemeral Pulses of a Finite Scroll, BioWords, and Person Is a Data Structure. Experiments has seven entries, including Cellular Automata and six intentionally unnamed video studies. Music presents seven tracks under Amir's alias Baha; About has thirteen timeline entries. The old `/work/remote-realities/` and `/work/cellular-automata/` URLs are compatibility redirects.

- Projects: `src/content/projects/<slug>/index.md`; project media records are in each file's frontmatter.
- Experiments: `src/content/experiments/*.json`; `state: "placeholder"` keeps unknown studies labelled honestly until their media and metadata arrive.
- Music: `src/content/music/*.json`; timeline: `src/content/experience/*.json`.
- Collection schemas: `src/content.config.ts`; public profile URLs and the site origin: `src/config/site.ts`.

The homepage art and BioWords use PixiJS only on their respective routes. The hero has pre-rendered art if JavaScript or graphics initialization fails. BioWords keeps its project story, controls, and result in HTML, while its simulation and PixiJS renderer stay separate; input remains in the browser.

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

Project fields such as `alternateTitle`, `year`, and `context` are optional. Empty optional lists are hidden by the project layout, so leave them empty rather than writing placeholder headings.

Each `media` item has an `id`, `type` (`image`, `video`, or `diagram`), `intention`, `aspectRatio` (for example `16 / 9`), `alt`, `caption`, and `state` (`ready` or `placeholder`). A ready image or diagram needs `image`; video can use `poster`, typed MP4/WebM `sources`, or an HTTPS `externalUrl`. For missing media, keep `state: placeholder` and provide a useful intention, alt text, and caption. The frame then shows the project, expected content, media type, preferred ratio, and status without changing the page template.

For the final media pass, add approved source images to `Media/`, add deterministic source-to-output entries to `MEDIA_JOBS` in `scripts/prepare-media.mjs`, and run `npm run media:prepare`. Reference the optimized files from `src/assets/`, set the relevant `image` or `poster`, and switch that media record to `state: ready`. Use meaningful alt text and captions, then check the asset for private information. For video, prepare a poster and compressed MP4/WebM sources or an approved external URL. Do not use filenames as alt text. Confirm the final LinkedIn and Baha platform URLs in `src/config/site.ts`, the six unknown experiment titles and metadata, and any remaining project or track media with Amir before launch. The current SoundCloud profile value also needs owner confirmation.

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

- [Living design specification](docs/superpowers/specs/2026-08-31-personal-portfolio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-08-31-core-portfolio-implementation.md)
- [Design lab specification](docs/superpowers/specs/2026-09-14-six-concept-design-lab.md)
- [Design lab implementation plan](docs/superpowers/plans/2026-09-14-six-concept-design-lab.md)
- [Darkroom production specification](docs/superpowers/specs/2026-09-21-darkroom-portfolio-redesign-design.md)
