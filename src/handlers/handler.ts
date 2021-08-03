import { IObj } from '../types'
import { parseTransformProp } from './transform'
export class PropertyHandler {
  public static transform (originValue: string, targetValue: string) {
    const reg = /\s*(\w+)\(([^)]*)\)/g
    const parsedOriginValue: IObj = {}
    const parsedTargetValue: IObj = {}
    // parse origin match
    let match: RegExpExecArray | null = null
    while (match = reg.exec(originValue)) {
      if (match.length >= 3) {
        parsedOriginValue[match[1]] = match[2]
      }
    }
    // parse target match
    reg.lastIndex = 0
    while (match = reg.exec(targetValue)) {
      if (match.length >= 3) {
        parsedTargetValue[match[1]] = match[2]
      }
    }
    const originValueKeys = Object.keys(parsedOriginValue)
    const targetValueKeys = Object.keys(parsedTargetValue)
    if (originValueKeys.length !== targetValueKeys.length) {
      throw new TypeError(`invalid value: ${originValue} and ${targetValue}`)
    }
    // check origin value and target value
    originValueKeys.forEach((key: string) => {
      if (!parsedOriginValue[key] || typeof parsedTargetValue[key] !== typeof parsedOriginValue[key]) {
        throw new TypeError(`invalid value: ${originValue} and ${targetValue}`)
      }
    })
    /** interpolate
     * translate(x, y) translateX (x) translateY (y)
     * scale(n, m) scaleX (m, n) scaleY (n) scale3d(x, y, z)
     */
    return (t: number): string => {
      const value: string[] = []
      originValueKeys.forEach((key) => {
        const origin = parsedOriginValue[key]
        const target = parsedTargetValue[key]
        value.push(parseTransformProp(key, origin as string, target as string, t))
      })
      return value.join(' ')
    }
  }
}

