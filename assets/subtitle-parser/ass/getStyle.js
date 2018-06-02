export default function (cues) {
  cues.forEach((_cue) => {
    _cue.getStyle = function () {
      return {
        top: this.line + '%',
        left: this.position + '%',
        transform: `translate(${this.align}%, 0)${this.rotate || ''}`,
        'text-align': this.textAlign
      }
    }
  })

  return cues
}
