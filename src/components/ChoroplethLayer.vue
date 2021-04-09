<template>
  <l-geo-json
    ref="choropleth-layer"
    :geojson="geoJson"
    :options="options"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import chroma from 'chroma-js'
import type { GeoJSON } from 'leaflet'
import { LGeoJson } from '@vue-leaflet/vue-leaflet'

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
    }
  },
  setup (props) {
    const options = computed(() => {
      return {
        style: (feature: any) => {
          console.log(props.data)
          const fillColor = chroma
            .scale(['#FFFFFF', '#FF0000']).domain([0, 100])
            .mode('lch')(props.data[feature.id])
          return {
            color: '#000000',
            weight: 1,
            opacity: 1,
            fillColor: fillColor,
            fillOpacity: 1
          }
        }
      }
    })
    return { options }
  }
})
</script>

<style scoped>

</style>