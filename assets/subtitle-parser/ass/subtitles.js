import _ from 'lodash'
import handleTags from './tags.js'
import { alignment as align } from './utils.js'

const percent = (value, res) => {
  return Math.round((value / res) * 100)
}

const getPosition = (alignment, mR, mL, width) => {
  // Following libass rules: https://github.com/libass/libass/wiki/ASSv5-Override-Tags
  let result = 0

  if ([1, 4, 7].includes(alignment)) {
    result = mL
  } else if ([2, 5, 8].includes(alignment)) {
    result = (width / 2) + mL - mR
  } else if ([3, 6, 9].includes(alignment)) {
    result = width - mR
  } else {
    result = 'auto'
  }

  if (typeof result === 'number') {
    return percent(result, width)
  }

  return result
}

const getLine = (alignment, mV, unitY, height) => {
  // Following libass rules: https://github.com/libass/libass/wiki/ASSv5-Override-Tags
  let result = 0

  const isTop = _.inRange(alignment, 7, 10)
  const isBot = _.inRange(alignment, 1, 4)

  const offsetY = Math.round(mV / unitY)

  if (isTop) {
    // Distance is taken from the top
    result = offsetY
  } else if (isBot) {
    // Distance is taken from the bottom
    result = (align.numpad[alignment][0] || 16) - offsetY
  } else {
    // Should be vertically centered
    result = 8
  }

  return result
}

export default function (subtitle, styles, info) {
  // Following the ass-specs: http://www.cccp-project.net/stuff/ass-specs.pdf
  // Or at this link: http://docs.aegisub.org/3.2/ASS_Tags/
  // Position testing can somewhat be done here : http://ronallo.com/demos/webvtt-cue-settings/
  // WebVTT documentation: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
  const { time, duration, text } = subtitle
  let result = new window.VTTCue(time / 1000, (time + duration) / 1000, text)

  const resX = +info.PlayResX
  const resY = +info.PlayResY

  const unitY = resY / 16

  // First we need to set the current subtitle style if any.
  const style = _.filter(styles, (style) => style.Name === subtitle.style)[0] // findStyleByName(subtitle.style, styles)
  const className = style.Name.replace(/\s/g, '_')

  const alignment = +style.Alignment

  // First, Margins
  const mR = +style.MarginR
  const mL = +style.MarginL
  const mV = +style.MarginV

  // Horizontally
  result.position = getPosition(alignment, mR, mL, resX)
  result.line = getLine(alignment, mV, unitY, resY)

  // Horizontal-alignment. We assume that the file is unicoded.
  const leftAligned = [1, 4, 7]
  const rightAligned = [3, 6, 9]

  result.align = leftAligned.includes(alignment)
    ? 'start'
    : rightAligned.includes(alignment)
      ? 'end'
      : 'center'

  // We should handle tags now
  result = handleTags(text, result)

  result.text = `<c.${className}>${result.text}</c>`

  return result
}
