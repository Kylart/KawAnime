export default {
  data: () => ({
    hover: {
      show: false,
      value: 0,
      image: null,
      video: null,
      init: false,
      thumbnailSrc: '',
      style: {
        height: '100px',
        width: '190px'
      }
    }
  }),

  mounted () {
    this.setVideo()
  },

  methods: {
    onMouseOver (e) {
      const { value, isInsideTrack } = this.parseMouseMove(e)

      if (isInsideTrack) {
        this.hover.show = true
        this.hover.value = value
        this.hover.video.currentTime = (value / 100) * this.hover.video.duration
      } else {
        this.hover.show = false
      }
    },
    onMouseEnter () {
      this.hover.show = true
    },
    onMouseLeave () {
      this.hover.show = false
    },
    genVideoThumbnail () {
      const img = this.$createElement('img', {
        staticClass: 'video-thumb-preview',
        style: this.hover.style,
        attrs: {
          src: this.hover.thumbnailSrc,
          crossOrigin: 'anonymous'
        }
      })

      this.hover.image = img
      return img
    },
    setVideo () {
      this.hover.video = document.createElement('video')
      this.hover.video.setAttribute('crossOrigin', 'anonymous')

      this.hover.video.addEventListener('loadedmetadata', () => {
        if (!this.hover.value) return

        this.hover.video.currentTime = (this.hover.value / 100) * this.hover.video.duration
      })

      this.hover.video.addEventListener('seeked', () => {
        this.hover.show && this.setVideoThumbnail()
      })

      this.hover.video.src = this.$store.state.streaming.player.isTorrent
        ? `http://localhost:${this.$store.state.streaming.player.port}`
        : `file://${this.$store.state.streaming.player.path}`
    },
    setVideoThumbnail (value = this.hover.value) {
      const canvas = document.createElement('canvas')

      canvas.height = this.hover.video.videoHeight
      canvas.width = this.hover.video.videoWidth

      const context = canvas.getContext('2d')

      context.drawImage(this.hover.video, 0, 0, canvas.width, canvas.height)

      this.hover.thumbnailSrc = canvas.toDataURL()
    },
    genVideoThumbnailText () {
      return this.$createElement('div', {
        staticClass: 'video-thumb-text-container'
      }, [
        this.formatLabel(this.hover.value)
      ])
    },
    genHoverThumbContainer () {
      return this.$createElement('div', {
        staticClass: 'video-thumb-container',
        style: {
          transition: this.trackTransition,
          left: this.hover.value + '%',
          bottom: '30px',
          display: this.hover.thumbnailSrc && this.hover.show ? 'block' : 'none'
        }
      }, [
        this.genVideoThumbnail(),
        this.genVideoThumbnailText()
      ])
    }
  }
}
