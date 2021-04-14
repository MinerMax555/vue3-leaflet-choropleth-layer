import { Feature } from 'geojson'
import { CallbackParameter, CallbackFunction } from '../index'

export function executeCallback<T, CallbackType=CallbackParameter> (
  val: T | CallbackFunction<T>,
  feature: Feature,
  data: unknown,
  params:CallbackType): T {
  if (typeof val === 'function') {
    return (val as CallbackFunction<T>)(feature, data, params)
  }
  return val
}