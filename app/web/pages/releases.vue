<template lang="pug">
  v-container(
    grid-list-md, fluid
  )
    transition-group(name='fade', mode='out-in')
      entries(v-if='!current && releases.length', key='entries')

      current(v-else-if='current', key='current')

      loading(v-else, key='loading')
</template>

<script>
// Components
import Entries from 'components/feed/entries.vue'
import Loading from 'components/feed/loading.vue'
import Current from 'components/feed/current.vue'

export default {
  name: 'Feed',

  components: { Entries, Loading, Current },

  computed: {
    releases: {
      get () {
        return this.$store.state.releases.releases
      },
      set () {}
    },
    current: {
      get () {
        return this.$store.state.releases.current
      },
      set () {}
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
