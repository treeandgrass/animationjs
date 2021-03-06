import { UUIdV4 } from './utils'
import { UNRESOLVED } from './constant'
import { Event } from './event/eventTarget'
import {  KeyframeEffect } from './animationEffect'
import { IAnimationEffect } from './animationEffect'
import { AnimationPlayState } from './enum'
import { registry, schedule, unRegistry } from './schedule/schedule'

export class Animation extends Event {
  public id: string
  public startTime: number | null = UNRESOLVED
  public  playbackRate: number = 1
  public playState: AnimationPlayState = AnimationPlayState.idle
  public effect: KeyframeEffect
  private currentTime: number = 0

  constructor (effect: IAnimationEffect) {
    super()
    this.id = UUIdV4()
    this.effect = effect as KeyframeEffect
  }

  public cancel () {
    if (!this.effect) {
      return
    }
    unRegistry(this)
    this.currentTime = 0
    this.playState = AnimationPlayState.idle
  }

  public finish () {
    if (this.playState === AnimationPlayState.idle) {
      return
    }
    const timing = this.effect.getComputedTiming()
    this.currentTime = this.playbackRate > 0 ? timing.duration : 0
    this.startTime = timing.duration - this.currentTime
    schedule()
  }

  public play () {
    registry(this)
    this.playState = AnimationPlayState.running
    schedule()
  }

  public pause () {
    unRegistry(this)
    this.startTime = UNRESOLVED
    this.playState = AnimationPlayState.paused
  }

  public updatePlaybackRate (playbackRate: number) {
    if (this.playbackRate === playbackRate) {
      return
    }
    if (this.playState !== AnimationPlayState.idle && this.playState !== AnimationPlayState.paused) {
      this.playbackRate = playbackRate
      this.play()
    }
  }

  public reverse () {
    this.playbackRate = -this.playbackRate
    this.play()
  }

  public _tick (localTime: number) {
    if (this.currentTime === localTime) {
      return
    }
    const timing = this.effect.getComputedTiming()
    if (this.currentTime > timing.activeDuration) {
      this.finished()
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

  private finished () {
    this.playState = AnimationPlayState.finished
    unRegistry(this)
  }
}
