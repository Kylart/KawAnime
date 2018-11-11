<template lang="pug">
  //- We need one card per account type.
  div
    v-card.elevation-12.mb-3
      v-card-title.section-title Accounts configuration

    template(v-for='website in websites')
      v-card.elevation-12.mb-3
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
          .conditions Erase both fields to remove the account
</template>

<script>
// Mixins
import Update from 'mixins/config/update.js'

export default {
  name: 'Accounts-Section',

  mixins: [ Update ],

  data () {
    const vm = this

    return {
      websites: [{
        title: 'MyAnimeList.net',
        service: 'mal',
        credentials: vm.$store.state.mal.credentials,
        show: false
      }]
    }
  },

  methods: {
    updateCreds (website) {
      // Gotta find the right website in data
      const { credentials, service } = website

      // Setting those credentials for this service
      this.$store.commit(`${service}/setCredentials`, credentials)

      // Instanciating API with those new credentials
      this.$store.dispatch(`${service}/setupAccount`, credentials)
    }
  }
}
</script>
