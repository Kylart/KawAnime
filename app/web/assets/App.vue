<template lang="pug">
  v-app(dark)
    v-navigation-drawer.pb-0.main-drawer(app, fixed, temporary, v-model='$store.state.drawer')
      v-list(dark)
        v-list-tile#title(to='/')
          v-list-tile-action
            img(src='~static/images/icon2.png', height='50')
          v-list-tile-title.title.white--text かわニメ

        template(v-for='item in itemGroup')
          v-list-group(
            v-if='item.items',
            :group='item.group',
            :prepend-icon='item.action',
            no-action
          )
            v-list-tile(slot='activator', ripple)
              v-list-tile-content
                v-list-tile-title {{ item.title }}
            template(v-for='(subItem, i) in item.items')
              v-list-tile(
                :key='i',
                :to='subItem.href',
                :disabled='subItem.disabled',
                ripple
              )
                v-list-tile-action
                  v-icon {{ subItem.action }}
                v-list-tile-content
                  v-list-tile-title
                    span {{ subItem.title }}

          v-subheader.white--text(v-else-if='item.header') {{ item.header }}
          v-divider(v-else-if='item.divider')

    v-system-bar.wb.dragable(app, dark, status)
      v-spacer
      div.window-icon.non-dragable(v-if="!isBrowser && $store.state.platform !== 'darwin'")
        v-icon.not-close(@click="actOnWindow('minimize')") remove
        v-icon.not-close(@click="actOnWindow('maximize')") check_box_outline_blank
        v-icon.close(@click="actOnWindow('close')") close

    v-toolbar.mablue.tb(app, fixed, dark)
      v-toolbar-side-icon(@click.stop='toggleDrawer()')
      v-toolbar-title.white--text.title.hidden-xs-only かわニメ
      v-spacer
      v-tooltip(left)
        v-btn(icon, v-show="$store.state.update.isAvailable", @click='restartAndUpdate()', slot='activator')
          v-icon.green--text file_download
        span Update KawAnime
      info-modal
      v-tooltip(left)
        v-btn(icon, @click='openInBrowser()', slot='activator')
          v-icon open_in_new
        span Open KawAnime in your browser
      settings
      logs

    v-content
      transition(name='page', mode='out-in')
        router-view

      k-footer

    env(v-show='$store.state.NODE_ENV === "development"')
    overlay(v-show='overlay')
    magnets-modal
    video-modal(v-show='$store.state.streaming.player.show')
    mal-form
    info-results
    choice-window

    //- Used for displaying any info
    v-snackbar(
      :timeout='5000',
      top, right,
      v-model='$store.state.infoSnackbar.show'
    ) {{ $store.state.infoSnackbar.text }}
      v-btn.pink--text(flat, @click='$store.state.infoSnackbar.show = false') Close
</template>

<script>
import Meta from 'mixins/global/meta'
import ReadMagnet from 'mixins/global/readMagnet'
import DragDrop from 'mixins/global/dragDrop'

export default {
  mixins: [Meta, ReadMagnet, DragDrop],
  mounted () {
    this.isBrowser = !window.navigator.appVersion.includes('Electron')
  },
  data () {
    return {
      searchModal: false,
      drawer: false,
      isBrowser: false,
      itemGroup: [
        {divider: true},
        {header: 'Core'},
        {
          title: 'Downloading',
          action: 'file_download',
          group: 'core',
          items: [
            {
              title: 'Downloader',
              action: 'file_download',
              href: '/downloader'
            }, {
              title: 'Latest releases',
              action: 'access_time',
              href: '/'
            }
          ]
        }, {
          title: 'Torrent',
          action: 'folder_open',
          group: 'torrent',
          items: [
            // {
            //   title: 'Torrenting',
            //   action: 'file_upload',
            //   href: '/torrenting'
            // },
            {
              title: 'Streaming',
              action: 'tv',
              href: '/streaming'
            }
          ]
        },
        {divider: true},
        {header: 'Anime world'},
        {
          title: 'News',
          action: 'info_outline',
          group: 'news',
          items: [
            {
              title: 'Seasons',
              action: 'hourglass_empty',
              href: '/seasons'
            },
            {
              title: 'News',
              action: 'more',
              href: '/news'
            }
          ]
        },
        {divider: true},
        {header: 'Local'},
        {
          title: 'Anime related',
          action: 'folder_open',
          group: 'local',
          items: [
            {
              title: 'Animes',
              action: 'tv',
              href: '/localPage'
            }, {
              title: 'Watch list',
              action: 'sort_by_alpha',
              href: '/watchList'
            }, {
              title: 'MyAnimeList',
              action: 'web',
              href: '/malPage'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggleDrawer () {
      this.$store.commit('toggleDrawer')
    },
    actOnWindow (action) {
      this.$axios.get('/_win', {
        params: {
          action
        }
      })
    },
    openInBrowser () {
      this.$store.dispatch('openInBrowser')
    },
    restartAndUpdate () {
      this.$store.dispatch('update/updateApp')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .wb
    padding-right 0
    position fixed
    width 100%
    background-color #303030 !important

  .tb
    margin-top 24px !important
    max-height 48px
    padding-left 1%

  .main-drawer
    width 280px !important
    background-image url('~static/images/sidebar-background.png')
    background-position left bottom
    background-size 75%

  .main-drawer ul
    background-image none

  .ripple
    position relative

  .window-icon
    cursor pointer
    height 100%

  .close, .not-close
    text-align center
    margin 0
    height 100%
    width 25px

  .not-close
    padding-top 4px
    font-size 17px

    &:hover
      background-color rgba(255, 255, 255, 0.25)

  .close
    padding-top 2px
    font-size 18px

    &:hover
      background-color rgba(240, 71, 71, 0.7)

  .title
    overflow hidden
    padding-left 20px
    font-family 'Hiragino Mincho Pro', 'MS PMincho', serif !important
    font-size 30px !important
    line-height 25px !important
</style>

<style lang="stylus">
  @import './stylus/main'
</style>
