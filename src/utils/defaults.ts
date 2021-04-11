import { CallbackFunction, ChoroplethOptions } from '../index'
import * as chroma from 'chroma.ts'

const defaultFillColorFn: CallbackFunction<string> = (feature, data) => {
  return chroma.scale('#FFFFFF', '#FF0000')
    .domain(0, 100).out('hex')((data as any).value)
}

export const defaultOptions: ChoroplethOptions = {
  fill: {
    color: defaultFillColorFn,
    opacity: 1,
    pattern: null
  },
  border: {
    weight: 0.5,
    opacity: 0.5,
    color: '#000000',
    pattern: null
  },
  tooltip: {
    mode: 'disabled',
    onHover: true,
    sticky: false,
    activationDelay: 0,
    content: '<h1>Default tooltip</h1>'
  },
}