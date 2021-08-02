import { Animation } from '../animation'

let tick = false
let isInLoop = false
export const animationMap = new Map<string, Animation>()

const runLoop = () => {
  isInLoop = true
  requestAnimationFrame((time: number) => {
    for (const [key, animation] of animationMap) {
      try {
        animation._tick(time)
      } catch (e) {
        //
      }
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

export const registry = (animation: Animation) => {
  if (!animationMap.has(animation.id)) {
    animationMap.set(animation.id, animation)
  }
}

export const unRegistry = (animation: Animation) => {
  animationMap.delete(animation.id)
}

