import Path from 'path'
import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';

import { defineConfig } from 'vite'
import copyStaticPlugin from './vite-plugins/copy-static'

const config = defineConfig({
  root: Path.join(__dirname, 'src', 'renderer'),
  publicDir: 'public',
  server: {
    port: 8080,
  },
  open: false,
  build: {
    outDir: Path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  plugins: [
    copyStaticPlugin({
      targets: [
        { src: Path.join(__dirname, 'src', 'renderer/miniwindow.html'), dest: 'build/renderer/miniwindow.html' },
      ],
    }),
    vuePlugin(),
    vueJsx()
  ],
});

module.exports = config;
