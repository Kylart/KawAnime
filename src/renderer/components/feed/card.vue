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
            v-flex.entry-title(xs2) {{ name }}
            v-flex.text-center(v-if='!picture', xs2)
              v-progress-circular(indeterminate)
            v-flex.entry-ep(xs2, v-if='episodeLabel')
              span {{ episodeLabel }}

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
      .fansub.ellipsis(v-show='!hasFansub') {{ info.parsedName.release_group }}
      v-spacer
      template(v-for='list in lists')
        v-tooltip(top)
          template(v-slot:activator='{ on }')
            v-btn(
              v-on='on',
              @click='_addTo(list.list)',
              icon
            )
              v-icon(:color="_isIn(list.list) ? '#66BB6A' : 'default'") {{ list.icon }}
          span {{ _isIn(list.list) ? 'Remove from' : 'Add to' }} {{ list.name }}
      //- v-btn(icon)
      //-   span.mal-icon
</template>

<script>
import { mapGetters } from 'vuex'

import Status from '@/mixins/lists/status.js'

export default {
  name: 'Feed-Card',

  mixins: [ Status ],

  props: ['info'],

  mounted () {
    this.$ipc.on(this.$eventsList.search.name.success, this.ipcHandler)
    this.$ipc.on(this.$eventsList.search.name.error, this.ipcError)
    this.updateInfo()
  },

  data: () => ({
    overlay: false,
    animeInfo: {},
    picture: ''
  }),

  computed: {
    ...mapGetters('info', [ 'getEntryInfo' ]),
    hasFansub () {
      return this.$store.state.releases.params.fansub !== 'None'
    },
    name () {
      return this.info.parsedName.anime_title
    },
    lists: {
      get () {
        return this.$store.state.watchLists.listNames.filter(({ list }) => ['watchList', 'watching'].includes(list))
      },
      set () {}
    },
    episodeLabel () {
      const ep = this.info.parsedName.episode_number || 'N/A'

      return Array.isArray(ep)
        ? `Eps. ${ep.join(' - ')}`
        : `Ep. ${ep}`
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
      const { parsedName: { anime_title: title, episode_number: ep } } = this.info

      const magnet = 'magnet' in this.info
        ? this.info.magnet
        : this.info.links.magnet

      this.$store.dispatch('streaming/play', {
        isTorrent: true,
        link: magnet,
        name: `${title} - ${ep}`
      })
    },
    download () {
      this.$electron.shell.openExternal(this.info.magnet || this.info.links.magnet)
    },
    downloadAll () {
      const { params } = this.$store.state.releases

      this.$store.dispatch('downloader/download', {
        fansub: params.fansub === 'None'
          ? this.$store.state.config.config.fansub
          : params.fansub,
        quality: params.quality,
        name: this.name,
        fromEp: -Infinity,
        untilEp: Infinity,
        feed: params.feed
      })
    },
    more () {
      if (this.getEntryInfo(this.name)) {
        this.$store.commit('releases/setCurrent', this.info.parsedName)
      }
    },
    updateInfo () {
      const { name } = this
      const info = this.getEntryInfo(name)

      info
        ? this.setInfo()
        : this.$store.dispatch('info/get', { name })
    },
    setInfo (info = null) {
      const _info = info || this.getEntryInfo(this.name)

      this.$set(this, 'animeInfo', _info)
      this.$set(this, 'picture', this.animeInfo.img)

      this.$store.dispatch('info/saveLocalInfo', {
        title: this.name,
        info: _info,
        isUpdate: true
      })
    },
    ipcHandler (e, data) {
      const { name, info, provider } = data

      if (!name || name !== this.name) return

      this.$store.commit('info/set', {
        name,
        info,
        provider
      })

      this.setInfo()
      this.$ipc.removeListener(this.$eventsList.search.name.success, this.ipcHandler)
      this.$ipc.removeListener(this.$eventsList.search.name.error, this.ipcError)
    },
    ipcError (e, data) {
      const { name, msg } = data

      if (name === this.name) {
        this.$log('Could not retrieve information for', name, msg)

        setTimeout(this.updateInfo, 1000)
      }
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
