import { Animation } from '../animation'

let tick = false
let isInLoop = false
const animationMap = new Map<string, Animation>()

export const registry = (animation: Animation) => {
  animationMap.set(animation.id, animation)
}

export const unRegistry = (animation: Animation) => {
  animationMap.delete(animation.id)
}

const runLoop = () => {
  isInLoop = true
  requestAnimationFrame((time: number) => {
    for (let [_key, animation] of animationMap) {
      animation.tick(time)
    }
    if (tick && animationMap.size > 0) {
      runLoop()
    } else {
      isInLoop = false
    }
  })
}

export const schedule = () => {
  if (!isInLoop) {
    tick = true
    runLoop()
  }
}

export const stop = () => {
  tick = false
}

export const clearAnimations = () => {
  animationMap.clear()
}
