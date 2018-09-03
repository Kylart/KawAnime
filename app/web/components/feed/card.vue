<template lang="pug">
  v-card
    v-img(
      @mouseover='showOverlay',
      @mouseleave='hideOverlay',
      :src="picture || ''",
      lazy-src='~static/images/waiting.png'
      height='200px'
    )
      transition-group(name='overlay-trans', mode='out-in')
        v-container(
          v-if='!overlay'
          fill-height,
          fluid,
          pa-2,
          key='normal'
        )
          v-layout.text(fill-height, column, justify-space-between)
            v-flex(xs2)
              span.entry-title {{ info.title }}
            v-flex.text-xs-center(v-if='!picture', xs2)
              v-progress-circular(indeterminate)
            v-flex.entry-ep(xs2)
              span Ep. {{ info.episodeOrMovieNumber }}

        v-container.overlay(
          v-else
          fill-height,
          fluid,
          pa-2,
          key='overlay'
        )
          v-layout(fill-height, align-center, justify-center)
            v-flex(xs3, justify-center, flexbox)
              v-btn(icon, large, @click='watch')
                v-icon(large) play_circle_outline
            v-flex(xs3, justify-center, flexbox)
              v-btn(icon, large, @click='download')
                v-icon(large) file_download
            v-flex(xs3, justify-center, flexbox)
              v-btn(icon, large, @click='more')
                v-icon(large) more_horiz

    v-card-actions
      v-spacer
      v-btn(icon)
        v-icon tv
      v-btn(icon)
        v-icon favorite
      v-btn(icon)
        span.mal-icon
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Feed-Card',

  props: ['info'],

  mounted () {
    this.updateInfo()
  },

  data: () => ({
    overlay: false,
    animeInfo: {},
    picture: ''
  }),

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    })
  },

  methods: {
    showOverlay () {
      this.overlay = true
    },
    hideOverlay () {
      this.overlay = false
    },
    watch () {

    },
    download () {

    },
    more () {

    },
    async updateInfo () {
      if (!(this.info.title in this.allInfo)) {
        await this.$store.dispatch('info/get', this.info.title)
      }

      this.$set(this, 'animeInfo', this.allInfo[this.info.title])
      this.$set(this, 'picture', this.animeInfo.picture)
    }
  }
}
</script>

<style lang="stylus" scoped>
  // Overlay part
  .overlay-trans-enter, .overlay-trans-leave-to
    opacity 0

  .overlay-trans-enter-active, .overlay-trans-leave
    transition all .5s

  .overlay
    background-color rgba(0, 0, 0, 0.7)

  // Not overlay
  .text
    font-size 22px
    letter-spacing 0.07em
    font-weight bold
    // Making an outline on he text
    text-shadow 1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black

  .entry-ep
    text-align right
    font-size 20px
</style>
