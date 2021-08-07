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

const target1 = document.getElementById('move1') as Element
const ae1 = new  KeyframeEffect(target1, [{
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
  easing: 'ease-in-out',
  iterations: 1,
  direction: 'alternate' as any
})

const target2 = document.getElementById('move2') as Element
const ae2 = new  KeyframeEffect(target2, [{
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
  easing: 'ease-in',
  iterations: 1,
  direction: 'alternate' as any
})

const an = new Animation(ae)
an.play()
setTimeout(() => {
  an.pause()
}, 3100)

const an1 = new Animation(ae1)
an1.play()
setTimeout(() => {
  an1.pause()
}, 3100)


const an2 = new Animation(ae2)
an2.play()
setTimeout(() => {
  an2.pause()
}, 3100)

