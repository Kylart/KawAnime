export default {
  computed: {
    overlay: {
      set (val) {
        this.$store.commit('overlay/show', val)
      },
      get () {
        return this.$store.state.overlay.show
      }
    }
  }
}
