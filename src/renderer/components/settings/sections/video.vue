<template lang="pug">
  v-card.elevation-12
    v-card-title.section-title Video configuration
    v-divider
    v-card-text
      v-container.pa-0.pb-2
        v-row(justify='space-around', align-baseline)
          v-col(cols='12', sm='6', md='3')
            v-switch.mt-0(
              v-model='autoPlay',
              color='primary',
              :label="autoPlay ? 'Yes' : 'No'"
              persistent-hint,
              hint='Should the video play ASAP?'
            )
          v-col(cols='12', sm='6', md='3')
            v-switch.mt-0(
              v-model='fullscreen',
              color='primary',
              :label="fullscreen ? 'Yes' : 'No'"
              persistent-hint,
              hint='Should the video start on fullscreen?'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              label='Subtitle language',
              :items='subtitlesLanguages',
              v-model='preferredLanguage'
              persistent-hint,
              hint='The subtitles language the player should try to load.'
            )
          v-col(cols='12', sm='6', md='3')
            v-select(
              label='Quality',
              :items='order(qualities)',
              v-model='quality'
              persistent-hint,
              hint='The quality the player should try to load.'
            )
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'
import Order from '@/mixins/config/order.js'

export default {
  name: 'Video-Section',

  mixins: [Order, Update],

  computed: {
    video: {
      get () {
        return this.config.video
      },
      set () {}
    },
    qualities: {
      get () {
        return this.$store.state.config.qualities
      },
      set () {}
    },
    subtitlesLanguages: {
      get () {
        return this.$store.state.config.subtitlesLanguages
      },
      set () {}
    },

    autoPlay: {
      get () {
        return this.video.autoplay
      },
      set (bool) {
        this.setDeepValue('video.autoplay', bool)
      }
    },
    fullscreen: {
      get () {
        return this.video.fullscreen
      },
      set (bool) {
        this.setDeepValue('video.fullscreen', bool)
      }
    },
    quality: {
      get () {
        return this.video.quality
      },
      set (bool) {
        this.setDeepValue('video.quality', bool)
      }
    },
    preferredLanguage: {
      get () {
        return this.video.preferredLanguage
      },
      set (bool) {
        this.setDeepValue('video.preferredLanguage', bool)
      }
    }
  }
}
</script>
