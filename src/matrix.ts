import { ITransform } from './types'

export const length = (v: number[]) => {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
}

export const determinant = (m: number[][]) => {
  return m[0][0] * m[1][1] * m[2][2] +
    m[1][0] * m[2][1] * m[0][2] +
    m[2][0] * m[0][1] * m[1][2] -
    m[0][2] * m[1][1] * m[2][0] -
    m[1][2] * m[2][1] * m[0][0] -
    m[2][2] * m[0][1] * m[1][0]
}

export const inverse = (m: number[][]) => {
  const iDet = 1 / determinant(m)
  const a = m[0][0]
  const b = m[0][1]
  const c = m[0][2]
  const d = m[1][0]
  const e = m[1][1]
  const f = m[1][2]
  const g = m[2][0]
  const h = m[2][1]
  const k = m[2][2]
  const inv = [
    [(e * k - f * h) * iDet, (c * h - b * k) * iDet,
     (b * f - c * e) * iDet, 0],
    [(f * g - d * k) * iDet, (a * k - c * g) * iDet,
     (c * d - a * f) * iDet, 0],
    [(d * h - e * g) * iDet, (g * b - a * h) * iDet,
     (a * e - b * d) * iDet, 0]
  ]
  const lastRow = []
  for (let i = 0; i < 3; i++) {
    let val = 0
    for (let j = 0; j < 3; j++) {
      val += m[3][j] * inv[j][i]
    }
    lastRow.push(val)
  }
  lastRow.push(1)
  inv.push(lastRow)
  return inv
}

export const transposeMatrix4 = (m: number[][]) => {
  return [[m[0][0], m[1][0], m[2][0], m[3][0]],
    [m[0][1], m[1][1], m[2][1], m[3][1]],
    [m[0][2], m[1][2], m[2][2], m[3][2]],
    [m[0][3], m[1][3], m[2][3], m[3][3]]]
}

export const multiplyVecMatrix = (v: number[], m: number[][]) => {
  const result = []
  for (let i = 0; i < 4; i++) {
    let val = 0
    for (let j = 0; j < 4; j++) {
      val += v[j] * m[j][i]
    }
    result.push(val)
  }
  return result
}

const multVecMatrix = (v: number[], m: number[][]) => {
  const result = []
  for (let i = 0; i < 4; i++) {
    let val = 0
    for (let j = 0; j < 4; j++) {
      val += v[j] * m[j][i]
    }
    result.push(val)
  }
  return result
}

export const normalize = (v: number[]) => {
  const len = length(v)
  return [v[0] / len, v[1] / len, v[2] / len]
}

export const combine = (v1: number[], v2: number[], v1s: number, v2s: number) => {
  return [v1s * v1[0] + v2s * v2[0], v1s * v1[1] + v2s * v2[1],
    v1s * v1[2] + v2s * v2[2]]
}

export const cross = (v1: number[], v2: number[]) => {
  return [v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]]
}

export const dot = (v1, v2) => {
  let result = 0
  for (let i = 0; i < v1.length; i++) {
    result += v1[i] * v2[i]
  }
  return result
}

export const multiplyMatrices = (a: number[], b: number[]) => {
  return [
    a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
    a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
    a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
    a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],

    a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
    a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
    a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
    a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],

    a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
    a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
    a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
    a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],

    a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
    a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
    a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
    a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
  ]
}

export const toRadians = (arg) => {
  const rads = arg.rad || 0
  const degs = arg.deg || 0
  const grads = arg.grad || 0
  const turns = arg.turn || 0
  const angle = (degs / 360 + grads / 400 + turns) * (2 * Math.PI) + rads
  return angle
}

export const decomposeMatrix = (matrix: number[]) => {
  const m3d = [
    matrix.slice(0, 4),
    matrix.slice(4, 8),
    matrix.slice(8, 12),
    matrix.slice(12, 16)
  ]

  const perspectiveMatrix = []
  for (let i = 0; i < 4; i++) {
    perspectiveMatrix.push(m3d[i].slice())
  }

  for (let i = 0; i < 3; i++) {
    perspectiveMatrix[i][3] = 0
  }

  if (determinant(perspectiveMatrix) === 0) {
    return null
  }

  const rhs: number[] = []

  let perspective
  if (m3d[0][3] || m3d[1][3] || m3d[2][3]) {
    rhs.push(m3d[0][3])
    rhs.push(m3d[1][3])
    rhs.push(m3d[2][3])
    rhs.push(m3d[3][3])

    const inversePerspectiveMatrix = inverse(perspectiveMatrix)
    const transposedInversePerspectiveMatrix =
        transposeMatrix4(inversePerspectiveMatrix)
    perspective = multVecMatrix(rhs, transposedInversePerspectiveMatrix)
  } else {
    perspective = [0, 0, 0, 1]
  }

  const translate = m3d[3].slice(0, 3)

  const row = []
  row.push(m3d[0].slice(0, 3))
  const scale = []
  scale.push(length(row[0]))
  row[0] = normalize(row[0])

  const skew = []
  row.push(m3d[1].slice(0, 3))
  skew.push(dot(row[0], row[1]))
  row[1] = combine(row[1], row[0], 1.0, -skew[0])

  scale.push(length(row[1]))
  row[1] = normalize(row[1])
  skew[0] /= scale[1]

  row.push(m3d[2].slice(0, 3))
  skew.push(dot(row[0], row[2]))
  row[2] = combine(row[2], row[0], 1.0, -skew[1])
  skew.push(dot(row[1], row[2]))
  row[2] = combine(row[2], row[1], 1.0, -skew[2])

  scale.push(length(row[2]))
  row[2] = normalize(row[2])
  skew[1] /= scale[2]
  skew[2] /= scale[2]

  const pdum3 = cross(row[1], row[2])
  if (dot(row[0], pdum3) < 0) {
    for (let i = 0; i < 3; i++) {
      scale[i] *= -1
      row[i][0] *= -1
      row[i][1] *= -1
      row[i][2] *= -1
    }
  }

  const t = row[0][0] + row[1][1] + row[2][2] + 1
  let s
  let quaternion

  if (t > 1e-4) {
    s = 0.5 / Math.sqrt(t)
    quaternion = [
      (row[2][1] - row[1][2]) * s,
      (row[0][2] - row[2][0]) * s,
      (row[1][0] - row[0][1]) * s,
      0.25 / s
    ]
  } else if (row[0][0] > row[1][1] && row[0][0] > row[2][2]) {
    s = Math.sqrt(1 + row[0][0] - row[1][1] - row[2][2]) * 2.0
    quaternion = [
      0.25 * s,
      (row[0][1] + row[1][0]) / s,
      (row[0][2] + row[2][0]) / s,
      (row[2][1] - row[1][2]) / s
    ]
  } else if (row[1][1] > row[2][2]) {
    s = Math.sqrt(1.0 + row[1][1] - row[0][0] - row[2][2]) * 2.0
    quaternion = [
      (row[0][1] + row[1][0]) / s,
      0.25 * s,
      (row[1][2] + row[2][1]) / s,
      (row[0][2] - row[2][0]) / s
    ]
  } else {
    s = Math.sqrt(1.0 + row[2][2] - row[0][0] - row[1][1]) * 2.0
    quaternion = [
      (row[0][2] + row[2][0]) / s,
      (row[1][2] + row[2][1]) / s,
      0.25 * s,
      (row[1][0] - row[0][1]) / s
    ]
  }

  return [translate, scale, skew, quaternion, perspective]
}

export const convertItemToMatrix = (item: ITransform) => {
  let x = 0
  let y = 0
  let z = 0
  let angle = 0
  switch (item.t) {
    case 'rotatex':
      angle = toRadians(item.d[0])
      return [1, 0, 0, 0,
              0, Math.cos(angle), Math.sin(angle), 0,
              0, -Math.sin(angle), Math.cos(angle), 0,
              0, 0, 0, 1]
    case 'rotatey':
      angle = toRadians(item.d[0])
      return [Math.cos(angle), 0, -Math.sin(angle), 0,
              0, 1, 0, 0,
              Math.sin(angle), 0, Math.cos(angle), 0,
              0, 0, 0, 1]
    case 'rotate':
    case 'rotatez':
      angle = toRadians(item.d[0])
      return [Math.cos(angle), Math.sin(angle), 0, 0,
              -Math.sin(angle), Math.cos(angle), 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'rotate3d':
      x = item.d[0]
      y = item.d[1]
      z = item.d[2]
      angle = toRadians(item.d[3])

      const sqrLength = x * x + y * y + z * z
      if (sqrLength === 0) {
        x = 1
        y = 0
        z = 0
      } else if (sqrLength !== 1) {
        const len = Math.sqrt(sqrLength)
        x /= len
        y /= len
        z /= len
      }

      const s = Math.sin(angle / 2)
      const sc = s * Math.cos(angle / 2)
      const sq = s * s
      return [
        1 - 2 * (y * y + z * z) * sq,
        2 * (x * y * sq + z * sc),
        2 * (x * z * sq - y * sc),
        0,

        2 * (x * y * sq - z * sc),
        1 - 2 * (x * x + z * z) * sq,
        2 * (y * z * sq + x * sc),
        0,

        2 * (x * z * sq + y * sc),
        2 * (y * z * sq - x * sc),
        1 - 2 * (x * x + y * y) * sq,
        0,

        0, 0, 0, 1
      ]
    case 'scale':
      return [item.d[0], 0, 0, 0,
              0, item.d[1], 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'scalex':
      return [item.d[0], 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'scaley':
      return [1, 0, 0, 0,
              0, item.d[0], 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'scalez':
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, item.d[0], 0,
              0, 0, 0, 1]
    case 'scale3d':
      return [item.d[0], 0, 0, 0,
              0, item.d[1], 0, 0,
              0, 0, item.d[2], 0,
              0, 0, 0, 1]
    case 'skew':
      const xAngle = toRadians(item.d[0])
      const yAngle = toRadians(item.d[1])
      return [1, Math.tan(yAngle), 0, 0,
              Math.tan(xAngle), 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'skewx':
      angle = toRadians(item.d[0])
      return [1, 0, 0, 0,
              Math.tan(angle), 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'skewy':
      angle = toRadians(item.d[0])
      return [1, Math.tan(angle), 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1]
    case 'translate':
      x = item.d[0].px || 0
      y = item.d[1].px || 0
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              x, y, 0, 1]
    case 'translatex':
      x = item.d[0].px || 0
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              x, 0, 0, 1]
    case 'translatey':
      y = item.d[0].px || 0
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, y, 0, 1]
    case 'translatez':
      z = item.d[0].px || 0
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, z, 1]
    case 'translate3d':
      x = item.d[0].px || 0
      y = item.d[1].px || 0
      z = item.d[2].px || 0
      return [1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              x, y, z, 1]
    case 'perspective':
      const p = item.d[0].px ? (-1 / item.d[0].px) : 0
      return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, p,
        0, 0, 0, 1]
    case 'matrix':
      return [item.d[0], item.d[1], 0, 0,
              item.d[2], item.d[3], 0, 0,
              0, 0, 1, 0,
              item.d[4], item.d[5], 0, 1]
    case 'matrix3d':
      return item.d
    default:
      break
  }
}

export const convertToMatrix = (transformList: ITransform[]) => {
  if (transformList.length === 0) {
    return [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]
  }
  return transformList.map(convertItemToMatrix).reduce(multiplyMatrices)
}

export const makeMatrixDecomposition = (transformList) => {
  return [decomposeMatrix(convertToMatrix(transformList))]
}

export const multiply = (a: number[][], b: number[][]) => {
  const result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += b[i][k] * a[k][j]
      }
    }
  }
  return result
}

export const is2D = (m: number[][]) => {
  return (
      m[0][2] === 0 &&
      m[0][3] === 0 &&
      m[1][2] === 0 &&
      m[1][3] === 0 &&
      m[2][0] === 0 &&
      m[2][1] === 0 &&
      m[2][2] === 1 &&
      m[2][3] === 0 &&
      m[3][2] === 0 &&
      m[3][3] === 1)
}

export const composeMatrix = (translate: number[], scale: number[], skew, quat: number[], perspective: number[]) => {
  let matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

  for (let i = 0; i < 4; i++) {
    matrix[i][3] = perspective[i]
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      matrix[3][i] += translate[j] * matrix[j][i]
    }
  }

  const x = quat[0]
  const y = quat[1]
  const z = quat[2]
  const w = quat[3]

  const rotMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]

  rotMatrix[0][0] = 1 - 2 * (y * y + z * z)
  rotMatrix[0][1] = 2 * (x * y - z * w)
  rotMatrix[0][2] = 2 * (x * z + y * w)
  rotMatrix[1][0] = 2 * (x * y + z * w)
  rotMatrix[1][1] = 1 - 2 * (x * x + z * z)
  rotMatrix[1][2] = 2 * (y * z - x * w)
  rotMatrix[2][0] = 2 * (x * z - y * w)
  rotMatrix[2][1] = 2 * (y * z + x * w)
  rotMatrix[2][2] = 1 - 2 * (x * x + y * y)

  matrix = multiply(matrix, rotMatrix)

  const temp = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]
  if (skew[2]) {
    temp[2][1] = skew[2]
    matrix = multiply(matrix, temp)
  }

  if (skew[1]) {
    temp[2][1] = 0
    temp[2][0] = skew[0]
    matrix = multiply(matrix, temp)
  }

  if (skew[0]) {
    temp[2][0] = 0
    temp[1][0] = skew[0]
    matrix = multiply(matrix, temp)
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      matrix[i][j] *= scale[i]
    }
  }

  if (is2D(matrix)) {
    return [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[3][0], matrix[3][1]]
  }
  return matrix[0].concat(matrix[1], matrix[2], matrix[3])
}

export const clamp = (x: number, min: number, max: number) => {
  return Math.max(Math.min(x, max), min)
}

export const makeQuat = (fromQ, toQ, f) => {
  let product = dot(fromQ, toQ)
  product = clamp(product, -1.0, 1.0)

  let quat = []
  if (product === 1.0) {
    quat = fromQ
  } else {
    const theta = Math.acos(product)
    const w = Math.sin(f * theta) * 1 / Math.sqrt(1 - product * product)

    for (let i = 0; i < 4; i++) {
      quat.push(fromQ[i] * (Math.cos(f * theta) - product * w) +
                toQ[i] * w)
    }
  }
  return quat
}
