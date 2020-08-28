export default {
  computed: {
    layout () {
      return {
        on: {
          seek: this.seek,
          timeForward: this.timeForward,
          volume: this.setVolume,
          toggleFullScreen: this.toggleFullScreen,
          togglePlay: this.togglePlay,
          actOnWindow: this.actOnWindow,
          mute: this.toggleMute,
          updateTrack: this.setTrack
          // show: this.layoutShow = true,
          // hide: this.layoutShow = false
        },
        bind: {
          subtitles: this.subtitles,
          audios: this.audios
        }
      }
    }
  }
}
