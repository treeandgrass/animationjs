import { anime } from '../../src'

const target = document.getElementById('move') as Element
const an =  anime(target, [{
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
const an1 = anime(target1, [{
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
const an2 = anime(target2, [{
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


setTimeout(() => {
  an.pause()
}, 3100)

setTimeout(() => {
  an1.pause()
}, 3100)


setTimeout(() => {
  an2.pause()
}, 3100)

