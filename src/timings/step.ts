const Start = 1
const Middle = 0.5
const End = 0

export const step = (count: number, pos: number) => {
  const jump = (x: number) => {
    if (x >= 1) {
      return 1
    }
    const stepSize = 1 / count
    x += pos * stepSize
    return x - (x % stepSize)
  }
  return jump
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
 */
export const stepStart = step(1, Start)
export const stepMiddle = step(1, Middle)
export const stepEnd = step(1, End)
