import { FillMode, PlaybackDirection } from '../enum'

export interface IEffectTiming {
    delay: number
    endDelay: number
    fill: FillMode
    iterationStart: number
    iterations: number
    duration: string | number
    direction: PlaybackDirection
    easing: string
}

export interface IOptionalEffectTiming {
  delay?: number
  endDelay?: number
  fill?: FillMode
  iterationStart?: number
  iterations?: number
  duration?: number | string
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



