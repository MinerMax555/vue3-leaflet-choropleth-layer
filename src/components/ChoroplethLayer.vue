<template>
  <l-geo-json
    ref="choropleth-layer"
    :geojson="geoJson"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { GeoJSON } from 'leaflet'
import { LGeoJson } from '@vue-leaflet/vue-leaflet'

export default defineComponent({
  name: 'ChoroplethLayer',
  components: {
    LGeoJson
  },
  props: {
    geoJson: {
      type: [Object, Array] as PropType<GeoJSON>
    }
  }
})
</script>

<style scoped>

</style>