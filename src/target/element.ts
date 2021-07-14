import { Interpolation, ICommit } from '../types'
export interface AnimationElement {
  apply (commit: ICommit[]): void
}
