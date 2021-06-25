# Vue3-Choropleth-Layer
A Map Layer intended to be used with [@vue-leaflet/vue-leaflet](https://github.com/vue-leaflet/vue-leaflet)

## Installation
`npm install @gstat/vue3-choropleth-layer`

## Usage
```vue
<template>
  <l-map style="height:50vh">
    <vue-choropleth-layer 
      :geo-json="geojson"
      :data="data"
      :options="options"
    />
  </l-map>
</template>

<script>
import "leaflet/dist/leaflet.css"
import { LMap } from "@vue-leaflet/vue-leaflet";
import VueChoroplethLayer from '@gstat/vue3-choropleth-layer';

export default {
  components: {
    LMap,
    VueChoroplethLayer
  },
  data() {
    return {
      geojson: {
        type: "FeatureCollection",
        features: [
          // Features must have an "id" field!
          {
            id: 'foo',
            // geometry, properties ...
          }
          // ...
        ],
      },
      data: {
        'foo': 42
      },
      options: {
        // Styling options, see src/utils/defaults for defaults and types
      }
    };
  },
};
</script>
```