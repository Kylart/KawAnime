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
    for (const service of this.providers) {
      this.creds[service] = this.$ipc.sendSync(this.$eventsList.vault.has.main, service)
    }
  },

  data: () => ({
    creds: {
      mal: false,
      kitsu: false,
      anilist: false
    }
  }),

  computed: {
    providers () {
      return Object.keys(this.creds)
    },
    provider () {
      return this.$route.params.provider
    },
    hasList () {
      return false
    },
    hasCreds () {
      return this.creds[this.provider]
    }
  }
}
</script>
