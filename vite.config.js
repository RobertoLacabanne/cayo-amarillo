import { defineConfig } from 'vite';

export default defineConfig({
  // Se publican el regalo (index.html) y el armador de links (armar.html);
  // lab.html queda para desarrollo.
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { main: 'index.html', armar: 'armar.html' },
    },
  },
  worker: {
    format: 'es',
  },
});
