import { Event } from './event/eventTarget'
import { AnimationEffect } from './animationEffect'
import { AnimationTimeline } from './animationTimeline'
import { AnimationPlayState, AnimationReplaceState } from './enum'
export class Animation extends Event {
  public id: string
  effect: AnimationEffect
  timeline: AnimationTimeline;
  startTime: number
  currentTime: number
  playbackRate: number
  playState: AnimationPlayState
  replaceState: AnimationReplaceState
  pending: boolean
  ready: Promise<Animation>
  finished: Promise<Animation> 
  

  constructor(effect: AnimationEffect, timeline: AnimationTimeline) {
    super()
    this.effect = effect
    this.timeline = timeline
  }

  cancel () {

  }

  finish () {

  }

  play () {

  }

  pause () {

  }

  updatePlaybackRate (playbackRate: number) {

  }


  reverse() {

  }

  persist() {

  }

  commitStyles() {

  }
}