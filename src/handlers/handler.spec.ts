import { parseValueAndUnit } from './unit'
import { PropertyHandler } from './handler'

describe('PropertyHandle', () => {
  const origin = 'translate(50px, 80px) scale(0.4, 0.8)'
  const target = 'translate(80px, 110px) scale(0.8, 1.2)'

  test ('transform', () => {
    const interFunc = PropertyHandler.transform(origin, target)
    console.log(interFunc(0.5))
  })
})
