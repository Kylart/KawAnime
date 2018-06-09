export default {
  data: () => ({
    videoHeight: 0,
    cuesContainerStyle: {}
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
      this.setCuesContainerSize()
    },
    getStyle (cue) {
      return {
        [cue.vert]: cue.line + '%',
        [cue.horiz]: cue.position + '%',
        transform: `translate(${cue.align}%, 0)${cue.rotate || ''}`,
        width: cue.width + '%',
        'text-align': cue.textAlign,
        // We reduce the size a bit so that it's not too big on the screen :<
        'font-size': Math.round(0.70 * cue.fontSize * this.videoHeight) + 'px'
      }
    },
    setCuesContainerSize () {
      const video = document.getElementsByTagName('video')[0]
      const { videoWidth, videoHeight, offsetWidth, offsetHeight } = video

      const result = {
        width: null,
        height: null
      }

      // Ratio of the video's intrisic dimensions
      const videoRatio = videoWidth / videoHeight

      // The ratio of the element's width to its height
      const elementRatio = offsetWidth / offsetHeight

      if (elementRatio > videoRatio) {
        // If the video element is short and wide
        result.width = offsetHeight * videoRatio
        result.height = offsetHeight
      } else {
        // It must be tall and thin, or exactly equal to the original ratio
        result.height = offsetWidth / videoRatio
        result.width = offsetWidth
      }

      this.cuesContainerStyle = {
        width: result.width + 'px',
        height: result.height + 'px'
      }
    }
  }
}
