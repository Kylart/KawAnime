import { createNamespacedHelpers as namespace } from 'vuex'

const NAMESPACE = 'watchLists'
const { mapActions, mapMutations, mapState } = namespace(NAMESPACE)

export default {
  // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
  actions: mapActions({
    __llAdd: 'add',
    __llMove: 'move',
    __llDelete: 'delete',
    __llGet: 'get',
    __llInfo: 'info'
  }),
  // Brings __llSet, __llForm, __llEntrySet and __llEntryReset
  mutations: mapMutations({
    __llSet: 'set',
    __llForm: 'toggleForm',
    __llEntrySet: 'setEntry',
    __llEntryReset: 'resetEntry'
  }),
  // Brings __llNames
  state: mapState({
    __llNames: 'listNames'
  })
}
