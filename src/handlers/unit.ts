import { IValueUnit } from '../types'

const units = ['px', '%', 'turn', 'rem', 'deg']

export const parseValueAndUnit = (value: string = '', delimiter: string = ',') => {
  const parsed: IValueUnit = {
    unit: '',
    values: []
  }
  value.split(delimiter).forEach((item: string) => {
    const unit = units.find((u) => item.includes(u)) || ''
    if (!parsed.unit) {
      parsed.unit = unit
    } else {
      if (parsed.unit !== unit) {
        throw new TypeError(`invalid unit: ${value}`)
      }
    }
    parsed.values.push(item)
  })
  return parsed
}
