import {  KeyframeEffect } from './animationEffect'
import { CompositeOperation } from './enum'

const target = document.createElement('div')

describe("run KeyframeEffect", () => {
  
  test('case 1: getKeyframes', () => {
    const ae = new  KeyframeEffect(target, {
      color: ['#FFFFFF', '#000000'],
      opacity: [0.1, 0.6, 0.9, 1.0],
      offset: [0, 0.1, 0.5],
      composite: CompositeOperation.REPLACE
    }, {
      duration: 3000
    })
    const keyFrames = ae.getKeyframes()
    console.log(keyFrames)
  })

  test('case2: getKeyframes', () => {
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
      composite: CompositeOperation.REPLACE
    })
    const keyFrames = ae.getKeyframes()
    console.log(keyFrames)
  })
})

