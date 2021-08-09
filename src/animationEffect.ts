import { isNull } from './utils'
import { DOM } from './target/dom'
import { effect } from './timings/effect'
import { CompositeOperation, FillMode, PlaybackDirection } from './enum'
import { linear } from './timings/bezierEasing'
import { IAnimationElement } from './target/element'
import { calculateDirectedProcessFromLocalTime } from './timings/progress'
import { IOptionalEffectTiming, IEffectTiming, IComputedEffectTiming, EASE_FUNC,
  IKeyframeEffectOptions, IObj, Interpolation, ICommit, TimeFunc, PropFunc } from './types'
import { EASING_FUNCTION_SET, SUPPORTED_EASING, PreserveProps,
  InitializeComputedTiming, InitializeEffectTiming } from './constant'
import { PropertyHandler, mapHandler } from './handlers/handler'

type PropertyHandlerKeyType = keyof PropertyHandler
export interface IAnimationEffect {
  getTiming (): IEffectTiming
  getComputedTiming (): IComputedEffectTiming
  updateTiming (timing: IOptionalEffectTiming): void
}
export class KeyframeEffect implements AnimationEffect {
  public target: Element
  public pseudoElement: string | undefined
  public composite: CompositeOperation = CompositeOperation.REPLACE

  private keyframes: IObj[]
  private options: IKeyframeEffectOptions
  private interpolations: Interpolation[] = []
  private effectTarget: IAnimationElement
  private effect: EASE_FUNC = linear
  // tslint:disable-next-line: variable-name
  private _timing!: IEffectTiming
  // tslint:disable-next-line: variable-name
  private _computedTiming: IComputedEffectTiming

  constructor (target: Element, keyframes: IObj[] | IObj, options: IKeyframeEffectOptions) {
    this.target = target
    this.options = options
    if (options.composite) {
      this.composite = options.composite
    }
    if (!options.easing) {
      options.easing = 'linear'
    }
    this._timing = this.makeTiming(options)
    this._computedTiming = this.makeComputedTiming(options)
    this.effect = effect(options.easing)
    this.effectTarget = new DOM(this.target)
    this.pseudoElement = options.pseudoElement
    this.keyframes = this.normalizeKeyFrames(keyframes)
    this.interpolations = this.makeInterpolations(this.keyframes)
  }

  public getTiming (): IEffectTiming {
    return Object.assign({}, this._timing)
  }

  public getComputedTiming (): IComputedEffectTiming {
    return Object.assign({}, this._computedTiming)
  }

  public updateTiming (timing: IOptionalEffectTiming): void {
    Object.assign(this.options, timing)
  }


  public getKeyframes (): IObj[] {
    return this.keyframes
  }

  public setKeyframes (keyframes: IObj[] | IObj) {
    this.keyframes = this.normalizeKeyFrames(keyframes)
  }

  public commit (seekTime: number | null, playbackRate: number) {
    const { progress, activeDuration, currentIteration } =
      calculateDirectedProcessFromLocalTime(seekTime, playbackRate, this._computedTiming)
    Object.assign(this._computedTiming, { progress, activeDuration, currentIteration })
    if (progress) {
      const commits: ICommit[] = []
      const eased = this.effect(progress)
      this.interpolations.filter((interpolation) => {
        return eased >= interpolation.startPoint && eased < interpolation.endPoint
      }).forEach((interpolation) => {
        const total = interpolation.to - interpolation.from
        const offset = eased - interpolation.from
        const frameSeekValue = total === 0 ? 0 : interpolation.easing(offset / total)
        commits.push({
          interpolation,
          seek: frameSeekValue
        })
      })
      this.effectTarget.apply(commits)
    }
  }

  private groupKeyFramesByProp (normKeyFrames: IObj[]) {
    const groupKeyFrames = new Map<string, IObj[]>()
    normKeyFrames.forEach((item) => {
      Object.keys(item).forEach((key: string) => {
        if (!PreserveProps.includes(key)) {
          if (!groupKeyFrames.has(key)) {
            groupKeyFrames.set(key, [])
          }
          const keyFrameSet = groupKeyFrames.get(key)
          keyFrameSet?.push(item)
        }
      })
    })
    for (const [prop, frames] of groupKeyFrames) {
      if (frames[0].offset !== 0 || frames[frames.length - 1].offset !== 1) {
        throw new TypeError('invalid offset: first item should be zero and last item should be one')
      }
    }
    return groupKeyFrames
  }

  private makeTiming (options: IKeyframeEffectOptions) {
    const timings = Object.assign({}, InitializeEffectTiming)
    const keys = ['delay', 'direction', 'duration', 'easing', 'endDelay', 'fill',
      'iterationStart', 'iterations']
    keys.forEach((key) => {
      if (key === 'duration' && typeof options[key] === 'number') {
        const duration = options[key] as number
        if (duration >= 0) {
          timings.duration = duration
        } else {
          throw new Error('KeyframeEffect: duration must be non-negative or auto')
        }
      }
      if (key === 'delay' && typeof options[key] === 'number') {
        const delay = options[key] as number
        if (!isFinite(delay)) {
          throw new Error('KeyframeEffect: delay must be finite')
        }
        if (delay >= 0) {
          timings.delay = delay
        }
      }
      if (key === 'endDelay' && typeof options[key] === 'number') {
        const endDelay = options[key] as number
        if (!isFinite(endDelay)) {
          throw new Error('KeyframeEffect: endDelay must be finite')
        }
        if (endDelay >= 0) {
          timings.endDelay = endDelay
        }
      }
      if (key === 'easing' && options[key]) {
        if (typeof options[key] !== 'string') {
          throw new Error(`KeyframeEffect: ${options[key]} is not a valid value for easing`)
        } else {
          timings[key] = options[key] as string
        }
      }
      if (key === 'fill' && options[key]) {
        const fill = options[key] as FillMode
        if (fill !== FillMode.none && fill !== FillMode.auto &&
          fill !== FillMode.backwards && fill !== FillMode.both && fill !== FillMode.forwards) {
          throw new Error(`KeyframeEffect: ${options[key]} is not a valid value for fill`)
        } else {
          timings.fill = fill
        }
      }
      if (key === 'direction' && options[key]) {
        const direction = options[key] as PlaybackDirection
        if (direction !== PlaybackDirection.alternate && direction !== PlaybackDirection.alternateReverse
          && direction !== PlaybackDirection.normal && direction !== PlaybackDirection.reverse) {
          throw new Error(`KeyframeEffect: ${options[key]} is not a valid value for direction`)
        } else {
          timings.direction = direction
        }
      }
      if (key === 'iterations' && options[key]) {
        const iterations = options[key]
        if (typeof iterations !== 'number' || iterations < 0) {
          throw new Error(`KeyframeEffect: ${options[key]} is not a valid value for iterations`)
        } else {
          timings[key] = iterations
        }
      }
      if (key === 'iterationStart' && options[key]) {
        const iterationStart = options[key] as number
        if (!isFinite(iterationStart)) {
          throw new Error('KeyframeEffect: The provided double value is non-finite')
        } else if (iterationStart > 0) {
          timings[key] = iterationStart
        }
      }
    })
    return timings
  }

  private makeComputedTiming (options: IKeyframeEffectOptions) {
    const cloneTiming = this.getTiming()
    if (cloneTiming.duration === 'auto') {
      cloneTiming.duration = 0
    }
    const computedTiming = Object.assign({}, InitializeComputedTiming, cloneTiming)
    return computedTiming
  }

  private normalizeKeyFrames (keyframes: IObj[] | IObj): IObj[] {
    let frames: IObj[] = []
    // 非数组，处理成数组
    if (!Array.isArray(keyframes)) {
      Object.keys(keyframes).forEach((prop) => {
        // 不处理['easing', 'offset', 'composite']
        if (PreserveProps.includes(prop)) {
          return
        }
        const value = keyframes[prop]
        const pairs: Array<string| number> = Array.isArray(value) ? value : [value]
        if (pairs.length === 0) { // 边界情况
          return
        }
        const valuesLength = pairs.length
        // 处理pairs.length === 1 的情况
        for (let i = 0; i < valuesLength; i++) {
          const frame: IObj = {}
          frame[prop] = pairs[i]
          // 处理offset, 保证边界的0和1
          if (keyframes.offset) {
            const offset = keyframes.offset
            if (Array.isArray(offset)) {
              frame.offset = offset[i]
            } else {
              frame.offset = offset
            }
          } else if (valuesLength === 1) {
            frame.offset = 1.0
          } else {
            frame.offset = i / (valuesLength - 1.0)
          }
          // composite
          if (keyframes.composite) {
            const composite = keyframes.composite
            if (Array.isArray(composite)) {
              frame.composite = composite[i]
            } else {
              frame.composite = composite // 处理composite
            }
          }
          if (keyframes.easing) {
            const easing = keyframes.easing
            if (Array.isArray(easing)) {
              frame.easing = easing[i]
            } else {
              frame.easing = easing
            }
          }
          frames.push(frame)
        }
        // 排序
        frames.sort((a, b) => {
          const left = a.offset as number
          const right = b.offset as number
          return left - right
        })
      })
    } else {
      frames = keyframes
    }
    // 检查属性是否合法
    frames.map((frame) => {
      Object.keys(frame).forEach((prop) => {
        const propValue = frame[prop]
        if (prop === 'composite') {
          if (propValue !== CompositeOperation.REPLACE) {
            throw new Error('CompositeOperation, which replace is only by supported')
          }
        } else if (prop === 'offset') {
          const offsetValue = Number(propValue)
          if (0 > offsetValue || 1.0 < offsetValue) {
            throw new Error(`offset value is invalid: ${propValue}`)
          }
        } else if (prop === 'easing') {
          const easingValue = propValue + ''
          if (!SUPPORTED_EASING.includes(easingValue)) {
            throw new Error(`${easingValue} is not supported`)
          }
          if (!easingValue) {
            frame.easing = EASING_FUNCTION_SET.linear // default linear
          }
        } else {
          frame[prop] = propValue + ''
        }
      })
      return frame
    })

    // 检查offset为空 & offset顺序
    let isExistNullOffset = false
    let previousOffsetValue = -Infinity
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < frames.length; i++) {
      if (isNull(frames[i].offset)) {
        isExistNullOffset = true
      } else {
        const offset = +frames[i].offset
        if (offset < previousOffsetValue) {
          throw new Error('previous offset is bigger than next, which is not allowed')
        }
        previousOffsetValue = offset
      }
    }


    // 处理offset为空的情况
    if (isExistNullOffset) {
      let lastOffsetIndex = 0
      let lastOffsetValue = 0
      frames.forEach((frame, i) => {
        const offset = frame.offset
        if (i === 0) {
          frame.offset = frame.offset || 0.0
        } else if (i === frames.length - 1) {
          frame.offset = frame.offset || 1.0
        } else {
          if (!isNull(offset)) {
            // 处理offset不存在的情况，做均匀插值
            for (let j = 1; j < i - lastOffsetIndex; j++) {
              frames[j].offset = lastOffsetValue + (+frames[i].offset - lastOffsetValue) * j / (i - lastOffsetIndex)
            }
            lastOffsetIndex = i
            lastOffsetValue = +frame.offset
          }
        }
      })
    }

    return frames
  }

  // 对帧做插值处理
  private makeInterpolations (keyframes: IObj[]): Interpolation[] {
    const interpolations: Interpolation[] = []
    const keyFramesGroup = this.groupKeyFramesByProp(keyframes)
    for (const [prop, frames] of keyFramesGroup) {
      for (let i = 0; i < frames.length - 1; i++) {
        const originFrame = frames[i]
        const targetFrame = frames[i + 1]
        const to = targetFrame.offset as number
        const from = originFrame.offset as number
        const originValue = originFrame[prop] as string
        const targetValue = targetFrame[prop] as string
        const startPoint = i === 0 ? -Infinity : from
        const endPoint = i === frames.length - 2 ? Infinity : to
        const easing = effect(originFrame.easing as string)
        const composite = (originFrame.composite || targetFrame.composite ||
          CompositeOperation.REPLACE) as CompositeOperation
        const propFunc: PropFunc = mapHandler.get(prop) || PropertyHandler.defaultHandler
        const interpolate = propFunc(originValue, targetValue)
        interpolations.push({
          to,
          prop,
          from,
          endPoint,
          composite,
          startPoint,
          easing,
          interpolate,
          originValue,
          targetValue
        })
      }
    }
    return interpolations
  }
}
