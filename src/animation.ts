import { UUIdV4 } from './utils'
import { UNRESOLVED } from './constant'
import { Event } from './event/eventTarget'
import {  KeyframeEffect } from './animationEffect'
import { AnimationEffect } from './animationEffect'
import { AnimationTimeline } from './animationTimeline'
import { AnimationPlayState, AnimationReplaceState } from './enum'
import { registry, schedule, unRegistry } from './schedule/schedule'

export class Animation extends Event {
  public id: string
  public timeline: AnimationTimeline | null = null;
  public startTime: number | null = UNRESOLVED
  private currentTime: number | null = UNRESOLVED
  public  playbackRate: number = 0
  public playState: AnimationPlayState = AnimationPlayState.idle
  private replaceState!: AnimationReplaceState
  private pending!: boolean
  private ready!: Promise<Animation>
  private finished!: Promise<Animation>
  public effect: KeyframeEffect

  constructor (effect: AnimationEffect, timeline: AnimationTimeline | null) {
    super()
    this.id = UUIdV4()
    this.timeline = timeline
    this.effect = effect as KeyframeEffect
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

  public tick (localTime: number) {
    if (this.timeline && this.timeline.currentTime !== localTime) {
      this.timeline.currentTime = localTime
    }
    if (this.currentTime === localTime) {
      return
    }
    if (this.playState !== AnimationPlayState.idle && this.playState !== AnimationPlayState.paused) {
      if (this.startTime === UNRESOLVED) {
        this.startTime = localTime - (this.currentTime as number) / this.playbackRate
      }
      this.currentTime = (localTime - this.startTime) * this.playbackRate
      if (this.playState === AnimationPlayState.running) {
        this.effect.commit(this.currentTime)
      }
    }
  }

  commitStyles () {

  }
}
