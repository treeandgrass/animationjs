import { IValueUnit } from '../types'

const units = ['px', '%', 'turn', 'rem']

export const parseValueAndUnit = (value: string = '') => {
  const parsed: IValueUnit = {
    unit: '',
    values: []
  }
  value.split(',').forEach((item: string) => {
    const unit = units.find((u) => item.includes(u)) || ''
    if (!parsed.unit) {
      parsed.unit = unit
    } else {
      if (parsed.unit !== unit) {
        throw new TypeError(`invalid unit: ${value}`)
      }
    }
    parsed.values.push(parseFloat(item))
  })
  return parsed
}