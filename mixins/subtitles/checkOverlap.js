export default {
  computed: {
    groupedActiveCues () {
      const { activeCues } = this

      const result = {}

      activeCues.forEach((_cue) => {
        const { masterId: key } = _cue

        if (!result.hasOwnProperty(key)) {
          result[key] = [_cue]
        } else {
          result[key].push(_cue)
        }
      })

      return result
    }
  },

  methods: {
    checkOverlap () {
      // const { activeCues, groupedCues, info: { resY } } = this
    }
  }
}
