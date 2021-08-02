import { IObj } from '../types'
import { Transform } from './transform'
export class PropertyHandler {
  public static transform (originValue: string, targetValue: string) {
    const reg = /\s*(\w+)\(([^)]*)\)/g
    const parsedOriginValue: IObj = {}
    const parsedTargetValue: IObj = {}
    // parse origin match
    let match: RegExpExecArray = null
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
    originValueKeys.forEach((key) => {
      if (!targetValueKeys[key] || typeof targetValueKeys[key] !== typeof originValueKeys[key]) {
        throw new TypeError(`invalid value: ${originValue} and ${targetValue}`)
      }
    })
    /** interpolate
     * translate(x, y)
     * translateX (x)
     * translateY (y)
     * scale(n, m)
     * scaleX (m, n)
     * scaleY (n)
     * scale3d(x, y, z)
     */
    return (t: number): string => {
      let value = ''
      originValueKeys.forEach((key) => {
        const origin = parsedOriginValue[key]
        const target = parsedTargetValue[key]
        value += Transform[key](key, origin, target, t)
      })
      return value
    }
  }
}


/**
 * transform: px % turn
 * color
 * background-color
 * position
 * width
 * height -> px 50%
 * rem
 * %
 * turn
 */
