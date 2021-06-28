import { Event } from './event/eventTarget'
import { AnimationEffect } from './animationEffect'
import { AnimationTimeline } from './animationTimeline'
import { AnimationPlayState, AnimationReplaceState } from './enum'
import { uuidv4 } from './utils'

export class Animation extends Event {
  public id: string
  effect: AnimationEffect
  timeline: AnimationTimeline;
  private startTime!: number
  private currentTime!: number
  private playbackRate!: number
  private playState!: AnimationPlayState
  private replaceState!: AnimationReplaceState
  private pending!: boolean
  private ready!: Promise<Animation>
  private finished!: Promise<Animation>

  constructor (effect: AnimationEffect, timeline: AnimationTimeline) {
    super()
    this.id = uuidv4()
    this.effect = effect
    this.timeline = timeline
  }

  cancel () {
    //
  }

  finish () {

  }

  play () {

  }

  pause () {

  }

  updatePlaybackRate (playbackRate: number) {
    this.playState = playbackRate
  }

  reverse () {

  }

  persist () {

  }

  commitStyles () {

  }
}
