export default {
  mounted () {
    this.$ipc.on(this.$eventsList.register.cta.main, (e, msg) => {
      this.$store.commit('setInfoSnackbar', msg)
    })
  }
}
