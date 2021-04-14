<template>
  <h1>Hi, Simon!</h1>
  <p>I am a Vue3 component that gets passed stuff as props</p>
  <ul>
    <li>current selected Feature (Area): {{ feature?.properties.name }}</li>
    <li>current data: {{ data?.value.toFixed(2) }}</li>
    <li>callbackData: {{ callbackData }}</li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Feature } from 'geojson'
import { CallbackParameter } from '../index'

export default defineComponent({
  name: 'PopupContent',
  components: { },
  props: {
    feature: {
      type: Object as PropType<Feature>,
      required: true
    },
    data: {
      type: Object as PropType<unknown>,
      required: true
    },
    callbackData: {
      type: Object as PropType<CallbackParameter>,
      required: true
    }
  },
  setup (props) {
    return {  }
  }
})
</script>