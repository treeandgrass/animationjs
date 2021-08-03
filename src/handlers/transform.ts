import { interpolate, numToStr } from '../utils'
import { parseValueAndUnit } from './unit'

export const parseTransformProp = (prop: string, origin: string, target: string, processed: number) => {
  const parsedOrigin = parseValueAndUnit(origin)
  const parsedTarget = parseValueAndUnit(target)
  if (parsedTarget.unit !== parsedOrigin.unit) {
    throw new TypeError(`invalid unit: ${prop} value`)
  }
  if (parsedTarget.values.length !== parsedOrigin.values.length) {
    throw new TypeError(`invalid ${prop} value length`)
  }
  const inter: any[] = interpolate(parsedOrigin.values, parsedTarget.values, processed)
  const normalizeInter = inter.map((item) => {
    return numToStr(item) + parsedOrigin.unit
  })

  return `${prop}(${normalizeInter.join(',')})`
}
