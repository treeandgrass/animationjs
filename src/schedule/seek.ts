import { Animation } from '../animation'
import { AnimationPlayState } from '../enum'
import { calculateDirectedProcessFromLocalTime } from '../timings/progress'

export const seek = (seekTime: number, animation: Animation) => {
  if (animation.playState === AnimationPlayState.running) {
    if (animation.effect.target) {
      const target = animation.effect.target
      const playbackRate = animation.playState
      const timing = animation.effect.getTiming()
      const progress = calculateDirectedProcessFromLocalTime(seekTime, playbackRate, timing)
      if (progress) {
        const interpolations = animation.interpolations
        interpolations.filter((interpolation) => {
          return progress >= interpolation.startPoint && progress < interpolation.endPoint
        }).forEach((interpolation) => {
          const offset = progress - interpolation.from
          const duration = interpolation.to - interpolation.from
          const frameSeekTime = duration === 0 ? 0 : offset / duration
        })
      }
    }
  }
}