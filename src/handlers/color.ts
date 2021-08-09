// default color
export const defaultColor = '#FFFFFF'

/**
 * https://www.rapidtables.com/convert/color/hex-to-rgb.html
 */
export const hexToRGBA = (color: string) => {
  if (!color) {
    return [255, 255, 255, 1]
  }
  const startIndex = color.lastIndexOf('#')
  const hex = color.slice(startIndex + 1, startIndex + 7)
  if (hex.length !== 6) {
    throw new Error(`invalid hex color: ${color}`)
  }
  const R = parseInt(hex.slice(0, 2), 16)
  const G = parseInt(hex.slice(2, 4), 16)
  const B = parseInt(hex.slice(4, 6), 16)
  return [R, G, B, 1]
}

/** https://www.rapidtables.com/convert/color/hsl-to-rgb.html */
export const hslToRGBA = (hslColor: string) => {
  const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslColor)
    || /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslColor)
    || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslColor)
  if (!hsl) {
    return [255, 255, 255, 1]
  }
  const h = parseInt(hsl[1], 10)
  const s = parseInt(hsl[2], 10) / 100
  const l = parseInt(hsl[3], 10) / 100
  const A = parseFloat(hsl[4]) || 1

  const C = (1 - Math.abs(2 * l - 1)) * s
  const X = C * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - C / 2

  let R = 0
  let G = 0
  let B = 0
  if (0 <= h && h < 60) {
    R = C
    G = X
    B = 0
  } else if (h >= 60 && h < 120) {
    R = X
    G = C
    B = 0
  } else if (h >= 120 && h < 180) {
    R = 0
    G = C
    B = X
  } else if (h >= 180 && h < 240) {
    R = 0
    G = X
    B = C
  } else if (h >= 240 && h < 300) {
    R = X
    G = 0
    B = C
  } else if (h >= 300 && h < 360) {
    R = C
    G = 0
    B = X
  }

  R = Math.round((R + m) * 255)
  G = Math.round((G + m) * 255)
  B = Math.round((B + m) * 255)
  return [R, G, B, A]
}

export const rgbToRgba = (rgbColor: string) => {
  const rgb = /rgb\((\d+),\s*([\d]+),\s*([\d]+)\)/g.exec(rgbColor)
  return rgb ? [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10), 1] : [255, 255, 255, 1]
}

export const parseRGBA = (color: string) => {
  const rgba = /rgba\((\d+),\s*([\d]+),\s*([\d]+),\s*([\d]+)\)/g.exec(color)
  return rgba ? [parseInt(rgba[1], 10), parseInt(rgba[2], 10), parseInt(rgba[3], 10), parseFloat(rgba[4])]
    : [255, 255, 255, 1]
}

export const toColorString = (rgba: number[]) => {
  return `rgba(${rgba.join(',')})`
}

export const isRGB = (rgb: string) => {
  return /rgb\(/.test(rgb)
}

export const isRGBA = (rgba: string) => {
  return /rgba\(/.test(rgba)
}

export const isHSL = (hsl: string) => {
  return /hsl\(/.test(hsl) || /hsla\(/.test(hsl)
}

export const isHex = (color: string) => {
  return color.includes('#')
}

export const toRGBA = (color: string) => {
  if (isRGB(color)) {
    return rgbToRgba(color)
  } else if (isHSL(color)) {
    return hslToRGBA(color)
  } else if (isHex(color)) {
    return hexToRGBA(color)
  } else if (isRGBA(color)) {
    return parseRGBA(color)
  }
  throw new Error(`not supported color value: ${color}`)
}

export const toRGBAStr = (rgba: number[]) => {
  return `rgba(${rgba.join(',')})`
}
