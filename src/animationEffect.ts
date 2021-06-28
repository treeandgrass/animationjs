import { IOptionalEffectTiming, IEffectTiming, IComputedEffectTiming,
  KeyframeEffectOptions, IObj, Interpolation } from './types'
import { initialValues, EASING_FUNCTION_NAME, SUPPORTED_EASING } from './constant'
import { CompositeOperation } from './enum'
import { isNull } from './utils'

export interface AnimationEffect {
  // getTiming(): IEffectTiming
  getComputedTiming(): IComputedEffectTiming
  updateTiming (timing: IOptionalEffectTiming): void
}

export class KeyframeEffect implements AnimationEffect {
  public target: Element
  public pseudoElement: string | undefined
  public composite: CompositeOperation = CompositeOperation.REPLACE
  private keyframes: IObj[]
  private options: KeyframeEffectOptions
  
  constructor(target: Element, keyframes: IObj[] | IObj, options: KeyframeEffectOptions) {
    this.target = target
    this.options = options
    if (options.composite) {
      this.composite = options.composite
    }
    this.pseudoElement = options.pseudoElement
    this.keyframes = this.normalizeKeyFrames(keyframes)
  }

  private normalizeKeyFrames (keyframes: IObj[] | IObj): IObj[] {
    let frames: IObj[] = []
    // 非数组，处理成数组
    if (!Array.isArray(keyframes)) {
      const preserveProps = ['easing', 'offset', 'composite']
      Object.keys(keyframes).forEach((prop) => {
        // 不处理['easing', 'offset', 'composite']
        if (preserveProps.includes(prop)) {
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
            frame.easing = EASING_FUNCTION_NAME.linear // default linear
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

  // private normalizeEasing(easing: string, duration) {
  //   if (is.fnc(easing)) return easing;
  //   const name = easing.split('(')[0];
  //   const ease = penner[name];
  //   const args = parseEasingParameters(easing);
  //   switch (name) {
  //     case 'spring' : return spring(easing, duration);
  //     case 'cubicBezier' : return applyArguments(bezier, args);
  //     case 'steps' : return applyArguments(steps, args);
  //     default : return applyArguments(ease, args);
  //   }
  // }

  // 对帧做插值处理
  public interpolations (keyframes: IObj[]): Interpolation[] {
    const interpolations: Interpolation[] = []
    for (let i = 0; i < keyframes.length - 1; i++) {
      // interpolations.push({
      //   to: keyframes
      // })
    }
    return interpolations
  }

  // public getTiming(): IEffectTiming {
  //   return this.options
  // }

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
}
