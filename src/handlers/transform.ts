import { interpolate,  } from '../utils'
import { IValueUnit } from '../types'

export class Transform {
  public static translate (prop: string, origin: IValueUnit, target: IValueUnit, processed: number) {
    if (target.unit !== origin.unit) {
      throw new TypeError(`invalid unit: ${prop} value`)
    }
    if (target.values.length !== origin.values.length) {
      throw new TypeError(`invalid ${prop} value length`)
    }
    const inter: any[] = interpolate(origin.values, target.values, processed)
    const normalizeInter = inter.map((item) => {
      return item + origin.unit
    })
    return `${prop}(${normalizeInter.join(',')})`
  }

  public static scale (prop: string, origin: number | number[], target: number | number[]) {
    //
  }

  public static rotate (prop: string, origin: number | number[], target: number | number[]) {
    //
  }

  public static skew (prop: string, origin: number | number[], target: number | number[]) {
    //
  }
}
