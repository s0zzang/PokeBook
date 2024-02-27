import { defineConfig } from 'vite';

const viteConfig = defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
    cors: true,
  },
  build: {
    outDir: 'docs',
  },
  css: {
    devSourcemap: true,
  },
});

export default viteConfig;
