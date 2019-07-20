export default {
  data: () => ({
    el: 'app',
    canEnter: true,
    videoExtension: ['mkv', 'mp4', 'avi'],
    torrentExtension: ['torrent']
  }),

  computed: {
    overlay: {
      set (val) {
        this.$store.commit('overlay/show', val)
      },
      get () {
        return this.$store.state.overlay.show
      }
    }
  },

  mounted () {
    const elem = document.getElementById(this.el)

    elem.ondragenter = this.onDragEnter
    elem.ondragleave = this.onDragLeave
    elem.ondragover = this.onDragOver
    elem.ondrop = this.onDrop
  },

  methods: {
    isValidFile (ext) {
      ext = ext.toLowerCase()
      return this.torrentExtension.includes(ext) || this.videoExtension.includes(ext)
    },
    showOverlay (bool) {
      this.overlay = bool

      if (!bool) this.canEnter = true
    },
    onDragEnter (e) {
      if (this.canEnter) {
        this.showOverlay(true)
      }
    },
    onDragLeave (e) {
      const { screenX, screenY, clientX, clientY } = e

      if (screenX === 0 && screenY === 0 && clientX === 0 && clientY === 0) {
        this.showOverlay(false)
      }
    },
    onDragOver (e) {
      e.preventDefault()
    },
    onDrop (e) {
      e.preventDefault()
      e.stopPropagation()

      const { dataTransfer: { files: [file = {}] } } = e
      const { name: fullName = '', path = '' } = file

      const fileExtension = path.split('.').slice(-1)[0]

      if (this.isValidFile(fileExtension)) {
        const { anime_title: title, episode_number: ep } = this.$ipc.sendSync(this.$eventsList.parse.main, fullName)

        this.$store.dispatch('streaming/play', {
          link: path,
          isTorrent: this.torrentExtension.includes(fileExtension),
          name: `${title} - ${+ep}`,
          neighbours: null
        })
      }

      this.showOverlay(false)
    }
  }
}
