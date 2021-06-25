<template>
  <h1>Hi, Simon!</h1>
  <p>I am a Vue3 component that gets passed stuff as props</p>
  <ul>
    <li>current selected Feature (Area): {{ feature?.properties?.name }}</li>
    <li>current data: {{ typedData.value.toFixed(2) }}</li>
    <li>callbackData: {{ callbackData }}</li>
  </ul>
</template>

<script lang="ts">
import type { Feature } from 'geojson'
import type { CallbackParameter } from '@/index'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PopupContent',
  components: { },
  props: {
    feature: {
      type: Object as PropType<Feature>,
      required: true
    },
    featureData: {
      type: Object as PropType<unknown>,
      required: true
    },
    callbackData: {
      type: Object as PropType<CallbackParameter>,
      required: true
    }
  },
  setup (props) {
    const typedData = computed(() => props.featureData as any)
    return { typedData }
  }
})
</script>