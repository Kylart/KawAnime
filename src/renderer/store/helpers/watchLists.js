import createNamespace from './createNamespace'

const PREFIX = '__ll'
const NAMESPACE = 'watchLists'

export default createNamespace(
  NAMESPACE,
  PREFIX,
  {
    // Brings __llAdd, __llMove, __llDelete, __llGet and __llInfo
    actions: [
      'add',
      'move',
      'delete',
      'get',
      'info'
    ],
    // Brings __llSet, __llToggleForm, __llSetEntry and __llResetEntry
    mutations: [
      'set',
      'toggleForm',
      'setEntry',
      'resetEntry'
    ],
    // Brings __llListNames and __llLists
    state: [
      'listNames',
      'lists',
      'form'
    ]
  }
)
