<template lang="pug">
  div
    v-container(grid-list-md)
      v-layout(column)
        header

        transition(name='fade', mode='out-in')
          list(v-if='hasCreds || hasList', ref='list', key='list')

          empty(v-else, key='empty')
</template>

<script>
import Header from '@/components/services/header.vue'
import Empty from '@/components/services/empty.vue'
import List from '@/components/services/list.vue'

export default {
  name: 'Services',

  components: { Header, Empty, List },

  mounted () {
    this.$store.dispatch('services/getList', { service: this.provider })
  },

  data: () => ({

  }),

  computed: {
    creds: {
      get () {
        return this.$store.state.services[this.provider]
      },
      set () {}
    },
    provider () {
      return this.$route.params.provider
    },
    hasList () {
      return !!this.creds.lists
    },
    hasCreds () {
      return this.creds.has
    }
  }
}
</script>
