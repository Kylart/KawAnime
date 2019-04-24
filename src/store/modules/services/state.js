import { providers } from '../lists.js'

export default {
  ...providers.reduce((acc, { value }) => {
    acc[value] = {
      has: false,
      username: null,
      list: null,
      error: null
    }

    return acc
  }, {})
}
