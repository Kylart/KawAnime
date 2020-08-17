<template lang="pug">
  v-card.info-container
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

    services(
      :info='info'
    )
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import General from '@/components/info/general.vue'
import Characters from '@/components/info/characters.vue'
import Staff from '@/components/info/staff.vue'
import Episodes from '@/components/info/episodes.vue'
import Services from '@/components/info/services.vue'

export default {
  name: 'Info-Displayer',

  components: {
    General,
    Characters,
    Staff,
    Episodes,
    Services
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
    episodesKey: 0
  }),

  computed: {
    ...mapGetters('info', [ 'getEntryInfo' ]),

    title () {
      return (this.current.anime_title || this.current.title).replace(':', '')
    },
    info () {
      return this.getEntryInfo(this.title, this.current.isLocal) || {}
    }
  }
}
</script>
