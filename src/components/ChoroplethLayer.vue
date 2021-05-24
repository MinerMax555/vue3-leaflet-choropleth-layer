<template>
  <l-geo-json
    ref="layer"
    :geojson="geoJson"
    :options="geoOptions"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <l-tooltip v-show="tooltip">
      <component
        v-if="typeof tooltip === 'object' && currentFeature"
        :is="tooltip"
        :feature="currentFeature"
        :feature-data="currentData"
        :callback-data="callbackData"
      />
      <div v-else v-html="tooltip" />
    </l-tooltip>
  </l-geo-json>
</template>

<script lang="ts">
import type { GeoJSON, GeoJSONOptions, LeafletMouseEvent, PathOptions } from 'leaflet'
import type { Feature } from 'geojson'
import type { BorderCallbackParameter, ChoroplethOptions } from '../index'
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
    //TODO correct type of LGeoJson
    const layer = ref<any | null>(null)
    const currentFeature = ref<Feature | null>(null)
    const currentData = computed((): unknown => getDataForFeature(currentFeature.value))

    function getDataForFeature (feature: Feature | null): unknown | null {
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
      const style = (feature?: Feature): PathOptions => {
        if (!feature)
          return {}
        let focus = false
        if (currentFeature.value && currentFeature.value?.id === feature.id) {
          focus = true
        }
        const data = getDataForFeature(feature)
        const fill = {
          color: executeCallback<string>(mergedOptions.fill.color, feature, data,
            { callbackData: props.callbackData, focus: focus }),
          opacity: executeCallback<number>(mergedOptions.fill.opacity, feature, data,
            { callbackData: props.callbackData, focus: focus }),
        }
        const border = {
          weight: executeCallback<number, BorderCallbackParameter>(mergedOptions.border.weight, feature, data,
            { callbackData: props.callbackData, focus: focus, fill: fill }),
          color: executeCallback<string, BorderCallbackParameter>(mergedOptions.border.color, feature, data,
            { callbackData: props.callbackData, focus: focus, fill: fill }),
          opacity: executeCallback<number, BorderCallbackParameter>(mergedOptions.border.opacity, feature, data,
            { callbackData: props.callbackData, focus: focus, fill: fill }),
        }
        return {
          fillColor: fill.color,
          fillOpacity: fill.opacity,

          color: border.color,
          weight: border.weight,
          opacity: border.opacity,
        }
      }
      const leafletObj: GeoJSON = layer.value?.leafletObject
      if (leafletObj?.setStyle) {
        leafletObj.setStyle(style)
      }
      return { style }
    })
    const tooltip = computed((): Component | string | null => {
      if(mergedOptions.tooltip.mode === 'disabled')
        return null
      if (typeof mergedOptions.tooltip.content === 'object') {
        return mergedOptions.tooltip.content
      } else {
        if (!currentFeature.value) {
          return null
        }
        return executeCallback<string>(mergedOptions.tooltip.content, currentFeature.value, currentData.value, { callbackData: props.callbackData })
      }
    })

    function onMouseEnter (event: LeafletMouseEvent) {
      context.emit('mouseenter', event)
      currentFeature.value = event.sourceTarget.feature
      if (event.sourceTarget?.bringToFront) {
        //Bring focused area to front to have no overlaps / border issues
        event.sourceTarget.bringToFront()
      }
    }
    function onMouseLeave (event: LeafletMouseEvent) {
      context.emit('mouseleave', event)
      currentFeature.value = null
    }

    return { layer, geoOptions, tooltip, currentFeature, currentData, onMouseEnter, onMouseLeave }
  }
})
</script>