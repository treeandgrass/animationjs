import { UUIdV4 } from './utils'
import { UNRESOLVED } from './constant'
import { Event } from './event/eventTarget'
import {  KeyframeEffect } from './animationEffect'
import { AnimationEffect } from './animationEffect'
import { AnimationPlayState } from './enum'
import { registry, schedule, unRegistry } from './schedule/schedule'

export class Animation extends Event {
  public id: string
  public startTime: number | null = UNRESOLVED
  public  playbackRate: number = 1
  public playState: AnimationPlayState = AnimationPlayState.idle
  public effect: KeyframeEffect
  private currentTime: number = 0

  constructor (effect: AnimationEffect) {
    super()
    this.id = UUIdV4()
    this.effect = effect as KeyframeEffect
  }

  cancel () {
    if (!this.effect) {
      return
    }
    unRegistry(this)
    this.currentTime = 0
    this.playState = AnimationPlayState.idle
  }

  finish () {
    if (this.playState === AnimationPlayState.idle) {
      return
    }
    const timing = this.effect.getComputedTiming()
    this.currentTime = this.playbackRate > 0 ? timing.duration : 0
    this.startTime = timing.duration - this.currentTime
    schedule()
  }

  play () {
    registry(this)
    schedule()
  }

  pause () {
    unRegistry(this)
    this.startTime = UNRESOLVED
    this.playState = AnimationPlayState.paused
  }

  updatePlaybackRate (playbackRate: number) {
    if (this.playbackRate === playbackRate) {
      return
    }
    if (this.playState !== AnimationPlayState.idle && this.playState !== AnimationPlayState.paused) {
      this.playbackRate = playbackRate
      this.play()
    }
  }

  reverse () {
    this.playbackRate = -this.playbackRate
    this.play()
  }

  public _tick (localTime: number) {
    if (this.currentTime === localTime) {
      return
    }
    if (this.playState !== AnimationPlayState.idle && this.playState !== AnimationPlayState.paused) {
      if (this.startTime === UNRESOLVED) {
        this.startTime = localTime - this.currentTime / this.playbackRate
      }
      this.currentTime = (localTime - this.startTime) * this.playbackRate
      if (this.playState === AnimationPlayState.running) {
        this.effect.commit(this.currentTime, this.playbackRate)
      }
    }
  }
}
