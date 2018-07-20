<template lang="pug">
  v-dialog(v-model='configModal', fullscreen, transition='scale-transition', :overlay='false')
    v-btn(icon, slot='activator')
      v-icon settings
    v-card.white--text.main
      v-toolbar.mablue.tb(fixed dark)
        v-btn(icon, @click='configModal = false', dark)
          v-icon close
        v-toolbar-title.headline Settings
        v-spacer
        v-toolbar-items
          v-btn(dark, flat, @click='save()') Save

      v-container.container(fluid)
        v-layout(row, wrap, justify-center)
          v-flex.pb-4(xs11)
            v-card
              v-card-title#download.headline
                | Download
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs6) Preferred fansub
                v-flex.section-title(xs6) Quality
                v-flex(xs5)
                  v-select(
                    v-bind:items='fansubChoices',
                    v-model='config.fansub',
                    hint='The fansub you want to check first!',
                    persistent-hint,
                    dark,
                    item-value='text'
                  )
                v-flex(xs1)
                v-flex(xs5)
                  v-radio-group(:isMantatory="true", row, v-model="config.quality")
                    template(v-for='radio in radios')
                      v-radio(
                        color='orange'
                        :label='radio',
                        :value='radio'
                      )
            v-card.section
              v-card-title#local.headline Local
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs4) Preferred local path
                v-flex.local-path(xs6) {{ config.localPath }}
                v-flex(xs2)
                  v-btn(accent, @click="changePath()") Choose
                v-flex.section-title(xs3) News
                v-flex(xs9)
                  v-switch(
                    :label="config.inside ? 'Inside' : 'Outside'",
                    color='primary',
                    v-model='config.inside',
                    dark,
                    persistent-hint,
                    hint='Deactivate to open the news in your browser.'
                  )
                v-flex(xs10)
                  v-divider
                v-flex.text-xs-left.section-title(xs3) MyAnimeList
                v-flex(xs9)
                  v-layout.pr-5(justify-space-between)
                    v-flex(xs4)
                      v-text-field(
                        label='Username',
                        persistent-hint,
                        hint='Your MyAnimeList username',
                        v-model='config.malUsername'
                      )
                    v-flex(xs4)
                      v-text-field(
                        label='Password',
                        persistent-hint,
                        hint='Your MyAnimeList password',
                        v-model='mal.password',
                        :append-icon="!mal.isVisible ? 'visibility' : 'visibility_off'",
                        @click:append="() => (mal.isVisible = !mal.isVisible)",
                        :type="!mal.isVisible ? 'password' : 'text'"
                      )
                    v-flex.pt-2(xs2)
                      v-btn(flat, @click="malRegister") Save
            v-card.section
              v-card-title#local.headline Video
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs3) Player
                v-flex(xs9)
                  v-switch(
                    :label="config.video.inside ? 'Inside' : 'Outside'",
                    color='primary',
                    v-model='config.video.inside',
                    dark,
                    persistent-hint,
                    hint='Activate to use the KawAnime in-app video player!'
                  )
                v-flex.section-title(xs4) Streaming quality
                v-flex(xs8)
                  v-radio-group(:isMantatory="true", row, v-model="config.video.quality")
                    template(v-for='radio in radios')
                      v-radio(
                        color='orange'
                        :label='radio',
                        :value='radio'
                      )
                v-flex(xs4, offset-xs1)
                  v-select(
                    v-bind:items='subtitlesLanguages',
                    v-model='config.video.preferredLanguage',
                    hint='What should the language of the sutitles be?',
                    persistent-hint,
                    dark,
                    item-text='text',
                    item-value='value'
                  )
                v-flex(xs3, offset-xs1)
                  v-switch(
                    :label="config.video.autoplay ? 'Yes' : 'No'",
                    color='primary',
                    v-model='config.video.autoplay',
                    dark,
                    persistent-hint,
                    hint='Do you want the video to run instantly?'
                  )
                v-flex(xs3)
                  v-switch(
                    :label="config.video.fullscreen ? 'Yes' : 'No'",
                    color='primary',
                    v-model='config.video.fullscreen',
                    dark,
                    persistent-hint,
                    hint="Should KawAnime's be fullscreen by default?"
                  )
            v-card.section
              v-card-title#local.headline Notification
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs12) Sound
                v-flex(xs4)
                  v-select(
                    v-bind:items='soundChoices',
                    v-model='config.sound',
                    hint='The sound you want KawAnime to use when notifying you!',
                    persistent-hint,
                    dark,
                    item-value='text'
                  )
                v-flex(xs5)
                  v-btn(icon large @click="play()")
                    v-icon(large) play_circle_outline
            v-card.section
              v-card-title#system.headline System
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs3) Auto-start
                v-flex(xs3)
                  v-switch(
                    label='Enable',
                    color='primary',
                    dark,
                    v-model='config.system.autoStart',
                    persistent-hint,
                    hint='Launch KawAnime on system start?'
                  )
                v-flex.section-title(xs3) Tray icon
                v-flex(xs3)
                  v-switch(
                    label='Enable',
                    color='primary',
                    dark,
                    v-model='config.system.toTray',
                    persistent-hint,
                    hint='Launch KawAnime with tray icon'
                  )
</template>

<script>
export default {
  data () {
    return {
      configModal: false,
      radios: ['480p', '720p', '1080p'],
      mal: {
        password: '',
        isVisible: false
      }
    }
  },
  computed: {
    config: {
      get () {
        return this.$store.state.config.config
      },
      set (val) {
        this.$store.commit('config/set', val)
      }
    },
    fansubChoices () {
      return this.$store.state.config.fansubs
    },
    soundChoices () {
      return this.$store.state.config.sounds
    },
    subtitlesLanguages () {
      return this.$store.state.config.subtitlesLanguages
    }
  },
  methods: {
    changePath () {
      this.$store.dispatch('config/changeDir')
    },
    save () {
      this.$store.commit('config/set', this.config)
      this.$store.dispatch('config/save')
      this.$store.dispatch('player/setUp')
      this.configModal = false
    },
    play () {
      this.$store.dispatch('player/testSound')
    },
    async malRegister () {
      if (this.mal.password && this.config.malUsername) {
        await this.$store.dispatch('mal/setupAccount', {
          username: this.config.malUsername,
          password: this.mal.password
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tb
    top 24px

  .container
    padding-top calc(24px + 48px)

  .section
    margin-top 20px

  .section-title
    padding-left 20px
    margin-top 15px
    font-size 22px
    font-weight 300

  .local-path
    margin-top 15px
    font-size 18px
    font-weight 200
    text-align center
</style>
