export default {
  computed: {
    parsedName () {
      const parts = this.videoTitle.split(' - ')

      return {
        name: parts[0],
        ep: parts[1]
      }
    }
  },

  beforeDestroy () {
    // Finding entries with the same name
    const lists = this.$store.state.watchLists.lists
    const candidates = []
    const { name: refName, ep: refEp } = this.parsedName

    Object.keys(lists).forEach((listName) => {
      const list = lists[listName]
      const _candidates = list.filter(({ name }) => name === refName)

      _candidates.forEach((c) => candidates.push(c))
    })

    // If there is no candidate, let's just leave it be
    if (!candidates.length) return

    candidates.forEach((entry) => {
      // The user might be rewatching an episode, we should check if he's seen more first
      const isRewatch = +entry.progress > refEp

      if (isRewatch) return

      // Updating progress accordingly
      this.$store.dispatch('watchLists/add', {
        ...entry,
        progress: +refEp
      })

      this.$log(`Updated user progress for ${refName}.`)
    })
  }
}
