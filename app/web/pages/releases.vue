<template lang="pug">
  div
    transition-group(name='list', mode='out-in')
      loader(v-if='!instanciate', key='loading')

      entries(v-else-if='instanciate && !current', key='entries')

      info-displayer(v-else-if='instanciate && current', key='current', :current='current', :return-cb='resetCurrent')
</template>

<script>
// Components
import Entries from 'components/feed/entries.vue'
import Loader from 'components/feed/loader.vue'
import InfoDisplayer from 'components/info/layout.vue'

export default {
  name: 'Feed',

  components: { Entries, Loader, InfoDisplayer },

  computed: {
    params: {
      get () {
        return this.$store.state.releases.params
      },
      set () {}
    },
    current: {
      get () {
        return this.$store.state.releases.current
      },
      set () {}
    },
    instanciate: {
      get () {
        return this.$store.state.releases.instanciate
      },
      set () {}
    }
  },

  methods: {
    resetCurrent () {
      this.$store.commit('releases/setCurrent', null)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .fade-enter, .fade-leave-to
    opacity 0

  .fade-enter-active, .fade-leave
    transition all .5s
</style>
