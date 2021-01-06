export default {
  mounted () {
    document.addEventListener('paste', this.handlePaste)
  },

  beforeDestroy () {
    document.removeEventListener('paste', this.handlePaste)
  },

  computed: {
    isClientPage () {
      return this.$route.path === '/torrenting'
    }
  },

  methods: {
    /**
     * @param {ClipboardEvent} e
     */
    handlePaste (e) {
      const text = e.clipboardData.getData('text')

      if (e.target.tagName.toUpperCase() === 'INPUT') return

      if (/magnet:\?/.test(text)) {
        if (!this.isClientPage) {
          e.preventDefault()

          this.$store.dispatch('streaming/play', {
            link: text,
            isTorrent: true,
            name: null,
            neighbours: null
          })
        }
      }
    }
  }
}
