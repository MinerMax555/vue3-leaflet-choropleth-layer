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
  <input type="range" min="0" max="99" step="1" v-model="scaleStart"> White is at {{ scaleStart }}
  <input type="range" min="1" max="100" step="1" v-model="scaleEnd"> Red is at {{ scaleEnd }}
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import axios from 'axios'
import ChoroplethLayer from '../components/ChoroplethLayer.vue'
import * as chroma from 'chroma.ts'
import { Feature } from 'geojson'
import { PartialDeep } from 'type-fest'
import { CallbackFunction, ChoroplethOptions } from '../index'
import PopupContent from './PopupContent.vue'

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

    const scaleStart = ref(0)
    const scaleEnd = ref(100)

    const fillColorFn = computed(() => {
      const ret: CallbackFunction<string> = (feature, data, { focus }) => {
        return chroma.scale('#FFFFFF', '#FF0000')
          .domain(scaleStart.value, scaleEnd.value).out('hex')(data.value)
      }
      return ret
    })
    const borderWeightFn = computed(() => {
      const ret: CallbackFunction<number> = (feature, data, { focus }) => {
        if(focus) {
          return 3
        } else {
          return 1
        }
      }
      return ret
    })
    const borderOpacityFn = computed(() => {
      const ret: CallbackFunction<number> = (feature, data, { focus }) => {
        if(focus) {
          return 1
        } else {
          return 0.5
        }
      }
      return ret
    })
    const options = computed<PartialDeep<ChoroplethOptions>>(() => {
      //To ensure
      scaleStart.value
      scaleEnd.value
      return {
        fill: {
          color: fillColorFn.value
        },
        border: {
          weight: borderWeightFn.value,
          opacity: borderOpacityFn.value
        },
        tooltip: {
          //content: () => PopupContent
        },
      }
    })
    const callbackData = computed(() => {
      return {
        forceUpdates: [scaleStart.value, scaleEnd.value]
      }
    })
    onMounted(async () => {
      const features = (await axios.get('https://gstat.eu/api/v1/adminarea/?adminLevel=8&parent=47046')).data
      features.forEach((f: any) => f.type = 'Feature')
      data.value = {}
      features.forEach((f: any) => {
        data.value[f.id] = {
          value: Math.random() * 100
        }
      })
      areas.value = {
        type: 'FeatureCollection',
        features: features
      }
    })
    return { scaleStart, scaleEnd, center, areas, data, callbackData, options }
  }
}
</script>

<style>
@import '../../node_modules/leaflet/dist/leaflet.css';
</style>
