<template lang="pug">
  .actions-container
    v-btn(
      fab,
      color='primary',
      @click='returnCb'
    )
      v-icon chevron_left

    v-speed-dial(
      v-model='show',
      open-on-hover,
      direction='right',
      transition='slide-x-transition'
    )
      template(v-slot:activator)
        v-btn.ml-3#info-actions(
          fab,
          color='primary',
          v-model='show'
        )
          v-icon(v-if='show') close
          v-icon(v-else) account_circle

      template(v-for='_provider in providers')
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-btn(
              fab, small,
              v-on='on',
              @click='addTo(_provider.value)'
            )
              v-icon(v-if='_provider.action') {{ _provider.action }}
              div(v-else, :class="{ 'provider-icon': true, [`${_provider.value}-icon`]: true }")

          span Add to my {{ _provider.text }} list
</template>

<script>
import Info from '@/mixins/info/info.js'

export default {
  name: 'Services',

  mixins: [
    // Brings `info` prop
    Info
  ],

  props: {
    'return-cb': {
      type: Function
    }
  },

  data: () => ({
    show: false,
    exclude: {
      mal: ['kitsu', 'anilist'],
      anilist: ['kitsu', 'mal'],
      kitsu: ['anilist', 'mal']
    }
  }),

  computed: {
    providers () {
      const excludedProviders = this.exclude[this.provider]

      return [
        ...this.$store.state.config.providers
          .filter(({ value }) => !excludedProviders.includes(value)),
        { value: 'local', text: 'Local', action: 'sort_by_alpha' }
      ]
    },
    provider () {
      return this.$store.state.info.modal.overrideProvider || this.$store.state.config.config.infoProvider.info
    }
  },

  methods: {
    addTo (provider) {
      const isLocal = provider === 'local'

      if (isLocal) {
        this.$store.commit('watchLists/setEntry', {
          name: this.info.title.en,
          nbEp: this.info.nbEpisodes || '??'
        })
        this.$store.commit('watchLists/toggleForm', true)
      } else {
        this.$store.commit('services/setFormEntry', {
          service: provider,
          entry: {
            malId: +this.info.malId,
            mediaId: +this.info.id,
            id: +this.info.id,
            title: this.info.title.en,
            nbEp: this.info.nbEpisodes || null
          }
        })
        this.$store.commit('services/showForm', { service: provider, bool: true })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .actions-container
    min-width 150px
    width 25%
    display flex

    position absolute
    top 20px
    left 20px
</style>
