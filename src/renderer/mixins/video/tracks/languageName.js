import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('config', {
      langToName: 'subtitlesLanguages'
    })
  },

  methods: {
    getLangName (track) {
      return track.title || this.langToName[track.lang] || track.lang || `Track #${track.id}`
    }
  }
}
