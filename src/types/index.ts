import { FillMode, PlaybackDirection, CompositeOperation } from '../enum'

export interface IEffectTiming {
    delay: number
    endDelay: number
    fill: FillMode
    iterationStart: number
    iterations: number
    duration: number
    direction: PlaybackDirection
    easing: string
}

export interface IOptionalEffectTiming {
  delay?: number
  endDelay?: number
  fill?: FillMode
  iterationStart?: number
  iterations?: number
  duration?: number
  direction?: PlaybackDirection
  easing?: string
}

export interface IComputedEffectTiming {
  delay: number
  endDelay: number
  fill: FillMode
  iterationStart: number
  iterations: number
  duration: number | string
  direction: PlaybackDirection
  easing: string
  endTime: number
  activeDuration: number
  localTime: number
  progress: number
  currentIteration: number
}

export type IEasingFunction = (t: number) => number

export interface KeyframeEffectOptions extends IOptionalEffectTiming {
  composite?: CompositeOperation
  pseudoElement?: string
}
export interface IObj {
  [key: string]: string | number | string[] | number[]
}


export type EASING_FUNCTION_NAME = 'linear' | 'ease' | 'ease-in'| 'ease-out' | 'ease-in-out' | 'spring'

export interface Interpolation {
  to: number
  from: number
  prop: string
  startPoint: number
  endPoint: number
  originValue: string
  targetValue: string
  easing: EASING_FUNCTION_NAME
  composite: CompositeOperation
}