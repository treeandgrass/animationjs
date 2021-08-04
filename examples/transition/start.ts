import { Animation } from '../../src/animation'
import { KeyframeEffect } from '../../src/animationEffect'

const target = document.getElementById('move') as Element
const ae = new  KeyframeEffect(target, [{
  easing: 'ease-in',
  offset: 0,
  transform: 'translate(10px, 20px)'
}, {
  easing: 'ease-in',
  offset: 0.1,
  transform: 'translate(10px, 20px)'
}, {
  easing: 'ease-in',
  offset: 0.5,
  transform: 'translate(50px, 100px)'
}, {
  easing: 'ease-in',
  offset: 0.8,
  transform: 'translate(100px, 200px)'
}, {
  easing: 'ease-in',
  offset: 1,
  transform: 'translate(100px, 200px)'
}], {
  duration: 3000,
  fill: 'both' as any,
  iterations: Infinity,
  easing: 'ease-in-out',
  direction: 'alternate' as any
})

const an = new Animation(ae)
an.play()

setTimeout(() => {
  an.pause()
}, 5000)
