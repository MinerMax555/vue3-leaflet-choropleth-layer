import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib.ts'),
      name: 'Vue3-Choropleth-Layer'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'leaflet', '@vue-leaflet/vue-leaflet'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          '@vue-leaflet/vue-leaflet': 'vue-leaflet'
        }
      },
    }
  },
  plugins: [vue()]
})
