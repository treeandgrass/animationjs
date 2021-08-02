import { parseValueAndUnit } from './unit'
import { Transform } from './transform'

describe('parseValueAndUnit', () => {
  const origin = parseValueAndUnit('56px, 66px')
  const target = parseValueAndUnit('86px, 96px')
  test('unit', () => {
    expect(origin.unit).toBe('px')
  })

  test('values', () => {
    expect(JSON.stringify(origin.values)).toBe(JSON.stringify([56, 66]))
  })

  test('Transform.translate', () => {
    expect(Transform.translate('translate', origin, target, 0.5)).toBe('translate(71px,81px)')
  })
})
