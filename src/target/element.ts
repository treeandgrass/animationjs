import { ICommit } from '../types'
export interface IAnimationElement {
  apply (commit: ICommit[]): void
}
