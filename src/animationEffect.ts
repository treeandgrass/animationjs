import { IOptionalEffectTiming, IEffectTiming, IComputedEffectTiming } from './types'

export interface AnimationEffect {
  getTiming(): IEffectTiming
  getComputedTiming(): IComputedEffectTiming
  updateTiming (timing: IOptionalEffectTiming): void
}

