import { Animation } from '../../src/animation'
import { KeyframeEffect } from '../../src/animationEffect'

const target = document.getElementById('move') as Element
const ae = new  KeyframeEffect(target, [{
  offset: 0,
  backgroundColor: '#CD5C5C'
}, {
  offset: 0.1,
  backgroundColor: '#F08080'
}, {
  offset: 0.5,
  backgroundColor: '#FA8072'
}, {
  offset: 0.8,
  backgroundColor: '#E9967A'
}, {
  offset: 1,
  backgroundColor: '#FFA07A'
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

