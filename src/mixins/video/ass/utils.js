export const alignDir = {
  right: [3, 6, 9],
  left: [1, 4, 7],
  middle: [2, 5, 8],
  top: [7, 8, 9],
  vCenter: [4, 5, 6],
  bottom: [1, 2, 3]
}

export const alignment = {
  ssaToNumpad: {
    1: 1, // Bottom
    2: 2,
    3: 3,
    5: 7, // Middle
    6: 8,
    7: 9,
    9: 4, // Top
    10: 5,
    11: 6
  }
}

export const percent = (value, res) => {
  return Math.round((value / res) * 100)
}

export const vbToRGBA = (vb) => {
  // vb is like &HAABBGGRR
  vb = vb.slice(2)
  const a = 1 - (parseInt(vb.slice(0, 2), 16) / 256)
  const b = parseInt(vb.slice(2, 4), 16)
  const g = parseInt(vb.slice(4, 6), 16)
  const r = parseInt(vb.slice(6, 8), 16)

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const getPosition = (style, info) => {
  // The idea is to reduce the resX / resY rectangle with the margins.
  // Only then, the position can be determined using the numpad alignment.
  const resX = +info.PlayResX
  const alignment = +style.Alignment
  const mR = +style.MarginR
  const mL = +style.MarginL

  const left = percent(mL, resX)
  const right = percent(mR, resX)

  const width = Math.abs(100 - right - left)

  let position
  let horiz = 'left'
  let align = 0

  if ([1, 4, 7].includes(alignment)) {
    position = left
  } else if ([3, 6, 9].includes(alignment)) {
    position = right
    horiz = 'right'
  } else if ([2, 5, 8].includes(alignment)) {
    position = (left + (100 - right)) / 2
    align = -50
  }

  return { position, width, horiz, align }
}

export const getLine = (style, info) => {
  // Following libass rules: https://github.com/libass/libass/wiki/ASSv5-Override-Tags
  const resY = +info.PlayResY
  const alignment_ = +style.Alignment
  const mV = +style.MarginV
  let line = 0
  let vert = 'bottom'
  let align = 0

  const isCenter = alignDir.vCenter.includes(alignment_)

  const offsetY = percent(mV, resY)

  // <vert> is set to top if the subtitle is on the top of the screen
  // so that the origin of the cue in its top. Logical. Also, this
  // way, the text will be properly wrapped inside the screen if it takes
  // more than one line. vert depends on the alignment of the cue.
  // Same thing with bottom. If the alignemnt is a centered one, the origin
  // of the cue should be its middle. To imitate that, we'll use a bottom
  // align and simply translate the cue down by 50%
  if (isCenter) align = 50

  vert = alignDir.top.includes(alignment_) ? 'top' : 'bottom'

  // SSA says that is the cues has a vCenter alignement, it
  // should be centered no matter the MarginV.
  line = isCenter
    ? 50
    : offsetY

  return { line, vert, align }
}

export const getTextAlign = (style) => {
  // Horizontal-alignment. We assume that the file is unicoded.
  const alignment = +style.Alignment

  const textAlign = alignDir.left.includes(alignment)
    ? 'left'
    : alignDir.right.includes(alignment)
      ? 'right'
      : 'center'

  return textAlign
}
