import _ from 'lodash'
import handleTags from './tags.js'
import {alignment as align} from './utils.js'

export default function (subtitle, styles, info) {
  // Following the ass-specs: http://www.cccp-project.net/stuff/ass-specs.pdf
  // Or at this link: http://docs.aegisub.org/3.2/ASS_Tags/
  // Position testing can somewhat be done here : http://ronallo.com/demos/webvtt-cue-settings/
  // WebVTT documentation: https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API
  const { time, duration, text } = subtitle
  let result = new window.VTTCue(time / 1000, (time + duration) / 1000, text)

  const resX = +info.PlayResX
  const resY = +info.PlayResY

  const unitX = resX / 100 // Border between 5 and 95.
  const unitY = resY / 16

  // First we need to set the current subtitle style if any.
  const style = _.filter(styles, (style) => style.Name === subtitle.style)[0] // findStyleByName(subtitle.style, styles)
  const className = style.Name.replace(/\s/g, '_')

  const alignment = +style.Alignment
  const alignmentToPos = align.numpad

  // For position style, need to handle Margin(L|R|V),
  // Alignment, Font-size, Italic, Spacing?, Underline

  // First, Margins
  const mR = +style.MarginR
  const mL = +style.MarginL
  const mV = +style.MarginV

  // Horizontally
  const offsetXR = Math.floor(mR / unitX)
  const offsetXL = Math.floor(mL / unitX)

  const offsetX = offsetXL - offsetXR

  result.position = (alignment < 9 && alignment > 0 && alignmentToPos[alignment][1]) || 'auto'

  if (typeof result.position === 'number') {
    result.position = Math.abs(result.position + offsetX)
  }

  // Vertically. We assume that the file is unicoded.
  const isTop = _.inRange(alignment, 7, 10)
  const isBot = _.inRange(alignment, 1, 4)

  const offsetY = Math.floor(mV / unitY)

  if (isTop) {
    // Distance is taken from the top
    result.line = offsetY
  } else if (isBot) {
    // Distance is taken from the bottom
    result.line = (alignmentToPos[alignment][0] || 16) - offsetY
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
  result = handleTags(text, result)

  // Handle tags might have already added the c tag
  if (result.text.includes('<c')) {
    // Means that that text is like this: <c.<class>>text</c>
    // So we should add the class to the other one
    result.text = `${result.text.slice(0, 2)}.${className}${result.text.slice(2)}`
  } else {
    result.text = `<c.${className}>${result.text}</c>`
  }

  return result
}
