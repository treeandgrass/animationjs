import { schedule, registry, clearAnimations, animationMap, stop } from './schedule'
import { Animation } from '../animation'
import { KeyframeEffect } from '../animationEffect'


describe ('run schedule', () => {

  test('schedule', () => {
    schedule()
  })

  test('schedule', async () => {
    const target = document.createElement('div')
    const ae = new  KeyframeEffect(target, [{
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
    }], {
      duration: 3000,
      easing: 'ease-in-out'
    })
    new Animation(ae).play()
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 3000)
    })
  })

  test('stop', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        stop()
        resolve(true)
      }, 3030)
    })
  })

  test('clearAnimations', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        clearAnimations()
        expect(animationMap.size === 0).toBe(true)
        resolve(true)
      }, 3500)
    })
  })
})
