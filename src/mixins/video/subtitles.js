import { parseSubtitles } from './ass'

export default {
  methods: {
    addSubtitle (data) {
      // this.tracks comes from tracks mixins
      const { trackNumber, subtitle } = data

      if (trackNumber in this.tracks) {
        if (this.isAss) {
          const cue = parseSubtitles(subtitle, this.styles, this.info)
          const isIn = this.tracks[trackNumber].findIndex(({ masterId }) => cue.masterId === masterId) !== -1

          !isIn && this.tracks[trackNumber].push(cue)
        } else {
          const cue = new window.VTTCue(subtitle.time / 1000, (subtitle.time + subtitle.duration) / 1000, subtitle.text)

          this.tracks[trackNumber].addCue(cue)
        }
      }
    }
  }
}
