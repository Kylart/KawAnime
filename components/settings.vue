<template lang="pug">
  v-dialog(v-model='configModal', fullscreen, transition='config', :overlay='false')
    v-btn(icon, slot='activator')
      v-icon settings
    v-card.white--text.main
      v-toolbar.mablue.tb(fixed dark)
        v-btn(icon, @click='configModal = false', dark)
          v-icon close
        v-toolbar-title.headline Settings
        v-spacer
        v-toolbar-items
          v-btn(dark, flat, v-on:click.native='save()')
            | Save

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
                      v-radio.primary--text(
                        :label='radio',
                        :value='radio'
                      )
                v-flex.section-title(offset-xs1, xs3) Magnets
                v-flex(xs8)
                  v-switch(
                    label='Activate',
                    color='primary',
                    v-model='config.magnets',
                    dark,
                    persistent-hint,
                    hint='Activate to get a list of magnets in the downloader'
                  )
            v-card.section
              v-card-title#local.headline Local
              v-divider
              v-layout(row, wrap, justify-center)
                v-flex.section-title(xs4) Preferred local path
                v-flex.local-path(xs6) {{ config.localPath }}
                v-flex(xs2)
                  v-btn(accent, @click="$store.dispatch('changePathWithConfig')") Choose
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
                    v-model='$store.state.config.system.autoStart',
                    persistent-hint,
                    hint='Launch KawAnime on system start?',
                    disabled
                  )
                v-flex.section-title(xs3) Tray icon
                v-flex(xs3)
                  v-switch(
                    label='Enable',
                    color='primary',
                    dark,
                    v-model='$store.state.config.system.toTray',
                    persistent-hint,
                    hint='Launch KawAnime with tray icon'
                  )
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        configModal: false,
        radios: ['480p', '720p', '1080p'],
        itemGroup: [
          {
            title: 'Download',
            action: 'file_download',
            to: '#download'
          }, {
            title: 'Local',
            action: 'folder',
            to: '#local'
          }, {
            title: 'Notification',
            action: 'play_circle_outline',
            to: '#notification'
          }
        ]
      }
    },
    computed: {
      config () {
        return this.$store.state.config
      },
      fansubChoices () {
        return this.$store.state.fansubList
      },
      soundChoices () {
        return this.$store.state.soundList
      }
    },
    methods: {
      changeConfigPath () {
        this.$store.dispatch('changePathWithConfig')
      },
      save () {
        this.$store.commit('setConfig', this.config)
        const toSave = {...this.config}

        this.$store.dispatch('saveConfig', toSave)
      },
      saveAndClose () {
        this.save()
        this.configModal = false
      },
      play () {
        this.$store.dispatch('setUpPlayer')
        this.$store.dispatch('playSound')
      }
    }
  }
</script>

<style scoped>
  .drawer
  {
    margin-top: 72px;
    width: 23%;
  }

  .tb
  {
    top: 24px;
  }

  .container
  {
    padding-top: calc(24px + 48px);
  }

  .section
  {
    margin-top: 20px;
  }

  .section-title
  {
    padding-left: 20px;
    margin-top: 15px;
    font-size: 22px;
    font-weight: 300;
  }

  .local-path
  {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 200;
    text-align: center;
  }
</style>
