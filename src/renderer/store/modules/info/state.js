import { providers } from '../lists'

export default {
  info: {
    local: {},
    ...providers.reduce(
      (acc, { value: provider }) => ({ ...acc, [provider]: {} }),
      {}
    )
  },
  modal: {
    show: false,
    term: '',
    isRemote: false,
    overrideProvider: false
  }
}
