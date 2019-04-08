export default {
  computed: {
    _lists: {
      get () {
        return this.$store.state.watchLists.lists
      },
      set () {}
    },
    _listNames: {
      get () {
        return this.$store.state.watchLists.listNames.map((list) => list.list)
      },
      set () { }
    }
  },

  methods: {
    _isIn (target) {
      const { name } = this

      return this._lists[target].includes(name)
    },
    async _addTo (target) {
      const { name } = this
      const isIn = this._isIn(target)
      const action = isIn ? 'removeFrom' : 'addTo'

      this.$store.commit(`watchLists/${action}`, {
        listName: target,
        entry: name
      })

      await this.$store.dispatch('watchLists/save')
    }
  }
}
