import { localLists } from '@/store/helpers'

export default {
  computed: {
    ...localLists.state
  },

  methods: {
    // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
    ...localLists.actions,

    _isIn (target) {
      const { name: targetName } = this

      return this.__llLists[target].findIndex(({ name }) => name === targetName) > -1
    },
    _addTo (target) {
      const { name } = this
      const isIn = this._isIn(target)
      const action = isIn ? 'Delete' : 'Add'

      this[`__ll${action}`]({
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
