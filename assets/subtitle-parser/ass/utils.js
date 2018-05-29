import _ from 'lodash'

export const alignDir = {
  right: [3, 6, 9],
  left: [1, 4, 7]
}

export const alignment = {
  numpad: {
    1: [96, 2], // Bottom left
    2: [96, 50], // Bottom center
    3: [96, 98], // Bottom right
    4: [50, 2], // Middle left
    5: [50, 50], // Middle center
    6: [50, 98], // Middle right
    7: [4, 2], // Top left
    8: [4, 50], // Top center
    9: [4, 98] // Top right
  },
  ssa: {
    1: [96, 2], // Bottom left
    2: [96, 50], // Bottom center
    3: [96, 98], // Bottom right
    5: [4, 2], // Top left
    6: [4, 50], // Top center
    7: [4, 98], // Top right
    9: [50, 2], // Middle left
    10: [50, 50], // Middle center
    11: [50, 98] // Middle right
  }
}

const percent = (value, res) => {
  return Math.round((value / res) * 100)
}

export const getPosition = (style, info) => {
  // The idea is to reduce the resX / resY rectangle with the margins.
  // Only then, the position can be determined using the numpad alignment.
  const resX = +info.PlayResX
  const alignment = +style.Alignment
  const mR = +style.MarginR
  const mL = +style.MarginL

  // Position 0 is left and Position 100 is right.
  const left = percent(mL, resX)
  const right = 100 - percent(mR, resX)

  let result

  if ([1, 4, 7].includes(alignment)) {
    result = left
  } else if ([3, 6, 9].includes(alignment)) {
    result = right
  } else if ([2, 5, 8].includes(alignment)) {
    result = (left + right) / 2
  }

  return result
}

export const getLine = (style, info) => {
  // Following libass rules: https://github.com/libass/libass/wiki/ASSv5-Override-Tags
  const resY = +info.PlayResY
  const alignment_ = +style.Alignment
  const mV = +style.MarginV
  let result = 0

  const isTop = _.inRange(alignment_, 7, 10)
  const isBot = _.inRange(alignment_, 1, 4)

  const offsetY = percent(mV, resY)

  if (isTop) {
    // Distance is taken from the top
    result = offsetY
  } else if (isBot) {
    // Distance is taken from the bottom
    result = (alignment.numpad[alignment_][0] || 100) - offsetY
  } else {
    // Should be vertically centered
    result = 50
  }

  return result
}

export const getAlign = (style) => {
  // Horizontal-alignment. We assume that the file is unicoded.
  const alignment = +style.Alignment

  const align = alignDir.left.includes(alignment)
    ? -0
    : alignDir.right.includes(alignment)
      ? -100
      : -50

  const textAlign = alignDir.left.includes(alignment)
    ? 'left'
    : alignDir.right.includes(alignment)
      ? 'right'
      : 'center'

  return { align, textAlign }
}
