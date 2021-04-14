<template>
  <l-geo-json
    ref="choropleth-layer"
    :geojson="geoJson"
    :options="geoOptions"
    @mouseenter="onMouseEnter"
  >
    <l-tooltip>
      <component
        v-if="typeof tooltip === 'object' && currentFeature"
        :is="tooltip"
        :feature="currentFeature"
        :data="currentData"
        :callback-data="callbackData"
      />
      <div v-else v-html="tooltip" />
    </l-tooltip>
  </l-geo-json>
</template>

<script lang="ts">
import type { GeoJSON, GeoJSONOptions, PathOptions } from 'leaflet'
import type { Feature } from 'geojson'
import type { ChoroplethOptions } from '../index'
import { Component, computed, defineComponent, PropType, ref } from 'vue'
import { LGeoJson, LPopup, LTooltip } from '@vue-leaflet/vue-leaflet'
import { PartialDeep } from 'type-fest'
import mergeOptions from 'merge-options'
import { executeCallback } from '../utils/util'
import { defaultOptions } from '../utils/defaults'

export default defineComponent({
  name: 'ChoroplethLayer',
  components: {
    LGeoJson,
    LPopup,
    LTooltip
  },
  props: {
    geoJson: {
      type: [Object, Array] as PropType<GeoJSON>,
      required: true
    },
    data: {
      type: Object as PropType<Record<any, unknown>>,
      required: true
    },
    options: {
      type: Object as PropType<PartialDeep<ChoroplethOptions>>,
      required: false,
      default: {}
    },
    callbackData: {
      type: Object as PropType<Record<any, unknown>>,
      required: false,
      default: {}
    }
  },
  setup (props, context) {
    const currentFeature = ref<Feature | null>(null)
    const currentData = computed((): unknown => getDataForFeature(currentFeature.value))
    function getDataForFeature (feature: Feature): unknown | null {
      const id = feature?.id
      if (feature && id === undefined) {
        throw new TypeError(`Feature ${feature.toString()} has no valid id attribute`)
      }
      if (!id) {
        return null
      } else {
        return props.data[id]
      }
    }
    const mergedOptions: ChoroplethOptions = mergeOptions(defaultOptions, props.options)
    const geoOptions = computed((): GeoJSONOptions => {
      return {
        style: (feature?: Feature): PathOptions => {
          if (!feature)
            return {}
          const data = getDataForFeature(feature)
          const fill = {
            color: executeCallback<string>(mergedOptions.fill.color, feature, data, { callbackData: props.callbackData }),
            opacity: executeCallback<number>(mergedOptions.fill.opacity, feature, data, { callbackData: props.callbackData }),
          }
          const border = {
            weight: executeCallback<number>(mergedOptions.border.weight, feature, data, { callbackData: props.callbackData, fill: fill }),
            color: executeCallback<string>(mergedOptions.border.color, feature, data, { callbackData: props.callbackData, fill: fill }),
            opacity: executeCallback<number>(mergedOptions.border.opacity, feature, data, { callbackData: props.callbackData, fill: fill }),
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
    const tooltip = computed((): Component | string => {
      if (typeof mergedOptions.tooltip.content === 'object') {
        return mergedOptions.tooltip.content
      } else {
        return executeCallback<string>(mergedOptions.tooltip.content, currentFeature.value, currentData.value, { callbackData: props.callbackData })
      }
    })
    function onMouseEnter(event) {
      context.emit('mouseenter', event)
      currentFeature.value = event.sourceTarget.feature
    }
    return { geoOptions, tooltip, currentFeature, currentData, onMouseEnter }
  }
})
</script>