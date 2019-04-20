import { providers } from '../lists.js'

export default {
  ...providers.map(({ value }) => ({
    [value]: {
      username: '',
      password: ''
    }
  }))
}
