export default {
  data: () => ({
    videoHeight: 0
  }),

  mounted () {
    this.setHeight()

    window.addEventListener('resize', this.setHeight)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setHeight)
  },

  methods: {
    getHeight () {
      return document.getElementsByTagName('video')[0].clientHeight
    },
    setHeight () {
      this.videoHeight = this.getHeight()
    },
    getStyle (cue) {
      return {
        [cue.vert]: cue.line + '%',
        left: cue.position + '%',
        transform: `translate(${cue.align}%, 0)${cue.rotate || ''}`,
        'text-align': cue.textAlign,
        'font-size': Math.round(cue.fontSize * this.videoHeight) + 'px'
      }
    }
  }
}
