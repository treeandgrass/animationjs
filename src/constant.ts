import { IEffectTiming, IOptionalEffectTiming } from './types'
import { FillMode, PlaybackDirection } from './enum'

export const EffectTiming: IEffectTiming = {
  delay: 0,
  endDelay: 0,
  fill: FillMode.auto,
  iterationStart: 0.0,
  iterations: 1.0,
  duration: "auto",
  direction: PlaybackDirection.normal,
  easing: "linear"
}


export const OptionalEffectTiming = {
  delay: 0,
  endDelay: 0,
  fill: FillMode.auto,
  iterationStart: 0.0,
  iterations: 1.0,
  duration: "auto",
  direction: PlaybackDirection.normal,
  easing: "linear"
}