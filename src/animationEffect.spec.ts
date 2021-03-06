import {  KeyframeEffect } from './animationEffect'

const target = document.createElement('div')

describe("run KeyframeEffect", () => {
  test('case2: getKeyframes', () => {
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
    const keyFrames = ae.getKeyframes()
    console.log((ae as any).makeInterpolations(keyFrames))
  })
})

