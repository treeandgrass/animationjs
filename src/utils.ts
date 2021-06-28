export const minMax = (target: number, min: number, max: number) => Math.min(Math.max(target, min), max)
/**
 * uuid
 * @returns
 */
export const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
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