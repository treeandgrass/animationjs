import { schedule, registry, unRegistry, clearAnimations, animationMap, stop } from './schedule'
import { Animation } from '../animation'
import { UUIdV4 } from '../utils'


describe ('run schedule', () => {
  let times = 0
  class TestAnimation {
  
    public id = UUIdV4()
  
    public _tick (t: number) {
      console.log(`${this.id}_${t}`)
    }
  }
  let size = 11
  let testAnimation1 = new TestAnimation()
  test('registry', () => {
    for (let i = 0; i < size - 1; i++) {
      registry((new TestAnimation()) as Animation)
    }
    registry(testAnimation1 as any)
    expect(animationMap.size === size).toBe(true)
  })

  test ('unRegistry', () => {
    unRegistry(testAnimation1 as Animation)
    expect(animationMap.size === size - 1)
  })

  test('schedule', () => {
    schedule()
  })

  test('schedule', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        schedule()
        resolve(true)
      }, 1000)
    })
  })

  test('schedule', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        schedule()
        resolve(true)
      }, 1000)
    })
  })

  test('stop', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        stop()
        resolve(true)
      }, 1000)
    })
  })

  test('clearAnimations', async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        clearAnimations()
        expect(animationMap.size === 0).toBe(true)
        resolve(true)
      }, 2000)
    })
  })
})
