import { ICommit, DomType, IObj } from '../types'
import { IAnimationElement } from './element'

export class DOM implements IAnimationElement {
  private target: Element | null = null

  constructor (target: Element) {
    this.target = target
  }

  public apply (commits: ICommit[]) {
    const applyStyle: IObj = {}
    commits.forEach((commit) => {
      const { interpolation, seek } = commit
      const { interpolate, prop } = interpolation
      const propValue = interpolate(seek)
      applyStyle[prop] = propValue
    })
    if (this.target) {
      const dom = this.target as HTMLElement
      Object.assign(dom.style, applyStyle)
    }
  }
}
