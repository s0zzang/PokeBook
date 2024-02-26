// node.js 환경
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
const env = process.env.NODE_ENv;

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
    modules: {
      generateScopedName:
        env === 'development'
          ? '[name]__[local]'
          : '[name]__[local]___[hash:base64:2]',
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
});

export default viteConfig;
