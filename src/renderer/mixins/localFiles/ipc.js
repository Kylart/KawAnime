export default {
  created () {
    this.setHandlers()
  },

  beforeDestroy () {
    this.disableHandlers()
  },

  data: () => ({
    listening: false
  }),

  methods: {
    handleLocalIpc (e, data) {
      const { dir, name, result: info, provider } = data

      if (dir) return

      // Means we don't have that data in local
      if (info === null) return this.updateInfo()

      if (name === this.name) {
        this.$store.commit('info/set', {
          isLocal: true,
          provider,
          name,
          info
        })

        this.setInfo()
        this.disableHandlers()
      }
    },
    handleSearchIpc (e, data) {
      const { name, info, provider } = data

      if (name === this.name) {
        this.$store.commit('info/set', {
          isLocal: true,
          provider,
          name,
          info
        })

        this.$store.dispatch('info/saveLocalInfo', {
          title: name,
          info
        })

        this.setInfo()
        this.disableHandlers()
      }
    },
    handleError (e, data) {
      const { name, msg } = data

      this.$log('Could not retrieve information for', name, msg)
      // TODO: Might be great to add not found template information
    },

    setHandlers () {
      this.$ipc.on(this.$eventsList.search.name.success, this.handleSearchIpc)
      this.$ipc.on(this.$eventsList.search.name.error, this.handleError)

      this.$ipc.on(this.$eventsList.local.get.success, this.handleLocalIpc)
      this.$ipc.on(this.$eventsList.local.get.error, this.handleError)

      this.listening = true
    },
    disableHandlers () {
      if (this.listening) {
        this.$ipc.removeListener(this.$eventsList.search.name.success, this.handleSearchIpc)
        this.$ipc.removeListener(this.$eventsList.search.name.error, this.handleError)

        this.$ipc.removeListener(this.$eventsList.local.get.success, this.handleLocalIpc)
        this.$ipc.removeListener(this.$eventsList.local.get.error, this.handleError)

        this.listening = false
      }
    }
  }
}
