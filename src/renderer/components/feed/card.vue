<template lang="pug">
  v-card#release-entry
    v-img(
      @mouseenter='showOverlay',
      @mouseleave='hideOverlay',
      :src="picture || ''",
      :lazy-src="picture || ''",
      height='200px'
    )
      transition-group(name='overlay-trans', mode='out-in')
        v-container.fill-height(
          v-if='!overlay',
          key='normal'
        )
          v-row.fill-height.flex-column.text(justify='space-between')
            .pa-0.entry-title
              .px-2 {{ name }}
            .text-center(v-if='!picture')
              v-progress-circular(indeterminate)
            .text-right.entry-ep
              .pr-1 {{ episodeLabel }}

        v-container.fill-height.overlay(
          v-else
          fluid,
          pa-0,
          key='overlay'
        )
          v-row.ml-0.fill-height(align='center', no-gutters)
            v-col.overlay-icon(@click='watch', cols='4')
              v-icon.large play_arrow
            v-col.pa-0.download-container(cols='4')
              v-row.fill-height.ma-0.flex-column(align='center')
                v-col.overlay-icon(@click='download')
                  v-icon.large file_download
                v-col.overlay-icon(@click='downloadAll')
                  v-icon.large cloud_download
            v-col.overlay-icon(@click='more', cols='4')
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

  mixins: [Status],

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
    ...mapGetters('info', ['getEntryInfo']),
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
    height 100%
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
    div
      height 100%
      line-height 2em
      width 100%
      display flex
      align-items center
      justify-content flex-start
      background-color rgba(0, 0, 0, 0.5)

  .entry-ep
    height 20%
    font-size 16px
    display flex
    justify-content flex-end

    div
      height 100%
      min-width 25%
      display flex
      align-items center
      justify-content flex-end
      border-top-left-radius: 100px 200px;
      border-bottom-left-radius: 100px 200px;
      background-color rgba(0, 0, 0, 0.4)

  .fansub
    font-size 14px
    letter-spacing 0.03em
    font-weight 300
</style>
