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
          v-container.pa-0
            v-row.px-2(justify='space-around', align='center')
              template(v-for='input in getInputs(website.service)')
                v-col
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

            v-row.pr-2(justify='end', align='center')
              v-btn(text, @click='updateCreds(website)')
                v-icon save
                .pl-2 Save
              template(v-if='website.mustSignIn')
                v-btn(text, @click='signIn(website)')
                  v-icon subdirectory_arrow_left
                  .pl-2 Log In
              template(v-if='website.mustRegister')
                v-btn(text, @click='register(website)')
                  v-icon open_in_new
                  .pl-2 Register
              div(v-show='website.canAuth', @click='saveTracking(website.service)')
                v-switch(
                  :label="autoTracking[website.service] ? 'Enabled' : 'Disabled'",
                  persistent-hint,
                  hint='Enable auto tracking?'
                  v-model='autoTracking[website.service]'
                )

        v-card-actions
          v-spacer

          div
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

  mixins: [Update],

  components: { ImportModal },

  data () {
    return {
      autoTracking: this.$store.state.config.config.autoTracking,
      websites: [{
        title: 'MyAnimeList.net',
        service: 'mal',
        credentials: {
          username: this.$store.state.services.mal.username || ''
          // password: ''
        },
        show: false,
        mustSignIn: false,
        canAuth: false
      }, {
        title: 'Kitsu.io',
        service: 'kitsu',
        credentials: {
          username: this.$store.state.services.kitsu.username || '',
          password: '',
          email: this.$store.state.services.kitsu.email || ''
        },
        show: false,
        mustSignIn: true,
        canAuth: true
      }, {
        title: 'Anilist',
        service: 'anilist',
        credentials: {
          username: this.$store.state.services.anilist.username || ''
        },
        show: false,
        mustRegister: true,
        canAuth: true
      }]
    }
  },

  methods: {
    saveTracking (service) {
      this.$nextTick(() => {
        this.setDeepValue(`autoTracking.${service}`, this.autoTracking[service])
      })
    },
    updateCreds (website) {
      // Setting those credentials for this service
      this.$store.dispatch('services/set', website)
      this.$store.dispatch('services/getList', { service: website.service })
    },
    register (website) {
      const url = this.$ipc.sendSync(this.$eventsList.register.code.main, website.service)

      this.$electron.shell.openExternal(url)
    },
    signIn (website) {
      const success = (e, { service }) => {
        this.$store.commit('setInfoSnackbar', 'Successfully logged in.')
        this.$store.dispatch('services/getList', { service: website.service })

        this.$ipc.removeListener(this.$eventsList.register.token.success, success)
      }

      const error = (e, { service }) => {
        this.$store.commit('setInfoSnackbar', 'Log in failed.')

        this.$ipc.removeListener(this.$eventsList.register.token.error, error)
      }

      const { service, credentials } = website

      this.$ipc.on(this.$eventsList.register.token.success, success)
      this.$ipc.on(this.$eventsList.register.token.error, error)
      this.$ipc.send(this.$eventsList.register.token.main, { service, ...credentials })
    },
    getInputs (service) {
      return this.$store.state.config.providersRequiredProperties[service]
    }
  }
}
</script>
