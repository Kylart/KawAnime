<template lang="pug">
  transition-group(name='fade', mode='out-in')
    entries(v-if='!isRefreshing && !current && releases.length', key='entries')

    info-displayer(v-else-if='current', key='current', :current='current', :return-cb='resetCurrent')

    loader(v-else, key='loading')
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
    releases: {
      get () {
        const { fansub, quality, feed } = this.params
        return this.$store.state.releases.releases[feed][fansub][quality]
      },
      set () {}
    },
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
    isRefreshing: {
      get () {
        return this.$store.state.releases.isRefreshing
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
