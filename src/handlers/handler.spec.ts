import { parseValueAndUnit } from './unit'
import { PropertyHandler } from './handler'

describe('PropertyHandle', () => {
  test ('px', () => {
    const origin = 'translate(50px, 80px) scale(0.4, 0.8)'
    const target = 'translate(80px, 110px) scale(0.8, 1.2)'
    const interFunc = PropertyHandler.transform(origin, target)
    expect(interFunc(0.5)).toBe('translate(65px,95px) scale(0.600000,1)')
  })

  test ('%', () => {
    const origin = 'translate(50%, 80%) skewY(30deg)'
    const target = 'translate(80%, 110%) skewY(-180deg)'
    const interFunc = PropertyHandler.transform(origin, target)
    expect(interFunc(0.5)).toBe('translate(65%,95%) skewY(-75deg)')
  })
})
