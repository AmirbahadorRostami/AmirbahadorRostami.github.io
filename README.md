# Amir Rostami portfolio

An Astro portfolio for Amir Rostami: creative technologist, software engineer, XR developer, artist, and musician. It is a static site intended to deploy from this repository to GitHub Pages.

## Requirements and local development

Use Node.js 24 locally. The `.nvmrc`, `package.json` engine, and deployment workflow all pin that major version so local development, clean installs, and GitHub Pages builds use the same runtime.

```bash
npm install
npx playwright install chromium
npm run dev
```

Useful commands:

```bash
npm run media:prepare  # regenerate optimized images from approved source media
npm run build          # type check and create dist/
npm run test           # unit, build, and browser coverage
```

Use `npm ci` for a clean, lockfile-based install in CI or when reproducing a build.

## Editing content and media

- Projects live in `src/content/projects/<slug>/index.md`.
- Music records live in `src/content/music/*.json`.
- Timeline/experience records live in `src/content/experience/*.json`.
- Their schemas live in `src/content.config.ts`; a build validates every record.

Project fields such as `alternateTitle`, `year`, and `context` are optional. Empty `collaborators`, `credits`, `outcomes`, `externalLinks`, and `videos` arrays are intentionally hidden by the project layout, so leave them empty rather than writing placeholder headings.

To add a project image, add the approved source to `Media/`, add its deterministic source-to-output entry to `MEDIA_JOBS` in `scripts/prepare-media.mjs`, then run `npm run media:prepare`. Import the generated file from `src/assets/` in the project record and set its required `heroAlt` field to a concise description of the image’s meaningful content. Do not use a filename as alt text.

## Contact endpoint

The site is static, so form delivery goes to a replaceable external endpoint. Create a local `.env` (which is ignored by Git) from `.env.example` and configure only the public endpoint value:

```dotenv
PUBLIC_CONTACT_FORM_ENDPOINT=https://your-form-provider.example/submit
```

Never commit `.env`, a recipient email address, or provider credentials. When the variable is empty, the form explains that direct delivery is being connected and remains unavailable rather than exposing private contact details. A provider can be replaced later by pointing the same variable at a compatible endpoint that accepts the form payload; the UI and content model do not need to change. A future serverless or first-party host can replace that endpoint in the same way.

For GitHub Pages, add an Actions repository variable named `PUBLIC_CONTACT_FORM_ENDPOINT` under **Settings → Secrets and variables → Actions → Variables**. The deployment workflow passes that public value to Astro at build time. Do not put a recipient address or provider credential in this variable; browser form endpoints are public by design. Leaving the variable unset keeps the deployed form safely unavailable.

## Deployment

`.github/workflows/deploy.yml` runs on pushes to `main` and by manual dispatch. It checks out the repository with `actions/checkout@v7`, builds and uploads Astro’s static artifact on Node 24 through `withastro/action@v6`, then deploys the artifact with `actions/deploy-pages@v5`. The deploy job uses the GitHub Pages environment and publishes its URL in the workflow result.

This is the username site `amirbahadorrostami.github.io`, so Astro has no `base` path configured. In GitHub repository settings, set Pages **Source** to **GitHub Actions** before the first deployment. That setting and any deployment are intentionally outside this repository change. If hosting moves later, retain the static build, update the deployment integration and canonical `site`/origin configuration as needed, and replace the contact endpoint without coupling pages to a provider.

## Project documents

- [Living design specification](docs/superpowers/specs/2026-08-31-personal-portfolio-design.md)
- [Implementation plan](docs/superpowers/plans/2026-08-31-core-portfolio-implementation.md)
