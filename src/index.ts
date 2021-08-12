
import { IObj, IKeyframeEffectOptions } from './types'
import { KeyframeEffect } from './animationEffect'
import { Animation } from './animation'

// exports
export * from './animation'
export * from './animationEffect'

/**
 * play animation
 * @param target
 * @param keyframes
 * @param options
 * @returns
 */
export const anime = (target: Element, keyframes: IObj[] | IObj, options: IKeyframeEffectOptions) => {
  const keyframeEffect = new KeyframeEffect(target, keyframes, options)
  const animation = new Animation(keyframeEffect)
  animation.play()
  return animation
}
