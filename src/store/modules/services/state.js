import { providers } from '../lists.js'

export default {
  ...providers.reduce((acc, { value }) => {
    acc[value] = {
      has: false,
      isConnected: false,
      isLoading: false,
      username: null,
      email: null,
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
