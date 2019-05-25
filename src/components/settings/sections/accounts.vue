<template lang="pug">
  //- We need one card per account type.
  div
    v-card.elevation-12.mb-3
      v-card-title.section-title
        span Accounts configuration
        v-spacer
        import-modal

    template(v-for='website in websites')
      v-card.elevation-12.mb-3
        v-card-title.section-title {{ website.title }}
        v-divider
        v-card-text
          v-container(grid-list-lg, pa-0)
            v-layout(justify-space-around, align-center, pr-2, pl-2)
              template(v-for='input in getInputs(website.service)')
                v-flex
                  template(v-if="input.value === 'password'")
                    v-text-field(
                      clearable,
                      v-model='website.credentials[input.value]',
                      :label='input.text',
                      :append-icon="website.show ? 'visibility_off' : 'visibility'",
                      :type="website.show ? 'text' : 'password'",
                      @click:append='website.show = !website.show'
                    )
                  template(v-else)
                    v-text-field(
                      v-model='website.credentials[input.value]',
                      :label='input.text',
                      clearable
                    )
              v-flex
                v-btn(flat, @click='updateCreds(website)')
                  v-icon save
                  .pl-2 Save
                v-btn(flat, @click='register(website)', v-show='website.mustRegister')
                  v-icon open_in_new
                  .pl-2 Register
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
        isOn: false,
        mustRegoster: false
      }, {
        title: 'Kitsu.io',
        service: 'kitsu',
        credentials: {
          username: this.$store.state.services.kitsu.username || '',
          password: '',
          email: this.$store.state.services.kitsu.email || ''
        },
        show: false,
        isOn: false,
        mustRegister: true
      }, {
        title: 'Anilist',
        service: 'anilist',
        credentials: {
          username: this.$store.state.services.anilist.username || ''
        },
        show: false,
        isOn: false,
        mustRegister: true
      }]
    }
  },

  methods: {
    updateCreds (website) {
      // Setting those credentials for this service
      this.$store.dispatch(`services/set`, website)

      // Instanciating API with those new credentials
      // this.$store.dispatch(`credentials/`, credentials)
    },
    register (website) {
      const url = this.$ipc.sendSync(this.$eventsList.register.code.main, website.service)

      this.$electron.shell.openExternal(url)
    },
    getInputs (service) {
      return this.$store.state.config.providersRequiredProperties[service]
    }
  }
}
</script>
