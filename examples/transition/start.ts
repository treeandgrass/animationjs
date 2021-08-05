import { Animation } from '../../src/animation'
import { KeyframeEffect } from '../../src/animationEffect'

const target = document.getElementById('move') as Element
const ae = new  KeyframeEffect(target, [{
  offset: 0,
  transform: 'translate(10px, 20px)'
}, {
  offset: 0.1,
  transform: 'translate(20px, 50px)'
}, {
  offset: 0.5,
  transform: 'translate(50px, 100px)'
}, {
  offset: 0.8,
  transform: 'translate(100px, 200px)'
}, {
  offset: 1,
  transform: 'translate(300px, 600px)'
}], {
  duration: 3000,
  fill: 'both' as any,
  iterations: 1,
  direction: 'alternate' as any
})

const an = new Animation(ae)
an.play()
setTimeout(() => {
  an.pause()
}, 3100)

