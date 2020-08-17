<template lang="pug">
  v-card
    v-container.pa-0(fluid)
      general(
        :info='info'
      )

      v-tabs(v-model='tab')
        v-tab Characters
        v-tab Staff
        v-tab Episodes

      v-tabs-items(v-model='tab')
        v-tab-item
          characters(
            :info='info'
          )
        v-tab-item
          staff(
            :info='info'
          )
        v-tab-item
          episodes(
            :info='info',
            :current='current',
            :title='title',
            :key='episodesKey',
            @refresh='episodesKey += 1'
          )

      //- Return button
      v-btn(
        color='primary',
        fixed, fab
        bottom, right,
        @click='returnCb'
      )
        v-icon chevron_left
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import General from '@/components/info/general.vue'
import Characters from '@/components/info/characters.vue'
import Staff from '@/components/info/staff.vue'
import Episodes from '@/components/info/episodes.vue'

export default {
  name: 'Info-Displayer',

  components: {
    General,
    Characters,
    Staff,
    Episodes
  },

  props: {
    current: {
      type: Object,
      required: true
    },
    'return-cb': {
      type: Function
    }
  },

  data: () => ({
    tab: null,
    episodesKey: 0,

    actions: {
      show: false,
      exclude: {
        mal: [ 'kitsu', 'anilist' ],
        anilist: [ 'kitsu', 'mal' ],
        kitsu: [ 'anilist', 'mal' ]
      }
    }
  }),

  computed: {
    ...mapGetters('info', [ 'getEntryInfo' ]),

    title () {
      return (this.current.anime_title || this.current.title).replace(':', '')
    },
    info () {
      return this.getEntryInfo(this.title, this.current.isLocal) || {}
    },

    providers () {
      const excludedProviders = this.actions.exclude[this.provider]

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

</style>
