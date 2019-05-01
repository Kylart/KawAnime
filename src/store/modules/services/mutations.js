export default {
  setUser (state, { service, username }) {
    state[service].username = username
  },
  hasUser (state, service) {
    state[service].has = true
  },
  setList (state, { service, list }) {
    state[service].list = list
    state[service].error = null
  },
  setError (state, { service, msg }) {
    state[service].error = msg
  },
  showForm (state, { service, bool }) {
    state[service].form.show = bool
  },
  setFormEntry (state, { service, entry }) {
    state[service].form.entry = entry
  }
}
