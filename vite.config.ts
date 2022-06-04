import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
      '~/': `${resolve(__dirname, 'types')}/`,
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'v-calendar',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@popperjs/core'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          '@popperjs/core': 'PopperCore',
        },
      },
    },
  },
});
