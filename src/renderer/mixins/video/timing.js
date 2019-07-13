import Overlap from './checkOverlap.js'

export default {
  mixins: [ Overlap ],

  data: () => ({
    rawTime: 0,
    activeCues: [],
    index: 0
  }),

  methods: {
    isActive (cue) {
      const { start, end } = cue
      const { rawTime } = this

      return end >= rawTime && start <= rawTime
    },
    updateActiveCues () {
      this.clearActiveCues()
      this.setActiveCues()
    },
    setActiveCues () {
      const { index } = this
      const nbCues = this.cues.length || null
      let hasAdded = false

      for (let i = index > 0 ? index - 1 : index, l = nbCues; i < l; ++i) {
        const _cue = this.cues[i]

        if (this.isActive(_cue)) {
          let isAlreadyIn = this.activeCues.includes(_cue)

          if (!isAlreadyIn) {
            const futureIndex = this.activeCues.length

            this.activeCues.push(_cue)

            if (_cue.hasOwnProperty('show')) {
              // We need to trigger the show property to trigger
              // the transition element's enter.
              this.$nextTick(() => {
                this.activeCues[futureIndex].show = true
              })
            }

            if (!hasAdded) hasAdded = true
          }
        } else {
          if (hasAdded) {
            this.index = i
            break
          }
        }
      }

      // We check overlap once it's over
      this.checkOverlap()
    },
    clearActiveCues () {
      this.activeCues = this.activeCues.filter((_cue) => {
        return this.isActive(_cue)
      })
    }
  }
}
