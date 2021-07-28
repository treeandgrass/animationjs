import { ICommit } from '../types'
import { AnimationElement } from './element'
import { interpolate } from '../utils'
export class DOM implements AnimationElement {
  private target: Element | null = null
  
  constructor (target: Element) {
    this.target = target
  }

  apply (commits: ICommit[]) {
    commits.forEach((commit) => {
      const { interpolation, seek } = commit
      // interpolate(originValue)
      // console.log(seek)
    })
  }
}