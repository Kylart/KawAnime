import { mapActions, mapMutations } from 'vuex'

export default {
  beforeDestroy () {
    const { anime_title: refName, episode_number: refEp } = this.parsedName
    const { autoTracking } = this.$store.state.config.config
    const providersAutoTracking = Object.keys(autoTracking).reduce((acc, provider) => {
      return provider === 'local'
        ? acc
        : acc.concat(provider)
    }, [])

    if (!refEp) return

    this.$log(`Setting auto tracking for ${refName} - ${refEp}`)

    autoTracking.local && this.trackLocal(refName, refEp)
    providersAutoTracking.some(Boolean) && this.trackProviders(refName, refEp, providersAutoTracking)
  },

  methods: {
    ...mapActions('watchLists', {
      localMove: 'move',
      localAdd: 'add'
    }),
    ...mapMutations({
      tellUser: 'setInfoSnackbar'
    }),
    trackLocal (refName, refEp) {
      // Finding entries with the same name
      const lists = this.$store.state.watchLists.lists
      const candidates = []

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
        this.localAdd({
          ...entry,
          progress: +refEp
        })

        this.$log(`Updated user local progress for ${refName}.`)

        // If the entry is fully watched, we should move it to seen
        if (entry.list !== 'seen' && entry.nbEp && +refEp === +entry.nbEp) {
          this.$log(`Moving ${entry.name} to \`seen\` list as it reached maximum known episode.`)
          this.tellUser(`${entry.name} completed. Niiice!`)

          this.localMove({ entry, target: 'seen' })
        }
      })
    },
    trackProviders (refName, refEp, providers) {
      providers.forEach((provider) => {
        const { list, isConnected } = this.$store.state.services[provider]

        if (!list || !isConnected) return

        const candidates = list.filter(({ title }) => title === refName)

        if (!candidates.length) return

        const { id, progress } = candidates[0]

        if (progress && +progress >= +refEp) return

        this.$store.dispatch('services/updateList', {
          service: provider,
          args: {
            isEdit: true,
            [provider === 'anilist' ? 'mediaId' : 'id']: id,
            data: { progress: +refEp },
            progress: +refEp
          }
        })

        this.$log(`Updated user's ${provider} progress on ${refName}.`)
      })
    }
  }
}
