<template lang="pug">
  v-container(fluid, pt-0)
    transition(name='fade', mode='out-in')
      template(v-if='hasCreds || hasList')
        .d-flex.flex-column(key='list')
          tools(
            :provider='provider',
            :hasTags='hasTags',
            :list='creds.list',
            @tags='setTags',
            @term='setTerm'
          )

          list(
            ref='list',
            :hasTags='hasTags',
            :tags='search.tags',
            :term='search.term',
            :list='creds.list',
            :provider='provider'
          )

      empty(v-else, key='empty')
</template>

<script>
import Tools from '@/components/services/header.vue'
import Empty from '@/components/services/empty.vue'
import List from '@/components/services/list.vue'

export default {
  name: 'Services',

  components: { Tools, Empty, List },

  data: () => ({
    providerHasTags: ['mal'],
    search: {
      term: '',
      tags: []
    }
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
    hasTags () {
      return this.providerHasTags.includes(this.provider)
    },
    hasCreds () {
      return this.creds.has
    }
  },

  methods: {
    setTags (arr) {
      this.search.tags = arr
    },
    setTerm (term) {
      this.search.term = term
    }
  }
}
</script>
