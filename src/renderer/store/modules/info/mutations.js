const sanitize = (name) => {
  return name
    .replace(':', '')
}

export default {
  set (state, { name, provider, isLocal, info }) {
    state.info[isLocal ? 'local' : provider][sanitize(name)] = info
  },
  addEps (state, { name, data }) {
    const _name = sanitize(name)

    Object.keys(state.info).forEach((key) => {
      const hasInfo = Object.prototype.hasOwnProperty.call(state.info[key], _name)

      if (hasInfo) state.info[key][_name].episodesInfo = data
    })
  },
  addEpsLinks (state, { name, data }) {
    const _name = sanitize(name)

    Object.keys(state.info).forEach((key) => {
      const hasInfo = Object.prototype.hasOwnProperty.call(state.info[key], _name)

      if (hasInfo) state.info[key][_name].episodesLinks = data
    })
  },
  showModal (state, bool) {
    state.modal.show = bool
  },
  setTerm (state, value) {
    state.modal.term = value
  },
  setRemote (state, bool) {
    state.modal.isRemote = bool
  },
  overrideProvider (state, provider) {
    state.modal.overrideProvider = provider
  }
}
