import { hexToRGBA, hslToRGBA, toColorString, rgbToRgba, parseRGBA, toRGBA } from './color'

describe('color convert', () => {
  test('hexToRGBA', () => {
    expect(toColorString(hexToRGBA('#000000'))).toBe('rgba(0,0,0,1)')
    expect(toColorString(hexToRGBA('#FFFFFF'))).toBe('rgba(255,255,255,1)')
    expect(toColorString(hexToRGBA('#FF0000'))).toBe('rgba(255,0,0,1)')
    expect(toColorString(hexToRGBA('#808000'))).toBe('rgba(128,128,0,1)')
    expect(toColorString(hexToRGBA('#008080'))).toBe('rgba(0,128,128,1)')
  })

  test('hslToRGBA', () => {
    expect(toColorString(hslToRGBA('hsl(0,0%,0%)'))).toBe('rgba(0,0,0,1)')
    expect(toColorString(hslToRGBA('hsl(0,0%,100%, 0.5)'))).toBe('rgba(255,255,255,0.5)')
    expect(toColorString(hslToRGBA('hsl(0,100%,50%,0.3)'))).toBe('rgba(255,0,0,0.3)')
    expect(toColorString(hslToRGBA('hsl(60,100%,25%, 1)'))).toBe('rgba(128,128,0,1)')
    expect(toColorString(hslToRGBA('hsl(180,100%,25%)'))).toBe('rgba(0,128,128,1)')
  })

  test('rgbToRgba', () => {
    expect(toColorString(rgbToRgba('rgb(255, 222, 1)'))).toBe('rgba(255,222,1,1)')
  })

  test('parseRGBA', () => {
    expect(toRGBA('rgba(255,222,1,0.2)')).toBe([255, 222, 1, 0.2])
  })
})

