export default {
  methods: {
    getBounds (groupedCue) {
      const style = this.styles.find(style => style.Name === groupedCue[0].style[0]) || this.styles[0]
      const fontSize = style.Fontsize
      const vSize = Math.round((fontSize / this.info.PlayResY) * 100)
      const start = groupedCue[0].line
      const end = groupedCue.slice(-1)[0].line + vSize

      return {
        start,
        end
      }
    },
    getGroupedActiveCues () {
      const { activeCues } = this

      const groups = {}
      const result = []

      activeCues.forEach((_cue) => {
        const { masterId: key } = _cue

        if (!groups.hasOwnProperty(key)) {
          groups[key] = [_cue]
        } else {
          groups[key].push(_cue)
        }
      })

      this.$_.forEach(groups, (group, key) => {
        result.push(group)
      })

      return result
    },
    isIn (val, ref) {
      const hash = {}

      ref.forEach((_val) => {
        hash.val = 1
      })

      return hash.hasOwnProperty(val)
    },
    fixOverlap (groupedCues, overlaps) {
      overlaps.forEach((overlap) => {
        const top = overlap[0]
        const bottom = overlap[1]

        const topCues = groupedCues[top]
        const bottomCues = groupedCues[bottom]

        // First we need to know by how much we should move the cue.
        // Then whether it should be towards the top or the bottom.
        const topCueBound = this.getBounds(topCues)
        const bottomCueBound = this.getBounds(bottomCues)

        const offset = topCueBound.end - bottomCueBound.start + 1

        let shouldMove = 'top'

        if (topCueBound.start - offset < 2) {
          shouldMove = 'bottom'
        }

        // Finally, we should move the designated cues.
        if (shouldMove === 'top') {
          // Then we should move the top cues towards the top
          topCues.forEach((_cue) => {
            const ind = this.$_.indexOf(this.activeCues, _cue)

            this.activeCues[ind].line -= offset
          })
        } else {
          // Then we should move the bottom cues towards the bottom
          bottomCues.forEach((_cue) => {
            const ind = this.$_.indexOf(this.activeCues, _cue)

            this.activeCues[ind].line += offset
          })
        }
      })
    },
    checkOverlap () {
      let isOverlapping = false
      let overlappingCues = []

      const groupedCues = this.getGroupedActiveCues()

      groupedCues.forEach((group, i) => {
        const masterBounds = this.getBounds(group)

        groupedCues.forEach((subGroup, j) => {
          if (i !== j) {
            const subBounds = this.getBounds(subGroup)

            // Checking if there is overlap.
            // If so, we need to know which one is on top on the other.
            if (this.$_.inRange(masterBounds.start, subBounds.start, subBounds.end + 1)) {
              // That means that master is under sub.
              isOverlapping = true

              if (!this.isIn([i, j], overlappingCues)) {
                overlappingCues.push([j, i])
              }
            } else if (this.$_.inRange(masterBounds.end, subBounds.start, subBounds.end + 1)) {
              // That means that master is on top of slave.
              isOverlapping = true

              if (!this.isIn([j, i], overlappingCues)) {
                overlappingCues.push([i, j])
              }
            }
          }
        })
      })

      overlappingCues = this.$_.uniqBy(overlappingCues, JSON.stringify)

      if (isOverlapping) {
        this.fixOverlap(groupedCues, overlappingCues)
      }

      return isOverlapping
    }
  }
}
