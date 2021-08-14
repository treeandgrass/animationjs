import { calculateDirectedProcessFromLocalTime } from './progress'
import { FillMode, PlaybackDirection } from '../enum'

describe('Process', () => {
  test('ru', () => {
    var timing = {
      activeDuration: 23323620.42678302,
    currentIteration: 0,
    delay: 0,
    direction: "reverse",
    duration: 23323.62042678302,
    easing: "linear",
    endDelay: 0,
    endTime: 0,
    fill: "auto",
    iterationStart: 0,
    iterations: 1000,
    localTime: null,
    progress: 0.23998392606203217,
    
    }
    console.log(calculateDirectedProcessFromLocalTime(0, 1, timing as any))
  })
})