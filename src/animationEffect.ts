import { isNull } from './utils'
import { CompositeOperation } from './enum'
import { AnimationElement } from './target/element'
import { DOM } from './target/dom'
import { EASING_FUNCTION_SET, SUPPORTED_EASING, PreserveProps } from './constant'
import { IOptionalEffectTiming, IEffectTiming, IComputedEffectTiming,
  KeyframeEffectOptions, IObj, Interpolation, EASING_FUNCTION_NAME, ICommit } from './types'

export interface AnimationEffect {
  getTiming(): IEffectTiming
  getComputedTiming(): IComputedEffectTiming
  updateTiming (timing: IOptionalEffectTiming): void
}

export class KeyframeEffect implements AnimationEffect {
  public target: Element
  public pseudoElement: string | undefined
  public composite: CompositeOperation = CompositeOperation.REPLACE

  private keyframes: IObj[]
  private options: KeyframeEffectOptions
  private interpolations: Interpolation[] = []
  private effectTarget: AnimationElement
  
  constructor(target: Element, keyframes: IObj[] | IObj, options: KeyframeEffectOptions) {
    this.target = target
    this.options = options
    if (options.composite) {
      this.composite = options.composite
    }
    this.effectTarget = new DOM(this.target)
    this.pseudoElement = options.pseudoElement
    this.keyframes = this.normalizeKeyFrames(keyframes)
    this.interpolations = this.makeInterpolations(this.keyframes)
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
    return groupKeyFrames
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
        let pairs: (string | number)[] = Array.isArray(value) ? value : [value]
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
    for (let [prop, frames] of keyFramesGroup) {
      for (let i = 0; i < frames.length - 1; i++) {
        const originFrame = frames[i]
        const targetFrame = frames[i + 1]
        const to = targetFrame.offset as number
        const from = originFrame.offset as number
        const originValue = originFrame[prop] as string
        const targetValue = targetFrame[prop] as string
        const startPoint = i === 0 ? -Infinity : from
        const endPoint = i === frames.length - 2 ? Infinity : to
        const easing = originFrame.easing as EASING_FUNCTION_NAME
        const composite = (originFrame.composite || targetFrame.composite) as CompositeOperation
        
        interpolations.push({
          to,
          prop,
          from,
          easing,
          endPoint,
          composite,
          startPoint,
          originValue,
          targetValue
        })
      }
    }
    return interpolations
  }

  public getTiming(): IEffectTiming {
    throw new Error('Method not implemented.');
  }

  public getComputedTiming(): IComputedEffectTiming {
    throw new Error('Method not implemented.');
  }

  public updateTiming(timing: IOptionalEffectTiming): void {
    Object.assign(this.options, timing)
  }


  public getKeyframes(): IObj[] {
    return this.keyframes
  }

  public setKeyframes(keyframes: IObj[] | IObj) {
    this.keyframes = this.normalizeKeyFrames(keyframes)
  }

  public commit (progress: number | undefined) {
    if (progress) {
      const commits: ICommit[] = []
      this.interpolations.filter((interpolation) => {
        return progress >= interpolation.startPoint && progress < interpolation.endPoint
      }).forEach((interpolation) => {
        const offset = progress - interpolation.from
        const duration = interpolation.to - interpolation.from
        const frameSeekValue = duration === 0 ? 0 : offset / duration
        commits.push({
          interpolation,
          seek: frameSeekValue
        })
      })
      this.effectTarget.apply(commits)
    }
  }
}
