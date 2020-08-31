<template lang="pug">
  //- We need notification sound choice.
  v-card.elevation-12
    v-card-title.section-title Notifications configuration
    v-divider
    v-card-text
      v-container.pa-0
        v-row(justify='center', align='center')
          v-col(cols='12', sm='8', md='6', lg='4')
            v-select(
              label='Notification sound',
              :items='sounds',
              v-model='sound',
              persistent-hint,
              hint='What sound should be used to notify you?'
            )
          v-col(cols='9', sm='10', md='4')
            v-slider(
              v-model='volume',
              append-icon='volume_up',
              prepend-icon='volume_down',
              thumb-label,
              hide-details
            )
          v-col(cols='3', sm='2')
            v-btn(icon, large, @click='play')
              v-icon(large) play_circle_outline
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Notifications-Section',

  mixins: [Update],

  computed: {
    sounds: {
      get () {
        return this.$store.state.config.sounds
      },
      set () {}
    },

    sound: {
      get () {
        return this.config.sound
      },
      set (val) {
        this.setValue('sound', val)
        this.$store.dispatch('player/setUp')
      }
    },
    volume: {
      get () {
        return this.config.notificationVolume * 100
      },
      set (val) {
        this.setValue('notificationVolume', val / 100)
        this.$store.dispatch('player/setUp')
      }
    }
  },

  methods: {
    play () {
      this.$store.dispatch('player/play')
    }
  }
}
</script>
