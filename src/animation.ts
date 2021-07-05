import { UNRESOLVED } from './constant'
import { UUIdV4 } from './utils'
import { Event } from './event/eventTarget'
import {  KeyframeEffect } from './animationEffect'
import { AnimationEffect } from './animationEffect'
import { Interpolation } from './types'
import { AnimationTimeline } from './animationTimeline'
import { registry, schedule, unRegistry } from './schedule/schedule'
import { calculateDirectedProcessFromLocalTime } from './timings/progress'
import { AnimationPlayState, AnimationReplaceState, TimelinePhase, FillMode, PlaybackDirection, ICurrentDirection } from './enum'

export class Animation extends Event {
  public id: string
  public timeline: AnimationTimeline | null = null;
  public startTime: number | null = UNRESOLVED
  private currentTime: number | null = UNRESOLVED
  private holdTime: number | null = UNRESOLVED
  public  playbackRate: number = 0
  public playState: AnimationPlayState = AnimationPlayState.idle
  private replaceState!: AnimationReplaceState
  private pending!: boolean
  private ready!: Promise<Animation>
  private finished!: Promise<Animation>
  public effect: KeyframeEffect
  public interpolations: Interpolation[]

  constructor (effect: AnimationEffect, timeline: AnimationTimeline | null) {
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
   * https://drafts.csswg.org/web-animations-1/#current-time
   * @param seekTime 
   */
  private setCurrentTime (seekTime: number | null) {
    // 4.4.4. Setting the current time of an animation
    if (seekTime === UNRESOLVED && this.currentTime !== UNRESOLVED) {
      throw new Error("can't set unresolved value to resolved currentTime")
    }
    // Update either animation’s hold time or start time
    if (this.holdTime !== UNRESOLVED || this.startTime !== UNRESOLVED ||
      this.timeline === null || this.timeline.phase === TimelinePhase.inactive || this.playbackRate === 0) {
        this.holdTime = seekTime
    } else if (seekTime) {
      this.startTime = this.timeline.currentTime - (seekTime / this.playbackRate)
    }

    if (this.holdTime !== UNRESOLVED) {
      this.currentTime = this.holdTime
    } else if (this.timeline === null || this.timeline.phase !== TimelinePhase.inactive || this.startTime === UNRESOLVED) {
      this.currentTime = UNRESOLVED
    } else {
      this.currentTime = (this.timeline.currentTime - this.startTime) * this.playbackRate
    }
  }

  public tick (time: number) {
    if (this.timeline) {
      this.timeline.currentTime = time
    }
    if (!this.startTime) {
      this.startTime = time
    }
    this.currentTime = time

    // const directedProcess = this.calculateDirectedProcessFromLocalTime((this.currentTime - this.startTime) * this.playbackRate)
  }
}
