/**
 * Let's instore some rule...
 * 0. Plan to watch list
 * 1. Watching list
 * 2. Seen list
 * 3. On hold list
 * 4. Dropped list
 */

export default {
  data: () => ({
    providerNames: ['mal', 'anilist', 'kitsu'],
    localListsStatus: {
      0: 'watchList',
      1: 'watching',
      2: 'seen',
      3: 'dropped',
      4: 'onHold'
    },
    malListsStatus: {
      0: 'Plan to watch',
      1: 'Watching',
      2: 'Completed',
      3: 'Dropped',
      4: 'On Hold'
    },
    kitsuListsStatus: {
      0: 'Planned',
      1: 'Current',
      2: 'Completed',
      3: 'Dropped',
      4: 'On Hold'
    },
    anilistListsStatus: {
      0: 'Planning',
      1: 'Current',
      2: 'Completed',
      3: 'Dropped',
      4: 'Paused'
    }
  }),

  computed: {
    localLists: {
      get () {
        const original = this.$store.state.watchLists.lists

        return Object.keys(original).reduce((acc, listName) => {
          const list = original[listName]

          list.forEach((entry) => acc.push({ ...entry, status: entry.list || listName }))

          return acc
        }, [])
      },
      set () {}
    }
  },

  methods: {
    getList (value) {
      return [
        ...this.localLists.filter(({ status }) => status === this.localListsStatus[value]),

        ...this.providerNames.reduce((acc, provider) => {
          return acc.concat(
            (this.$store.state.services[provider].list || [])
              .filter(({ status }) => status === this[`${provider}ListsStatus`][value])
          )
        }, [])
      ]
    }
  }
}
