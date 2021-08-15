import { IParsedProps } from '../types'
import { parseValueAndUnit } from './unit'
import { parseTransformProp } from './transform'
import { interpolate, toNumbers } from '../utils'
import { toRGBA, toRGBAStr, defaultColor } from './color'
export class PropertyHandler {
  public static transform = (originValue: string, targetValue: string) => {
    const reg = /\s*(\w+)\(([^)]*)\)/g
    const parsedOriginValue: IParsedProps[] = []
    const parsedTargetValue: IParsedProps[] = []
    // parse origin match
    let match: RegExpExecArray | null = null
    while (match = reg.exec(originValue)) {
      if (match.length >= 3) {
        const parsedValue = parseValueAndUnit(match[2])
        parsedOriginValue.push({
          prop: match[1],
          value: {
            unit: parsedValue.unit,
            values: toNumbers(parsedValue.values) as number[]
          }
        })
      }
    }
    // parse target match
    reg.lastIndex = 0
    while (match = reg.exec(targetValue)) {
      if (match.length >= 3) {
        const parsedValue = parseValueAndUnit(match[2])
        parsedTargetValue.push({
          prop: match[1],
          value: {
            unit: parsedValue.unit,
            values: toNumbers(parsedValue.values) as number[]
          }
        })
      }
    }
    // check origin value and target value
    parsedOriginValue.forEach((item: IParsedProps, i: number) => {
      const targetItem = parsedTargetValue[i]
      if (item.prop !== targetItem.prop || item.value.values.length !== item.value.values.length) {
        throw new TypeError(`invalid value: ${originValue} and ${targetValue}`)
      }
    })
    /** interpolate
     * translate(x, y) translateX (x) translateY (y)
     * scale(n, m) scaleX (m, n) scaleY (n) scale3d(x, y, z)
     */
    return (t: number): string => {
      const value: string[] = []
      parsedOriginValue.forEach((origin: IParsedProps, i: number) => {
        const target = parsedTargetValue[i]
        value.push(parseTransformProp(origin, target, t))
      })
      return value.join(' ')
    }
  }

  public static colorHandler = (originValue: string, targetValue: string) => {
    const delimiter = ' ' // delimiter
    const originValueUnit = parseValueAndUnit(originValue, delimiter)
    const targetValueUnit = parseValueAndUnit(targetValue, delimiter)
    const originRgbaColors = originValueUnit.values.map((color) => toRGBA(color))
    const targetRgbaColor = targetValueUnit.values.map((color) => toRGBA(color))
    return (t: number) => {
      const interColors: number[][] = interpolate(originRgbaColors, targetRgbaColor, t)
      const colors = interColors.map((color) => toRGBAStr(color))
      if (colors.length) {
        return colors.join(' ')
      }
      return defaultColor
    }
  }

  public static defaultHandler = (originValue: string, targetValue: string) => {
    const originValueUnit = parseValueAndUnit(originValue)
    const targetValueUnit = parseValueAndUnit(targetValue)
    return (t: number) => {
      const originValues = toNumbers(originValueUnit.values) as number[]
      const targetValues = toNumbers(targetValueUnit.values) as number[]
      const inters = interpolate(originValues, targetValues, t)
      const normalizeInter = inters.map((item: any) => {
        return item + originValueUnit.unit
      })
      return normalizeInter.join(' ')
    }
  }
}


export const mapHandler = new Map()

// color handler
const colorProperties = ['color', 'backgroundColor', 'borderColor',
  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']
colorProperties.forEach((key) => {
  mapHandler.set(key, PropertyHandler.colorHandler)
})

// transform
const transformProperties = ['transform']
transformProperties.forEach((key) => {
  mapHandler.set(key, PropertyHandler.transform)
})


