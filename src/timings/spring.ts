/**
 * https://lists.w3.org/Archives/Public/www-style/2016Jun/0181.html
 * copy from https://webkit.org/demos/spring/spring.js
 */
export class Spring {
  private m_w0: number
  private m_zeta: number
  private m_wd: number
  private m_A: number
  private m_B: number

  constructor (mass: number, stiffness: number, damping: number, initialVelocity: number) {
    this.m_w0 = Math.sqrt(stiffness / mass)
    this.m_zeta = damping / (2 * Math.sqrt(stiffness * mass))

    if (this.m_zeta < 1) {
      this.m_wd = this.m_w0 * Math.sqrt(1 - this.m_zeta * this.m_zeta)
      this.m_A = 1
      this.m_B = (this.m_zeta * this.m_w0 + -initialVelocity) / this.m_wd
    } else {
      this.m_wd = 0
      this.m_A = 1
      this.m_B = -initialVelocity + this.m_w0
    }
  }

  solve (t: number) {
    let cul = 0
    if (this.m_zeta < 1) {
      cul = Math.exp(-t * this.m_zeta * this.m_w0) * (this.m_A * Math.cos(this.m_wd * t) + this.m_B * Math.sin(this.m_wd * t))
    } else {
      cul = (this.m_A + this.m_B * t) * Math.exp(-t * this.m_w0)
    }
    return 1 - cul
  }
}