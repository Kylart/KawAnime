import { providers } from '../lists.js'

export default {
  ...providers.reduce((acc, { value }) => {
    acc[value] = {
      has: false,
      isConnected: false,
      username: null,
      list: null,
      error: null,
      form: {
        entry: {},
        show: false
      }
    }

    return acc
  }, {})
}
