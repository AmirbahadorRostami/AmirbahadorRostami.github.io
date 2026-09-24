import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://amirbahadorrostami.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => {
      const path = new URL(page).pathname;
      return !path.startsWith('/design-lab/')
        && !['/work/remote-realities/', '/work/cellular-automata/', '/404.html'].includes(path);
    },
  })],
});
