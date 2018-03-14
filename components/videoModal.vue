<template lang="pug">
  v-dialog(v-model='values.show', lazy, absolute, width='initial' @keydown.esc='close()')
    template(v-if='values.show')
      video(ref='video', controls, :src='values.link && `/stream/${values.link.link}`')
      p {{ values.link.name }}
</template>

<script>

export default {
  computed: {
    values () {
      return this.$store.state.videoPlayer.player
    },
    show () {
      return this.values.show
    }
  },
  watch: {
    values (val) {
      if (val.show) {
        if (this.eventSource) { this.eventSource.close() }

        this.eventSource = new EventSource(`/tracks/${val.link.link}`)
        const textTracks = {}

        this.eventSource.addEventListener('tracks', ({ data }) => {
          const tracks = JSON.parse(data)
          tracks.forEach(track => {
            if (track.language) {
              const language = track.language.slice(0, 2)
              textTracks[track.number] = this.$refs.video.addTextTrack('captions', language, language)
            }
          })
        })

        this.eventSource.addEventListener('subtitle', ({ data }) => {
          const { trackNumber, subtitle: { time, duration, text } } = JSON.parse(data)
          if (trackNumber in textTracks) { textTracks[trackNumber].addCue(new VTTCue(time / 1000, (time + duration) / 1000, text.replace(/\\N/g, '\n'))) }
        })
      }
    }
  },
  methods: {
    close () {
      this.eventSource.close()
      this.eventSource = null
      this.$store.commit('videoPlayer/close')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
