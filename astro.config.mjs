import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// fluorokit comes from ../fluorokit (a file: dependency). Build the kit
// before you run this site.
//
// SITE_BASE is the path the site is served from. It is the root here and on
// fluorokit.bigaouette.com; the deploy workflow sets it.
export default defineConfig({
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  server: { port: 4323 },
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    // The kit is a symlink to a folder beside this repo.
    server: { fs: { allow: ['..'] } },
    resolve: {
      // The stock shadcn-svelte components import from $lib.
      alias: [{ find: /^\$lib\/(.*)$/, replacement: fileURLToPath(new URL('./src/lib/$1', import.meta.url)) }],
    },
  },
});
