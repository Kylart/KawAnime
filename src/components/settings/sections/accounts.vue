<template lang="pug">
  //- We need one card per account type.
  div
    v-card.elevation-12.mb-3
      v-card-title.section-title
        span Accounts configuration
        v-spacer
        import-modal

    template(v-for='website in websites')
      v-card.elevation-12.mb-3(:class='{ disabled: website.isOn }')
        v-card-title.section-title {{ website.title }}
        v-divider
        v-card-text
          v-container(grid-list-lg, pa-0)
            v-layout(row, wrap, justify-center, align-center, pr-2, pl-2)
              v-flex(xs12, sm4, md5)
                v-text-field(
                  v-model='website.credentials.username',
                  label='Username',
                  clearable
                )
              v-flex(xs12, sm4, md5)
                v-text-field(
                  v-model='website.credentials.password',
                  label='Password',
                  clearable,
                  :append-icon="website.show ? 'visibility_off' : 'visibility'",
                  :type="website.show ? 'text' : 'password'",
                  @click:append='website.show = !website.show'
                )
              v-flex(xs12, sm4, md2)
                v-btn(flat, @click='updateCreds(website)') Update
        v-card-actions
          v-spacer
          v-layout(column, align-end)
            .conditions If you only need to see you watch lists, only setup your username
            .conditions To remove an account, remove the username and press Update
</template>

<script>
// Components
import ImportModal from '@/components/services/import.vue'

// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Accounts-Section',

  mixins: [ Update ],

  components: { ImportModal },

  data () {
    return {
      websites: [{
        title: 'MyAnimeList.net',
        service: 'mal',
        credentials: {
          username: this.$store.state.services.mal.username || '',
          password: ''
        },
        show: false,
        isOn: false
      }, {
        title: 'Kitsu.io',
        service: 'kitsu',
        credentials: {
          username: this.$store.state.services.kitsu.username || '',
          password: ''
        },
        show: false,
        isOn: false
      }, {
        title: 'Anilist',
        service: 'anilist',
        credentials: {
          username: this.$store.state.services.anilist.username || '',
          password: ''
        },
        show: false,
        isOn: false
      }]
    }
  },

  methods: {
    updateCreds (website) {
      // Setting those credentials for this service
      this.$store.dispatch(`services/set`, website)

      // Instanciating API with those new credentials
      // this.$store.dispatch(`credentials/`, credentials)
    }
  }
}
</script>
