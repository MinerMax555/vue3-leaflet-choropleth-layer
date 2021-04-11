<template>
  <l-geo-json
    ref="choropleth-layer"
    :geojson="geoJson"
    :options="geoOptions"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import type { GeoJSON, PathOptions } from 'leaflet'
import { LGeoJson } from '@vue-leaflet/vue-leaflet'
import { Feature } from 'geojson'
import { ChoroplethOptions } from '../index'
import { executeCallback } from '../utils/util'

export default defineComponent({
  name: 'ChoroplethLayer',
  components: {
    LGeoJson
  },
  props: {
    geoJson: {
      type: [Object, Array] as PropType<GeoJSON>,
      required: true
    },
    data: {
      type: Object as PropType<Record<number, any>>,
      required: true
    },
    options: {
      type: Object as PropType<ChoroplethOptions>,
      required: true
    }
  },
  setup (props) {
    const geoOptions = computed(() => {
      return {
        style: (feature: Feature) => {
          const ret: PathOptions = {
            color: '#000000',
            weight: 1,
            opacity: 1,
            fillColor: executeCallback<string>(props.options.fill?.color || 'black', feature, props.data[Number(feature.id) || 1], {}),
            fillOpacity: 1
          }
          return ret
        }
      }
    })
    return { geoOptions }
  }
})
</script>

<style scoped>

</style>