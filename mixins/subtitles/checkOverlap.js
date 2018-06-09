export default {
  methods: {
    getBounds (cue) {
      const re = /<br>/g
      const nbLines = ((re.test(cue.text) && cue.text.match(re).length) || 0) + 1
      const vSize = cue.fontSize * 100
      const vStart = cue.line
      const vEnd = cue.line + (vSize * nbLines)

      const hStart = cue.position
      const hEnd = cue.position + cue.width

      return {
        vStart,
        vEnd,
        hStart,
        hEnd
      }
    },
    checkInBounds (value, type, bounds) {
      return this.$_.inRange(value, bounds[`${type}Start`], bounds[`${type}End`])
    },
    getOverlappingMode (master, slave) {
      // We define different overlapping mode:
      //   -- 0: No overlap
      //   -- 1: master's left is inside slave's bounds
      //   -- 2: master's right is inside slave's bounds
      //   -- 3: master's top is inside slave's bounds
      //   -- 4: master's bottom is inside slave's bounds
      // A set of those modes can also exist:
      //    e.g: 12: master's top and right are inside slave's bounds
      //
      // It is important to say that overlaps are checked between same
      // "kind" of cues, i.e. between cues that have the same vert or the
      // same horiz properties.
      const shouldCheck = master.vert === slave.vert || master.horiz === slave.horiz

      if (shouldCheck) {
        let overlapMode = ''

        const masterBounds = this.getBounds(master)
        const slaveBounds = this.getBounds(slave)

        // First we shall check horizontal overlap.
        if (this.checkInBounds(masterBounds.hStart, 'h', slaveBounds)) overlapMode += 1
        if (this.checkInBounds(masterBounds.hEnd, 'h', slaveBounds)) overlapMode += 2

        // Then, vertical overlap
        if (this.checkInBounds(masterBounds.vEnd, 'v', slaveBounds)) overlapMode += 3
        if (this.checkInBounds(masterBounds.vStart, 'v', slaveBounds)) overlapMode += 4

        return +overlapMode
      } else {
        return 0
      }
    },
    isIn (val, ref) {
      const hash = {}

      ref.forEach(({ cues: _val }) => {
        hash[_val] = 1
      })

      return hash.hasOwnProperty(val)
    },
    fixOverlap (cues, overlaps) {
      overlaps.forEach(({ mode, cues: indexes }) => {
        const masterIndex = indexes[0]
        const slaveIndex = indexes[1]

        const master = cues[masterIndex]
        const slave = cues[slaveIndex]

        const masterBounds = this.getBounds(master)
        const slaveBounds = this.getBounds(slave)

        // We fix overlaps by moving master according to the mode
        const masterInd = this.$_.indexOf(this.activeCues, master)
        const slaveInd = this.$_.indexOf(this.activeCues, slave)

        if (mode === 13 || mode === 23 || mode === 123 || mode === 134 || mode === 1234) {
          // All that includes top first
          this.activeCues[slaveInd].line = masterBounds.vEnd + 1
        } else if (mode === 14 || mode === 24 || mode === 234) {
          // All that includes bottom first
          this.activeCues[masterInd].line = slaveBounds.vEnd + 1
        }
      })
    },
    checkOverlap () {
      let isOverlapping = false
      let overlaps = []

      const cues = this.activeCues

      cues.forEach((master, i) => {
        cues.forEach((slave, j) => {
          if (i !== j) {
            const overlapMode = this.getOverlappingMode(master, slave)

            if (overlapMode > 4) {
              if (!this.isIn([j, i], overlaps) && !this.isIn([i, j], overlaps)) {
                overlaps.push({
                  mode: overlapMode,
                  cues: [i, j]
                })
              }

              if (!isOverlapping) isOverlapping = true
            }
          }
        })
      })

      if (isOverlapping) {
        this.fixOverlap(cues, overlaps)
      }
    }
  }
}
