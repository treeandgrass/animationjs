import { Interpolation, ICommit } from '../types'
import { AnimationElement } from './element'
export class DOM implements AnimationElement {
  private target: Element | null = null
  
  constructor (target: Element) {
    this.target = target
  }

  apply (commit: ICommit[]) {

  }
}