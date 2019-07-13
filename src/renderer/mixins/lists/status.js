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
      const { name: targetName } = this

      return this._lists[target].findIndex(({ name }) => name === targetName) > -1
    },
    _addTo (target) {
      const { name } = this
      const isIn = this._isIn(target)
      const action = isIn ? 'delete' : 'add'

      this.$store.dispatch(`watchLists/${action}`, {
        list: target,
        name,
        progress: 0,
        score: null,
        tags: [],
        note: ''
      })
    }
  }
}
