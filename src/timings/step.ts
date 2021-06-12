import { minMax } from '../utils'

export const steps = (step = 10) => (t: number) => Math.ceil(minMax(t, 0.000001, 1)) * step * (1 / step)
