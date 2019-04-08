export default {
  computed: {
    config: {
      get () {
        return this.$store.state.config.config
      },
      set () { }
    }
  },

  methods: {
    setValue (key, value) {
      const config = { ...this.config }

      config[key] = value

      this.save(config)
    },
    setDeepValue (keyString, value) {
      const config = { ...this.config }

      this.$_.set(config, keyString, value)

      this.save(config)
    },
    save (conf) {
      this.$store.commit('config/set', conf)
      this.$store.dispatch('config/save')
    }
  }
}
