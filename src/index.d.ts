import { Feature } from 'geojson'
import type { SVG } from 'leaflet'
import { Component } from 'vue'

type FillPattern = any

interface CallbackParameter {
  callbackData?: unknown
  /**Indicates wether the feature the currently selected/focused feature */
  focus?: boolean
}

interface BorderCallbackParameter extends CallbackParameter {
  fill: {
    opacity: number
    color: string
    //TODO pattern: FillPattern
  }
}

export interface CallbackFunction<T> {
  (feature: Feature, data: unknown, params: CallbackParameter): T
}

export interface BorderCallbackFunction<T> extends CallbackFunction<T> {
  (feature: Feature, data: unknown, params: BorderCallbackParameter): T
}

export type TooltipFn = (feature: Feature, data: unknown, params: CallbackParameter) => string

export type ChoroplethOptions = {
  fill: {
    opacity: number | CallbackFunction<number>
    color: string | CallbackFunction<string>
    pattern: FillPattern | CallbackFunction<FillPattern>
    patternColor: string | CallbackFunction<string>
  }
  border: {
    weight: number | BorderCallbackFunction<number>
    opacity: number | BorderCallbackFunction<number>
    color: string | BorderCallbackFunction<string>
    dashArray: string | CallbackFunction<string>
  }
  tooltip: {
    mode: 'disabled' | 'desktopOnly' | 'always'
    //Should last tooltip remain after leaving area
    sticky: boolean
    content: string | TooltipFn | object
  }
  popup: {
    content: string | TooltipFn | object | null
  }
  //TODO
  renderer?: SVG
}