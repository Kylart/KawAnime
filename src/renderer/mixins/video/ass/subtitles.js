import handleTags from './tags.js'
import { getPosition, getLine, getTextAlign, vbToRGBA } from './utils.js'

export default function (subtitle, styles, info) {
  // Following the ass-specs: http://www.cccp-project.net/stuff/ass-specs.pdf
  // Or at this link: http://docs.aegisub.org/3.2/ASS_Tags/
  const { time, duration, text } = subtitle

  // First we need to set the current subtitle style if any.
  const style = styles.filter((style) => style.Name === subtitle.style)[0] || styles[0]

  let result = {
    start: time / 1000,
    end: (time + duration) / 1000,
    duration,
    text
  }

  result.style = [style.Name.replace(/\s/g, '_')]

  // font-size should be a percentage of the resY value so
  // that it can be changed accordingly.
  result.fontSize = +style.Fontsize / +info.PlayResY

  // Outline and shadow should also use the resY to be displayed.
  result.shadow = {
    thickness: +style.Shadow / +info.PlayResY,
    color: vbToRGBA(style.BackColour)
  }

  result.outline = {
    color: vbToRGBA(style.OutlineColour),
    thickness: +style.Outline / +info.PlayResY
  }

  const { position, width, horiz, align } = getPosition(style, info)
  result.position = position
  result.width = width
  result.horiz = horiz
  result.align = align

  const { line, vert, align: vAlign } = getLine(style, info)
  result.line = line
  result.vert = vert
  result.vAlign = vAlign

  result.textAlign = getTextAlign(style)

  // We handle newline "manually". Hence, there is a need for
  // a masterId as to know which cues are initially the same.
  result.masterId = `${result.start}-${result.end}-${result.line}-${result.position}-${result.text}`
  // result.text = result.text.replace(/\\N/g, '<br>')

  // Style might ask for a rotation, this needs to be set as a key
  // for the cue. It seems the rotation axis is inversed too.
  result.rotate = +style.Angle ? ` rotateZ(${-+style.Angle}deg)` : ''

  // We should handle tags now
  result = handleTags(result, style, info)

  return result
}
