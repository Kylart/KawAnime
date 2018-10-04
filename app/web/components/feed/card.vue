<template lang="pug">
  v-card
    v-img(
      @mouseenter='showOverlay',
      @mouseleave='hideOverlay',
      :src="picture || ''",
      :lazy-src="picture || ''",
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
            v-flex.entry-title(xs2) {{ info.parsedName.title }}
            v-flex.text-xs-center(v-if='!picture', xs2)
              v-progress-circular(indeterminate)
            v-flex.entry-ep(xs2, v-if='info.parsedName.episodeOrMovieNumber')
              span Ep. {{ info.parsedName.episodeOrMovieNumber }}

        v-container.overlay(
          v-else
          fill-height,
          fluid,
          pa-0,
          key='overlay'
        )
          v-layout(fill-height, align-center row, wrap)
            v-flex.overlay-icon(@click='watch', xs4, fill-height)
              v-icon.large play_arrow
            v-flex.pa-0.download-container(xs4, fill-height)
              v-layout.ma-0(fill-height, column)
                v-flex.overlay-icon(@click='download', xs6, fill-height)
                  v-icon.large file_download
                v-flex.overlay-icon(@click='downloadAll', xs6, fill-height)
                  v-icon.large cloud_download
            v-flex.overlay-icon(@click='more', xs4, fill-height)
              v-icon.large more_horiz

    v-card-actions
      .fansub.ellipsis(v-show='!hasFansub') {{ info.parsedName.releaseGroup }}
      v-spacer
      template(v-for='list in lists')
        v-tooltip(top, lazy)
          v-btn(
            slot='activator',
            @click='_addTo(list.list)',
            icon
          )
            v-icon(:color="_isIn(list.list) ? '#66BB6A' : 'default'") {{ list.icon }}
          span {{ _isIn(list.list) ? 'Remove from' : 'Add to' }} {{ list.name }}
      v-btn(icon)
        span.mal-icon
</template>

<script>
import { mapGetters } from 'vuex'

import Status from 'mixins/lists/status.js'

export default {
  name: 'Feed-Card',

  mixins: [ Status ],

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
    }),
    hasFansub () {
      return this.$store.state.releases.params.fansub !== 'None'
    },
    name () {
      return this.info.parsedName.title
    },
    lists: {
      get () {
        return this.$store.state.watchLists.listNames.filter(({ list }) => ['watchList', 'watching'].includes(list))
      },
      set () {}
    }
  },

  methods: {
    showOverlay () {
      this.overlay = true
    },
    hideOverlay () {
      this.overlay = false
    },
    watch () {
      const { links: { magnetLink }, parsedName: { title, episodeOrMovieNumber: ep }, magnet } = this.info

      this.$store.commit('streaming/play', {
        show: true,
        link: {
          link: magnet || magnetLink,
          name: `${title} - ${ep}`
        }
      })
    },
    async download () {
      await this.$axios.get('openThis', {
        params: {
          type: 'link',
          link: this.info.magnet || this.info.links.magnet
        }
      })
    },
    async downloadAll () {
      const { params } = this.$store.state.releases

      this.$store.dispatch('downloader/download', {
        fansub: params.fansub === 'None'
          ? this.$store.state.config.config.fansub
          : params.fansub,
        quality: params.quality,
        name: this.info.parsedName.title,
        fromEp: -Infinity,
        untilEp: Infinity,
        feed: params.feed
      })
    },
    more () {
      if (this.allInfo[this.info.parsedName.title]) {
        this.$store.commit('releases/setCurrent', this.info.parsedName)
      }
    },
    async updateInfo () {
      const name = this.info.parsedName.title

      if (!(name in this.allInfo)) {
        await this.$store.dispatch('info/get', name)
      }

      if (!(name in this.allInfo)) {
        setTimeout(this.updateInfo, 15 * 1000)
        return
      }

      this.$set(this, 'animeInfo', this.allInfo[name])
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

  .overlay-icon
    position relative
    display flex
    justify-content center
    align-items center
    transition all .25s
    cursor pointer

    &:hover
      background-color rgba(255, 255, 255, 0.20)

    .large
      font-size 48px

  .download-container
    width 100%
    height 100%

  // Not overlay
  .text
    font-size 18px
    letter-spacing 0.07em
    font-weight bold
    color white

  .entry-title
    padding 2px 4px
    background-color rgba(0, 0, 0, 0.4)

  .entry-ep
    text-align right
    font-size 16px

    span
      padding 2px 4px
      background-color rgba(0, 0, 0, 0.4)

  .fansub
    font-size 14px
    letter-spacing 0.03em
    font-weight 300
</style>
