import { TimelinePhase } from './enum'

export class AnimationTimeline {
  public currentTime: number
  public phase: TimelinePhase

  constructor () {
    this.currentTime = 0
    this.phase = 0
  }
}
