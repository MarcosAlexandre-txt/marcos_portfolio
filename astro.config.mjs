import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'static',
  site: process.env.ASTRO_SITE || undefined,
  base: process.env.ASTRO_BASE || '/',
  devToolbar: { enabled: false },
});
