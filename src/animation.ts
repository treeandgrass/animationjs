import { UNRESOLVED } from './constant'
import { maxMin, UUIdV4 } from './utils'
import { Event } from './event/eventTarget'
import {  KeyframeEffect } from './animationEffect'
import { AnimationEffect } from './animationEffect'
import { IEffectTiming, Interpolation } from './types'
import { AnimationTimeline } from './animationTimeline'
import { registry, schedule, unRegistry } from './schedule/schedule'
import { AnimationPlayState, AnimationReplaceState, TimelinePhase, FillMode, PlaybackDirection, ICurrentDirection } from './enum'

export class Animation extends Event {
  public id: string
  timeline: AnimationTimeline;
  private startTime!: number
  private currentTime!: number
  private playbackRate!: number
  private playState!: AnimationPlayState
  private replaceState!: AnimationReplaceState
  private pending!: boolean
  private ready!: Promise<Animation>
  private finished!: Promise<Animation>
  private effect: KeyframeEffect
  private interpolations: Interpolation[]

  constructor (effect: AnimationEffect, timeline: AnimationTimeline) {
    super()
    this.id = UUIdV4()
    this.timeline = timeline
    this.effect = effect as KeyframeEffect
    const keyframes = this.effect.getKeyframes()
    this.interpolations = this.effect.interpolations(keyframes)
  }

  cancel () {
    //
  }

  finish () {
    this.playState = AnimationPlayState.finished
  }

  play () {
    registry(this)
    schedule()
  }

  pause () {
    unRegistry(this)
    this.playState = AnimationPlayState.paused
  }

  updatePlaybackRate (playbackRate: number) {
    this.playbackRate = playbackRate
  }

  reverse () {
    this.playbackRate = -this.playbackRate
  }

  persist () {


  }

  commitStyles () {

  }

  /**
   * https://drafts.csswg.org/web-animations/#animation-effect-phases-and-states
   * before phase
   * active phase
   * after phase
   * none of these phase
   */
  private calPhaseState (localTime: number | null, activeDuration: number, timing: IEffectTiming): TimelinePhase {
    if (localTime === UNRESOLVED) {
      return TimelinePhase.inactive
    }
    const endTime = timing.delay + activeDuration + timing.endDelay 
    if (localTime < Math.min(timing.delay, endTime)) {
      return TimelinePhase.before
    } else if (localTime >= Math.min(endTime, activeDuration + timing.delay)) {
      return TimelinePhase.after
    }
    return TimelinePhase.active
  }

  /**
   * calculating-the-active-time
   * https://drafts.csswg.org/web-animations/#calculating-the-active-time
   * @returns 
   */
  private calculatingTheActiveTime (timing: IEffectTiming, activeDuration: number, localTime: number, phaseState: TimelinePhase) {
    if (phaseState === TimelinePhase.before) {
      if (timing.fill === FillMode.backwards || timing.fill === FillMode.both) {
        return Math.max(localTime - timing.delay, 0)
      }
    } else if (phaseState === TimelinePhase.active) {
      return localTime - timing.delay
    } else if (phaseState === TimelinePhase.after) {
      if (timing.fill === FillMode.both || timing.fill === FillMode.backwards) {
        return maxMin(localTime - timing.delay, activeDuration, 0)
      }
    }
    return UNRESOLVED
  }

  /**
   * Calculating the overall progress
   * https://drafts.csswg.org/web-animations/#calculating-the-overall-progress
   */
  private calculatingTheOverallProgress (activeTime: number | null, activeDuration: number, phaseState: TimelinePhase, timing: IEffectTiming) {
    if (activeTime === UNRESOLVED) {
      return UNRESOLVED
    }
    let overallProgress = timing.iterationStart
    if (activeDuration === 0) {
      if (phaseState === TimelinePhase.before) {
        return overallProgress
      } else {
        return timing.iterations + overallProgress
      }
    }
    return activeTime / timing.iterations + overallProgress
  }
  /**
   * https://drafts.csswg.org/web-animations/#calculating-the-simple-iteration-progress
   * @param overallProgress 
   * @param phaseState 
   * @param activeTime 
   * @param activeDuration 
   * @param timing 
   * @returns 
   */
  private calculatingSimpleIterationProgress (overallProgress: number | null, phaseState: TimelinePhase, activeTime: number | null, activeDuration: number, timing: IEffectTiming) {
    if (overallProgress === UNRESOLVED) {
      return UNRESOLVED
    }
    let simpleIterationProgress = 0
    if (overallProgress === Infinity) {
      simpleIterationProgress = timing.iterationStart % 1.0
    } else {
      simpleIterationProgress = overallProgress / 1.0
    }
    /**
     * If all of the following conditions are true,
     * the simple iteration progress calculated above is zero, and
     * the animation effect is in the active phase or the after phase, and
     * the active time is equal to the active duration, and
     * the iteration count is not equal to zero.
     */
    if (simpleIterationProgress === 0 && (phaseState === TimelinePhase.before ||
      phaseState === TimelinePhase.after) && activeTime === activeDuration && timing.iterations !== 0) {
      simpleIterationProgress = 0
    }
    return simpleIterationProgress
  }

  // https://drafts.csswg.org/web-animations/#calculating-the-active-duration
  private calculateDuration (timing: IEffectTiming) {
    if (timing.duration === 0 || timing.iterations === 0) {
      return 0;
    }
    return (timing.duration * timing.iterations) / this.playbackRate
  }

  private calculatingTheCurrentIteration (activeTime: number | null, phaseState: TimelinePhase, overallProgress: number | null, simpleIterationProgress: number | null, timing: IEffectTiming) {
    if (activeTime === UNRESOLVED) {
      return UNRESOLVED
    }
    if (phaseState === TimelinePhase.after && timing.iterations === Infinity) {
      return Infinity
    }
    if (simpleIterationProgress === 1.0) {
      return Math.floor(overallProgress as number) - 1
    }
    return Math.floor(overallProgress as number )
  }
  /**
   * https://drafts.csswg.org/web-animations/#calculating-the-directed-progress
   * @param simpleIterationProgress 
   * @param currentIteration 
   * @param timing 
   * @returns 
   */
  private calculatingTheDirectedProgress (simpleIterationProgress: number | null, currentIteration: number | null, timing: IEffectTiming) {
    if (simpleIterationProgress === UNRESOLVED) {
      return UNRESOLVED
    }
    const playbackDirection = timing.direction
    let currentDirection = ICurrentDirection.forwards
    if (playbackDirection === PlaybackDirection.reverse) {
      currentDirection = ICurrentDirection.reverse
    } else if (playbackDirection !== PlaybackDirection.normal) {
      let d = currentIteration as number
      if (playbackDirection === PlaybackDirection['alternate-reverse']) {
        d += 1
      }
      if (d % 2 === 0 || d === Infinity) {
        currentDirection = ICurrentDirection.forwards
      } else {
        currentDirection = ICurrentDirection.reverse
      }
    }
    if (currentDirection === ICurrentDirection.forwards) {
      return simpleIterationProgress
    }
    return 1.0 - simpleIterationProgress
  }
  /**
   * @param localTime 
   * @returns 
   */
  private calculateDirectedProcessFromLocalTime (localTime: number) {
    const timing = this.effect.getTiming()
    const activeDuration = this.calculateDuration(timing)
    const phaseState = this.calPhaseState(localTime, activeDuration, timing)
    const activeTime = this.calculatingTheActiveTime(timing, activeDuration, localTime, phaseState)
    const overallProgress = this.calculatingTheOverallProgress(activeTime, activeDuration, phaseState, timing)
    const simpleIterationProgress = this.calculatingSimpleIterationProgress(overallProgress, phaseState, activeTime, activeDuration, timing)
    const currentIteration = this.calculatingTheCurrentIteration(activeTime, phaseState, overallProgress, simpleIterationProgress, timing)
    return this.calculatingTheDirectedProgress(simpleIterationProgress, currentIteration, timing)
  }

  public tick (time: number) {
    this.timeline.currentTime = time
    if (!this.startTime) {
      this.startTime = time
    }
    this.currentTime = time
  }
}
