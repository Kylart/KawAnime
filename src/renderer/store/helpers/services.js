import { providers } from '../modules/lists'

import createNamespace from './createNamespace'

const PREFIX = '__s'
const NAMESPACE = 'services'

export default createNamespace(
  NAMESPACE,
  PREFIX,
  {
    // Brings __sSet, __sHasUser, __sIsConnected, __sGetList, __sUpdateList
    // and  __sExternal
    actions: [
      'set',
      'hasUser',
      'isConnected',
      'getList',
      'updateList',
      'external'
    ],
    // Brings __sSetUser, __sHasUser, __sSetValue, __sSetConnected, __sSetLoading,
    // __sSetList, __sSetError, __sShowForm and__sSetFormEntry
    mutations: [
      'setUser',
      'hasUser',
      'setValue',
      'setConnected',
      'setLoading',
      'setList',
      'setError',
      'showForm',
      'setFormEntry'
    ],
    // Brings __s<ProviderName>
    state: [
      ...providers.map(({ value }) => value)
    ]
  }
)
