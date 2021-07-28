import { schedule, registry, clearAnimations, animationMap, stop } from './schedule'
import { Animation } from '../animation'
import { KeyframeEffect } from '../animationEffect'
jest.setTimeout(50000)

describe ('run schedule', () => {

  test('schedule', () => {
    schedule()
  })

  test('schedule', async () => {
    const target = document.createElement('div')
    const ae = new  KeyframeEffect(target, [{
      easing: 'ease-in',
      offset: 0,
      transform: 'translate(10px, 20px)',
      opacity: 0.05
    }, {
      easing: 'ease-in',
      offset: 0.1,
      transform: 'translate(10px, 20px)',
      opacity: 0.1
    }, {
      easing: 'ease-in',
      offset: 0.5,
      transform: 'translate(50px, 100px)',
      opacity: 0.3
    }, {
      easing: 'ease-in',
      offset: 0.8,
      transform: 'translate(100px, 200px)',
      opacity: 0.9
    }, {
      easing: 'ease-in',
      offset: 1,
      transform: 'translate(100px, 200px)',
      opacity: 1
    }], {
      duration: 3000,
      fill: 'both' as any,
      iterations: 5,
      easing: 'ease-in-out',
      direction: 'alternate-reverse' as any
    })
    new Animation(ae).play()
  })

  test('stop', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        stop()
        resolve(true)
      }, 1500)
    })
  })

  test('clearAnimations', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        clearAnimations()
        expect(animationMap.size === 0).toBe(true)
        resolve(true)
      }, 1520)
    })
  })
})
