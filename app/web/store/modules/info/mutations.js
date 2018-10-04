const sanitize = (name) => {
  return name
    .replace(':', '')
}

export default {
  add (state, { key, value }) {
    state.info[sanitize(key)] = value
  },
  addEps (state, { name, data }) {
    state.info[name].episodesInfo = data
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
  }
}
