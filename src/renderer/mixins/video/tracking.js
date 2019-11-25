import { localLists, services, global } from '@/store/helpers'

export default {
  beforeDestroy () {
    const { name: refName, ep: refEp } = this.parsedName
    const { autoTracking } = this.$store.state.config.config
    const providersAutoTracking = Object.keys(autoTracking).reduce((acc, provider) => {
      return provider === 'local'
        ? acc
        : acc.concat(provider)
    }, [])

    this.$log(`Setting auto tracking for ${refName} - ${refEp}`)

    autoTracking.local && this.trackLocal(refName, refEp)
    providersAutoTracking.some(Boolean) && this.trackProviders(refName, refEp, providersAutoTracking)
  },

  computed: {
    // Brings __llListNames and __llLists
    ...localLists.state,
    parsedName () {
      const parts = this.videoTitle.split(' - ')

      return {
        name: parts[0],
        ep: parts[1]
      }
    }
  },

  methods: {
    // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
    ...localLists.actions,
    // Brings __sSet, __sHasUser, __sIsConnected, __sGetList, __sUpdateList and  __sExternal
    ...services.actions,
    // Brings __SetLeftDrawer and __TellUser
    ...global.mutations,
    trackLocal (refName, refEp) {
      // Finding entries with the same name
      const lists = this.__llLists
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
        this.__llAdd({
          ...entry,
          progress: +refEp
        })

        this.$log(`Updated user local progress for ${refName}.`)

        // If the entry is fully watched, we should move it to seen
        if (entry.nbEp && +refEp === +entry.nbEp) {
          this.$log(`Moving ${entry.name} to \`seen\` list as it reached maximum known episode.`)
          this.__TellUser(`${entry.name} completed. Niiice!`)

          this.__llMove({ entry, target: 'seen' })
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

        this.__sUpdateList({
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
