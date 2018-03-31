import _ from 'lodash'

export default function (subtitle, styles, info) {
  // Following the ass-specs: http://www.cccp-project.net/stuff/ass-specs.pdf
  // Position testing can somewhat be done here : http://ronallo.com/demos/webvtt-cue-settings/
  // WebVTT documentation: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
  const { time, duration, text } = subtitle
  const result = new window.VTTCue(time / 1000, (time + duration) / 1000, text)

  // const resX = +info.PlayResX
  const resY = +info.PlayResY

  // const unitX = resX / 100 // Border between 5 and 95.
  const unitY = resY / 16

  // First we need to set the current subtitle style if any.
  const style = _.filter(styles, (style) => style.Name === subtitle.style)[0] // findStyleByName(subtitle.style, styles)

  const alignment = +style.Alignment

  const alignmentToPos = {
    1: [16, 2], // Bottom left
    2: [16, 50], // Bottom center
    3: [16, 98], // Bottom right
    4: [8, 2], // Middle left
    5: [8, 50], // Middle center
    6: [8, 98], // Middle right
    7: [0, 2], // Top left
    8: [0, 50], // Top center
    9: [0, 98] // Top right
  }

  // For position style, need to handle Margin(L|R|V),
  // Alignment, Font-size, Italic, Spacing?, Underline

  // First, Margins
  const mR = +style.MarginR
  const mL = +style.MarginL
  const mV = +style.MarginV

  // Horizontally
  if (mR === mL) {
    result.position = 'auto'
  } else {
    result.position = alignmentToPos[alignment][1]
  }

  // Vertical-alignment. We assume that the file is unicoded.
  const isTop = _.inRange(alignment, 7, 10)
  const isBot = _.inRange(alignment, 1, 4)

  const offsetY = Math.trunc(mV / unitY)

  if (isTop) {
    // Distance is taken from the top
    result.line = offsetY
  } else if (isBot) {
    // Distance is taken from the bottom
    result.line = 16 - offsetY
  } else {
    // Should be vertically centered
    result.line = 8
  }

  // Horizontal-alignment. We assume that the file is unicoded.
  const leftAligned = [1, 4, 7]
  const rightAligned = [3, 6, 9]

  result.align = leftAligned.includes(alignment)
    ? 'start'
    : rightAligned.includes(alignment)
      ? 'end'
      : 'center'

  // We should handle tags now
  let string = text

  // Getting those line breaks
  string = string.replace(/\\N/g, '\n')

  // an<pos> tag
  const reAn = /\{\\an[0-9]\}/g

  if (reAn.test(string)) {
    const index = +string.match(reAn)[0][4]

    result.line = alignmentToPos[index][0]
    result.position = alignmentToPos[index][1]

    string = string.replace(reAn, '')
  }

  // fad<in, out> tag
  const reFad = /\{\\fad\([0-9]*,[0-9]*\)\}/
  string = string.replace(reFad, '')

  // if (reFad.test(string)) {
  //   const tag = string.match(reFad)[0]
  //   const fIn = tag.split(',')[0].slice(6)
  //   const fOut = tag.split(',')[1].slice(0, -2)
  // }

  result.text = `<c.${style.Name.replace(/\s/g, '_')}>${string}</c>`

  return result
}
