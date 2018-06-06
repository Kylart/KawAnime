import handleTags from './tags.js'
import handleStyle from './getStyle.js'
import { getPosition, getLine, getAlign } from './utils.js'

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

  result.position = getPosition(style, info)
  const { line, vert } = getLine(style, info)
  result.line = line
  result.vert = vert

  const align = getAlign(style)
  result.align = align.align
  result.textAlign = align.textAlign

  // We handle newline "manually". Hence, there is a need for
  // a masterId as to know which cues are initially the same.
  result.masterId = `${result.start}-${result.end}-${result.line}-${result.position}-${result.text}`
  result.text = result.text.replace(/\\N/g, '<br>')

  // We should handle tags now
  result = handleTags(result, info)

  // Style is set on each cue
  result = handleStyle(result)

  return result
}
