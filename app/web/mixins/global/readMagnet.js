export default {
  mounted () {
    document.addEventListener('paste', this.handlePaste)
  },

  beforeDestroy () {
    document.removeEventListener('paste', this.handlePaste)
  },

  methods: {
    handlePaste (e) {
      const text = e.clipboardData.getData('text')

      if (/magnet:\?/.test(text)) {
        e.preventDefault()

        this.$store.commit('streaming/play', {
          show: true,
          link: {
            link: text
          }
        })
      }
    }
  }
}
