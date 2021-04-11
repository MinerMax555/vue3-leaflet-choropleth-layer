<template>
  <l-map
    :zoom="9"
    :center="center"
    style="height: 750px"
  >
    <l-tile-layer :url="'https://{s}.tile.osm.org/{z}/{x}/{y}.png'" />
    <choropleth-layer
      v-if="areas && data"
      :geo-json="areas"
      :data="data"
      :options="options"
    />
  </l-map>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import axios from 'axios'
import ChoroplethLayer from '../components/ChoroplethLayer.vue'
import * as chroma from 'chroma.ts'
import { Feature } from 'geojson'
import { Scale } from 'chroma.ts'

export default {
  name: 'App',
  components: {
    ChoroplethLayer,
    LMap,
    LTileLayer
  },
  setup () {
    const center = [46.575855, 11.374969]

    const areas = ref<any>(null)
    const data = ref<any>(null)
    const fillColorFn = (feature: Feature, data: any,) => {
      return chroma.scale('#FFFFFF', '#FF0000')
        .domain(0, 100).out('hex')(data)
    }
    const options = {
      fill: {
        color: fillColorFn
      }
    }
    onMounted(async () => {
      const features = (await axios.get('https://gstat.eu/api/v1/adminarea/?adminLevel=8&parent=47046')).data
      features.forEach((f: any) => f.type = 'Feature')
      data.value = {}
      features.forEach((f: any) => {
        data.value[f.id] = Math.random() * 100
      })
      areas.value = {
        type: 'FeatureCollection',
        features: features
      }
    })
    return { center, areas, data, options }
  }
}
</script>

<style>
@import '../../node_modules/leaflet/dist/leaflet.css';
</style>
