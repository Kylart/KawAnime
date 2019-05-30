export default {
  getEntryInfo (state, getters, rootState) {
    return (name, isLocal = false) => {
      const provider = state.overrideProvider || rootState.config.config.infoProvider.info
      const key = name

      return state.info[isLocal ? 'local' : provider][key]
    }
  }
}
