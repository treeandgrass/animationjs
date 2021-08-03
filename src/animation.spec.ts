import { Animation } from './animation'
import { KeyframeEffect } from './animationEffect'

jest.setTimeout(50000)

const target = document.createElement('div')
describe('Animation', () => {
  test('play', async () => {
    //
    const ae = new  KeyframeEffect(target, [{
      easing: 'ease-in',
      offset: 0,
      transform: 'translate(10px, 20px)',
      // opacity: 0.05
    }, {
      easing: 'ease-in',
      offset: 0.1,
      transform: 'translate(20px, 40px)',
      // opacity: 0.1
    }, {
      easing: 'ease-in',
      offset: 0.5,
      transform: 'translate(40px, 80px)',
      // opacity: 0.3
    }, {
      easing: 'ease-in',
      offset: 0.8,
      transform: 'translate(80px, 160px)',
      // opacity: 0.9
    }, {
      easing: 'ease-in',
      offset: 1,
      transform: 'translate(160px, 320px)',
      // opacity: 1
    }], {
      duration: 3000,
      fill: 'both' as any,
      iterations: 5,
      easing: 'ease-in-out',
      direction: 'alternate-reverse' as any
    })
    const an = new Animation(ae)
    await new Promise((resolve) => {
      setTimeout(() => {
        an.play()
      }, 2000)
    })
    an.pause()
  })
})
