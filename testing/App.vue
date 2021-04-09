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
    />
  </l-map>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import axios from 'axios'
import ChoroplethLayer from '../src/components/ChoroplethLayer'
import type { GeoJSON } from 'leaflet'

export default {
  name: 'App',
  components: {
    ChoroplethLayer,
    LMap,
    LTileLayer
  },
  setup () {
    const center = [46.575855, 11.374969]

    const areas = ref(null) as ref<GeoJSON>
    const data = ref(null) as ref<Record<number, any>>
    onMounted(async () => {
      const features = (await axios.get('https://gstat.eu/api/v1/adminarea/?adminLevel=8&parent=47046')).data
      features.forEach(f => f.type = 'Feature')
      data.value = {}
      features.forEach(f => {
        data.value[f.id] = Math.random() * 100
      })
      areas.value = {
        type: 'FeatureCollection',
        features: features
      }
    })
    return { center, areas, data }
  }
}
</script>

<style>
@import '../node_modules/leaflet/dist/leaflet.css';
</style>
