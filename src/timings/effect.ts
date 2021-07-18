import { Spring } from './spring'
import { EASE_FUNC } from '../types'
import { minMax, isNull } from '../utils'
import { EASING_FUNCTION_SET } from '../constant'
import { bezier, ease, easeIn, easeInOut, easeOut, linear } from './bezierEasing'


export const effect = (easing: string): EASE_FUNC => {
  // no params case
  if (easing === EASING_FUNCTION_SET.linear) {
    return linear
  } else if (easing === EASING_FUNCTION_SET.ease) {
    return ease
  } else if (easing === EASING_FUNCTION_SET.easeIn) {
    return easeIn
  } else if (easing === EASING_FUNCTION_SET.easeInOut) {
    return easeInOut
  } else if (easing === EASING_FUNCTION_SET.easeOut) {
    return easeOut
  }

  // parse ease name and params
  const easeName = easing.slice(0, easing.indexOf('('))
  if (!easeName) {
    throw new Error(`${easing} is not invalid`)
  }
  const match = /\(([^)]+)\)/.exec(easing)
  if (!match || match[1]) {
    throw new Error(`${easing} is not invalid`)
  }
  const params = match[1].split(',').map((d) => parseFloat(d))

  // spring
  if (easeName === EASING_FUNCTION_SET.spring) {
    const mass = minMax(isNull(params[0]) ? 1 : params[0], .1, 100);
    const stiffness = minMax(isNull(params[1]) ? 100 : params[1], .1, 100);
    const damping = minMax(isNull(params[2]) ? 10 : params[2], .1, 100);
    const velocity =  minMax(isNull(params[3]) ? 0 : params[3], .1, 100);
    const spring = new Spring(mass, stiffness, damping, velocity)
    return (t: number) => {
      return spring.solve(t)
    }
  }
  // cubic-bezier
  if (easeName === EASING_FUNCTION_SET.bezier) {
    return bezier.apply(null, params as any)
  }
  return linear
}