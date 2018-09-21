export default {
  add (state, { key, value }) {
    state.info[key] = value
  },
  addEps (state, { name, data }) {
    state.info[name].episodesInfo = data
  },
  addEpsLinks (state, { name, data }) {
    state.info[name].episodesLinks = data
  }
}
