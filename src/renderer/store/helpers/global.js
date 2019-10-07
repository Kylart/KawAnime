import createNamespace from './createNamespace'

const PREFIX = '__'
const NAMESPACE = null

export default createNamespace(
  NAMESPACE,
  PREFIX,
  {
    // Brings __Analytics and __CheckOnlineStatus
    actions: [
      'analytics',
      'checkOnlineStatus'
    ],
    // Brings __SetLeftDrawer and __TellUser
    mutations: [
      'setLeftDrawer',
      ['setInfoSnackbar', 'tellUser']
    ],
    // Brings __Drawer, __IsConnected, __Platform and __NODE_ENV
    state: [
      'drawer',
      'isConnected',
      'platform',
      'NODE_ENV'
    ]
  }
)
