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
      this.$refs.cuesContainer.setBounds()
    }
  }
}
