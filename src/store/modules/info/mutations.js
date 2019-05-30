const sanitize = (name) => {
  return name
    .replace(':', '')
}

export default {
  set (state, { key, value }) {
    state.info[sanitize(key)] = value
  },
  addEps (state, { name, data }) {
    const localInfo = state.info[sanitize(`local/${name}`)]
    const globalInfo = state.info[sanitize(name)]

    if (localInfo) state.info[sanitize(`local/${name}`)].episodesInfo = data
    if (globalInfo) state.info[sanitize(name)].episodesInfo = data
  },
  addEpsLinks (state, { name, data }) {
    state.info[name].episodesLinks = data
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
