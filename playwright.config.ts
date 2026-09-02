import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
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
    command:
      'PUBLIC_CONTACT_FORM_ENDPOINT=https://contact.test/submit npm run build && npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      ASTRO_TELEMETRY_DISABLED: '1',
      PUBLIC_CONTACT_FORM_ENDPOINT: 'https://contact.test/submit',
    },
  },
});
