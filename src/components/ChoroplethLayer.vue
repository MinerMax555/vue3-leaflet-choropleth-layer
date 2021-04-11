<template>
  <l-geo-json
    ref="choropleth-layer"
    :geojson="geoJson"
    :options="geoOptions"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import type { GeoJSON, GeoJSONOptions, PathOptions } from 'leaflet'
import { LGeoJson } from '@vue-leaflet/vue-leaflet'
import { Feature } from 'geojson'
import { ChoroplethOptions } from '../index'
import { executeCallback } from '../utils/util'
import { PartialDeep } from 'type-fest'
import mergeOptions from 'merge-options'
import { defaultOptions } from '../utils/defaults'

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
      type: Object as PropType<Record<any, any>>,
      required: true
    },
    options: {
      type: Object as PropType<PartialDeep<ChoroplethOptions>>,
      required: false,
      default: {}
    }
  },
  setup (props) {
    const mergedOptions: ChoroplethOptions = mergeOptions(defaultOptions, props.options)
    const geoOptions = computed((): GeoJSONOptions => {
      return {
        style: (feature: Feature): PathOptions => {
          const id = feature.id
          if (id === undefined) {
            throw new TypeError(`Feature ${feature.toString()} has no valid id attribute`)
          }
          const fill = {
            color: executeCallback<string>(mergedOptions.fill.color, feature, props.data[id], {}),
            opacity: executeCallback<number>(mergedOptions.fill.opacity, feature, props.data[id], {}),
          }
          const border = {
            weight: executeCallback<number>(mergedOptions.border.weight, feature, props.data[id], {}),
            color: executeCallback<string>(mergedOptions.border.color, feature, props.data[id], {}),
            opacity: executeCallback<number>(mergedOptions.border.opacity, feature, props.data[id], {}),
          }
          return {
            fillColor: fill.color,
            fillOpacity: fill.opacity,

            color: border.color,
            weight: border.weight,
            opacity: border.opacity,
          }
        },
      }
    })
    return { geoOptions }
  }
})
</script>

<style scoped>

</style>