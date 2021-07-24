import { easeInOut } from './timings/bezierEasing'
import { minMax } from './utils'

export * from './animation'
export * from './effect'

export const play = (id: string) => {
  const duration = 5000
  const value = 300

  const target = document.getElementById(id) as HTMLDivElement
  let current = 0
  let start = 0
  const run = (t: number) => {
    if (!start) start = t
    current = t
    const timing = easeInOut(minMax(current - start, 0, duration) / duration)
    target.style.transform = `translateX(${timing * value}px)`
    if (current - start <= duration) {
      requestAnimationFrame(run)
    } else {
      start = 0
    }
  }
  requestAnimationFrame((t) => {
    run(t)
  })
}
