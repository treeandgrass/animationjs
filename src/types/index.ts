import { FillMode, PlaybackDirection, CompositeOperation } from '../enum'

export type TimeFunc = (t: number) => number

export type PropFunc = (originValue: string, target: string) => TimeFunc
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
  duration: number
  direction: PlaybackDirection
  easing: string
  endTime: number
  activeDuration: number
  localTime: number | null
  progress: number | null
  currentIteration: number | null
}

export type IEasingFunction = (t: number) => number

export interface IKeyframeEffectOptions extends IOptionalEffectTiming {
  composite?: CompositeOperation
  pseudoElement?: string
}
export interface IObj {
  [key: string]: string | number | string[] | number[]
}

export type EASE_FUNC = (t: number) => number

export type EASING_FUNCTION_NAME = 'linear' | 'ease' | 'ease-in'| 'ease-out' | 'ease-in-out' | 'spring' | 'step'

// tslint:disable-next-line: interface-name
export interface Interpolation {
  to: number
  from: number
  prop: string
  startPoint: number
  endPoint: number
  originValue: string
  targetValue: string
  easing: EASE_FUNC
  interpolate: TimeFunc
  composite: CompositeOperation
}

export interface ICommit {
  seek: number
  interpolation: Interpolation
}

export type IFromWithTo = boolean | number | boolean[] | number[] | number[][]

export interface IValueUnit {
  unit: string,
  values: string[]
}

export type DomType = keyof CSSStyleDeclaration

export interface ITransform {
  d: any[]
  t: string
}

export interface ITransformUnitValue {
  unit: string,
  values: number[]
}
export interface IParsedProps {
  prop: string
  value: ITransformUnitValue
}
