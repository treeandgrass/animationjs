import { Event } from './event/eventTarget'
import { AnimationEffect } from './animationEffect'
import { AnimationTimeline } from './animationTimeline'
import { registry, schedule, stop, unRegistry } from './schedule/schedule'
import { AnimationPlayState, AnimationReplaceState } from './enum'
import {  KeyframeEffect } from './animationEffect'
import { Interpolation } from './types'
import { UUIdV4 } from './utils'

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

  // https://drafts.csswg.org/web-animations/#calculating-the-active-duration
  private calculateDuration () {
    const timing = this.effect.getTiming()
    if (timing.duration === 0 || timing.iterations === 0) {
      return 0;
    }
    return (timing.duration * timing.iterations) / this.playbackRate
  }

  public tick (time: number) {
    this.timeline.currentTime = time
    if (!this.startTime) {
      this.startTime = time
    }
    this.currentTime = time
  }
}
