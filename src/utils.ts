import { IFromWithTo } from './types'

export const minMax = (target: number, min: number, max: number) => Math.min(Math.max(target, min), max)

export const maxMin = (target: number, min: number, max: number) => Math.max(Math.min(target, min), max)
/**
 * uuid
 * @returns
 */
export const UUIdV4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
  const r = Math.random() * 16 | 0
  const v = c === 'x' ? r : (r & 0x3 | 0x8)
  return v.toString(16)
})

export const isNull = (value: any) => {
  return value === '' || value === null || value === undefined
}

export const isObject = (value: any) => {
  return value !== null && typeof value === 'object'
}

export const interpolate = (from: IFromWithTo, to: IFromWithTo, processed: number): any | never => {
  if (typeof from === 'number' && typeof to === 'number') {
    return from + (to - from) * processed
  } else if (typeof from === 'boolean' && typeof to === 'boolean') {
    return processed >= 0.5 ? to : from
  }

  const m = []
  if (Array.isArray(from) && Array.isArray(to) && from.length === to.length) {
    for (let i = 0; i < from.length; i++) {
      m.push(interpolate(from[i], to[i], processed))
    }
    return m
  }
  throw new Error('Incorrect interpolation parameters')
}
