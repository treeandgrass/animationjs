import { maxMin } from '../utils'
import { UNRESOLVED } from '../constant'
import { IComputedEffectTiming } from '../types'
import { TimelinePhase, FillMode, PlaybackDirection, ICurrentDirection } from '../enum'

/**
   * https://drafts.csswg.org/web-animations/#animation-effect-phases-and-states
   * before phase
   * active phase
   * after phase
   * none of these phase
   */
const calPhaseState = (localTime: number | null, activeDuration: number, timing: IComputedEffectTiming): TimelinePhase => {
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
const calculatingTheActiveTime = (timing: IComputedEffectTiming, activeDuration: number, localTime: number | null, phaseState: TimelinePhase) => {
  if (phaseState === TimelinePhase.before) {
    if (timing.fill === FillMode.backwards || timing.fill === FillMode.both) {
      return Math.max(localTime as number - timing.delay, 0)
    }
  } else if (phaseState === TimelinePhase.active) {
    return localTime as number - timing.delay
  } else if (phaseState === TimelinePhase.after) {
    if (timing.fill === FillMode.both || timing.fill === FillMode.backwards) {
      return maxMin(<number>localTime - timing.delay, activeDuration, 0)
    }
  }
  return UNRESOLVED
}

/**
 * Calculating the overall progress
 * https://drafts.csswg.org/web-animations/#calculating-the-overall-progress
 */
const calculatingTheOverallProgress = (activeTime: number | null, phaseState: TimelinePhase, timing: IComputedEffectTiming) => {
  if (activeTime === UNRESOLVED) {
    return UNRESOLVED
  }
  if (timing.duration === 0) {
    let overallProgress = timing.iterationStart
    if (phaseState !== TimelinePhase.before) {
      overallProgress += timing.iterations
    }
    return overallProgress
  } else {
    return activeTime / timing.duration + timing.iterationStart
  }
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
const calculatingSimpleIterationProgress = (overallProgress: number | null, phaseState: TimelinePhase, activeTime: number | null, activeDuration: number, timing: IComputedEffectTiming) => {
  if (overallProgress === UNRESOLVED) {
    return UNRESOLVED
  }
  let simpleIterationProgress = 0
  if (overallProgress === Infinity) {
    simpleIterationProgress = timing.iterationStart % 1.0
  } else {
    simpleIterationProgress = overallProgress % 1.0
  }
  /**
   * If all of the following conditions are true,
   * the simple iteration progress calculated above is zero, and
   * the animation effect is in the active phase or the after phase, and
   * the active time is equal to the active duration, and
   * the iteration count is not equal to zero.
   */
  if (simpleIterationProgress === 0 && (phaseState === TimelinePhase.active ||
    phaseState === TimelinePhase.after) && activeTime === activeDuration && timing.iterations !== 0) {
    simpleIterationProgress = 1.0
  }
  return simpleIterationProgress
}

// https://drafts.csswg.org/web-animations/#calculating-the-active-duration
const calculateDuration = (timing: IComputedEffectTiming, playbackRate: number) => {
  if (timing.duration === 0 || timing.iterations === 0) {
    return 0;
  }
  return Math.abs((timing.duration * timing.iterations) / playbackRate)
}

const calculatingTheCurrentIteration = (activeTime: number | null, phaseState: TimelinePhase, overallProgress: number | null, simpleIterationProgress: number | null, timing: IComputedEffectTiming) => {
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
const calculatingTheDirectedProgress = (simpleIterationProgress: number | null, currentIteration: number | null, timing: IComputedEffectTiming) => {
  if (simpleIterationProgress === UNRESOLVED) {
    return UNRESOLVED
  }
  const playbackDirection = timing.direction
  let currentDirection = ICurrentDirection.forwards
  if (playbackDirection === PlaybackDirection.reverse) {
    currentDirection = ICurrentDirection.reverse
  } else if (playbackDirection !== PlaybackDirection.normal) {
    let d = currentIteration as number
    if (playbackDirection === PlaybackDirection.alternateReverse) {
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
export const calculateDirectedProcessFromLocalTime = (localTime: number | null, playbackRate: number, timing: IComputedEffectTiming) => {
  const activeDuration = calculateDuration(timing, playbackRate)
  const phaseState = calPhaseState(localTime, activeDuration, timing)
  const activeTime = calculatingTheActiveTime(timing, activeDuration, localTime, phaseState)
  const overallProgress = calculatingTheOverallProgress(activeTime, phaseState, timing)
  const simpleIterationProgress = calculatingSimpleIterationProgress(overallProgress, phaseState, activeTime, activeDuration, timing)
  const currentIteration = calculatingTheCurrentIteration(activeTime, phaseState, overallProgress, simpleIterationProgress, timing)
  const progress = calculatingTheDirectedProgress(simpleIterationProgress, currentIteration, timing)
  return { progress, activeDuration, currentIteration }
}
