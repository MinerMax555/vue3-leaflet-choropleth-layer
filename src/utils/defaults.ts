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
    pattern: null,
    patternColor: 'TODO'
  },
  border: {
    weight: 0.5,
    opacity: 0.5,
    color: '#000000',
    dashArray: 'TODO'
  },
  tooltip: {
    mode: 'disabled',
    sticky: false,
    content: '<h1>Default tooltip</h1>'
  },
  popup: {
    //TODO reset to null
    content: '<h2>Im Popup!</h2>'
  }
}