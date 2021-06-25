import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-dts'
import analyze from 'rollup-plugin-analyzer'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "~": path.resolve(__dirname, 'playground'),
    }
  },
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
  plugins: [
    vue(),
    dts(),
    analyze(),
    visualizer({ template: 'treemap', filename: 'stats/treemap.html' }),
    visualizer({ template: 'sunburst', filename: 'stats/suburst.html' }),
    visualizer({ template: 'network', filename: 'stats/network.html' })
  ]
})
