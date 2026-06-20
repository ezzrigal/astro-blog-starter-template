// astro.config.mjs
// Site URL is read from the SITE_URL environment variable.
// Set this in: Cloudflare Pages → Settings → Environment Variables
// For local dev: create .env file with SITE_URL=http://localhost:4321

import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// Fallback to the JSON file value if env var not set
let siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  try {
    const settings = await import('./src/data/site-settings.json', { assert: { type: 'json' } });
    siteUrl = settings.default.siteUrl;
  } catch {
    siteUrl = 'http://localhost:4321';
  }
}

export default defineConfig({
  site: siteUrl,

  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/oauth'),
    }),
  ],

  i18n: {
    defaultLocale: 'ar',
    locales: ['ar'],
  },
});
