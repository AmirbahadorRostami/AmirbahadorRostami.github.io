import { defineConfig } from '@playwright/test';

const contactEndpoint = process.env.PLAYWRIGHT_CONTACT_ENDPOINT ?? 'https://contact.test/submit';

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: process.env.PLAYWRIGHT_INCLUDE_CONTACT_FALLBACK === 'true'
    ? undefined
    : '**/contact-fallback.spec.ts',
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  use: {
    baseURL: 'http://127.0.0.1:4321',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      ASTRO_TELEMETRY_DISABLED: '1',
      PUBLIC_CONTACT_FORM_ENDPOINT: contactEndpoint,
    },
  },
});
