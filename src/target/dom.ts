import { ICommit } from '../types'
import { IAnimationElement } from './element'
export class DOM implements IAnimationElement {
  private target: Element | null = null

  constructor (target: Element) {
    this.target = target
  }

  public apply (commits: ICommit[]) {
    commits.forEach((commit) => {
      const { interpolation, seek } = commit
      // interpolate(originValue)
      // console.log(seek)
    })
  }
}
