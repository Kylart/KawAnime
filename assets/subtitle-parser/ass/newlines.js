export default function (cue, style, height) {
  const result = []

  const className = style.Name.replace(/\s/g, '_')
  const lines = cue.text.split('\n')

  if (lines.length === 1) {
    cue.text = `<c.${className}>${cue.text}</c>`
    return [cue]
  } else {
    const fontSize = +style.Fontsize
    const vSize = fontSize / height * 100

    // This way, overall text is in the same region as originally planned.
    let { line: vAnchor } = cue
    vAnchor -= vSize * (lines.length - 1)

    const offset = (vSize + 2 * Math.round(vSize / 100))

    lines.forEach((line, i) => {
      const _cue = new window.VTTCue(cue.startTime, cue.endTime, line)

      _cue.align = cue.align
      _cue.snapToLines = false
      _cue.position = cue.position

      _cue.text = `<c.${className}>${line}</c>`
      _cue.line = Math.round(vAnchor + offset * i)

      result.push(_cue)
    })
  }

  return result
}
