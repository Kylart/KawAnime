import _ from 'lodash'

export default function (cue, style, height) {
  const result = []

  const lines = cue.text.split('\\N')

  if (lines.length === 1) {
    return [cue]
  } else {
    const fontSize = +style.Fontsize
    const vSize = (fontSize / height) * 100
    const offset = Math.round(vSize)

    // This way, overall text is in the same region as originally planned.
    let { line: vAnchor } = cue
    const blockSize = vSize * (lines.length - 1)

    if (vAnchor + blockSize >= 97) {
      vAnchor -= blockSize
    } else if (vAnchor < 0) vAnchor = 0

    lines.forEach((line, i) => {
      const _cue = _.clone(cue)

      _cue.line = Math.round(vAnchor + offset * i)
      _cue.text = line

      // Setting an ID to each subtitle
      _cue.id = `${_cue.start}-${_cue.end}-${_cue.line}-${_cue.position}-${line}`

      result.push(_cue)
    })
  }

  return result
}
