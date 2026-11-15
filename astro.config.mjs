import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// fluorokit comes from ../fluorokit (a file: dependency). Build the kit
// before you run this site.
//
// On GitHub Pages the site is served from a sub-path. The deploy workflow
// sets SITE_BASE; locally the site is at the root.
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
