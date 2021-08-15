import { IParsedProps } from '../types'
import { interpolate, numToStr, toNumbers } from '../utils'

export const parseTransformProp = (origin: IParsedProps, target: IParsedProps, processed: number) => {
  const unit = origin.value.unit
  const prop = origin.prop
  if (unit !== target.value.unit) {
    throw new TypeError(`invalid unit: ${prop} value`)
  }
  const originValues = origin.value.values
  const targetValues = target.value.values
  const inter: any[] = interpolate(originValues, targetValues, processed)
  const normalizeInter = inter.map((item) => {
    return numToStr(item) + unit
  })
  return `${prop}(${normalizeInter.join(',')})`
}
