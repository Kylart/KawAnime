<template lang="pug">
  //- We just need a refresh and add button, tag research and name research fields
  v-container(grid-list-xl, pa-0)
    v-layout(justify-space-around, align-center)
      .provider-name {{ providerName }}
      v-flex(
        xs12, sm6, md4,
        v-show='hasTags'
      )
        v-combobox(
          multiple, small-chips, deletable-chips,
          label='Tags',
          v-model='selectedTags',
          :items='availableTags',
          persistent-hint,
          hint='Filter by tags'
        )

      v-flex(xs12, sm6, md4)
        v-text-field(
          label='Search',
          v-model='term',
          clearable,
          persistent-hint,
          hint='Looking for something?'
        )

      v-flex(xs12, sm4, md3)
        v-btn(icon, large, @click='refresh')
          v-icon(large) refresh

        import-modal

        v-btn(icon, large, color='indigo', @click='add', v-show='canAdd')
          v-icon(large) add
</template>

<script>
import ImportModal from '@/components/services/import.vue'

export default {
  name: 'Service-Header',

  components: { ImportModal },

  props: ['provider', 'hasTags', 'list'],

  data: () => ({
    selectedTags: [],
    searchTerm: ''
  }),

  computed: {
    providerName () {
      return this.$store.state.config.providers.find(({ value }) => value === this.provider).text
    },
    canAdd () {
      return this.$store.state.services[this.provider].isConnected
    },
    availableTags () {
      if (!this.hasTags || !this.list || !this.list.length) return []

      return this.list
        .reduce((acc, { tags }) => [ ...acc, ...tags.split(', ') ], [])
        .filter(({ tag }, index, arr) => !arr.includes(tag))
        .filter(Boolean)
        .sort()
    },
    term: {
      get () {
        return this.searchTerm
      },
      set (val) {
        this.searchTerm = val
        this.$emit('term', this.searchTerm)
      }
    }
  },

  methods: {
    add () {
      this.$store.commit('services/showForm', { service: this.provider, bool: true })
    },
    refresh () {
      this.$store.dispatch('services/getList', { service: this.provider })
    }
  },

  watch: {
    selectedTags (val) {
      this.$emit('tags', this.selectedTags)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .provider-name
    font-size 24px
    font-weight 300
    letter-spacing 0.03em
    padding 0 24px 0 0
</style>
