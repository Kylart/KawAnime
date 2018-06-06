export default function (cue) {
  cue.getStyle = function () {
    return {
      [cue.vert]: this.line + '%',
      left: this.position + '%',
      transform: `translate(${this.align}%, 0)${this.rotate || ''}`,
      'text-align': this.textAlign
    }
  }

  return cue
}
