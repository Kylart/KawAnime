<template lang="pug">
  v-app(dark, footer, toolbar)
    v-navigation-drawer.pb-0(style='width: 280px', temporary, persistent, v-model='$store.state.drawer')
      v-list
        v-list-tile#title(to='/')
          v-list-tile-action
            img(src='static/images/icon2.png', height='50')
          v-list-tile-title.title.white--text かわニメ
        template(v-for='item in itemGroup')
          v-list-group(v-if='item.items', :key='item.title', :group="item.group")
            v-list-tile.ripple(slot='item', ripple)
              v-list-tile-action
                v-icon {{ item.action }}
              v-list-tile-title {{ item.title }}
              v-list-tile-action
                v-icon keyboard_arrow_down
            v-list-tile.ripple(v-for='subItem in item.items', ripple, :to='subItem.href', :key='subItem.title', exact)
              v-list-tile-action
                v-icon {{ subItem.action }}
              v-list-tile-content
                v-list-tile-title {{ subItem.title }}
            v-divider
          v-subheader.white--text(v-else-if='item.header') {{ item.header }}
          v-divider(v-else-if='item.divider')

    v-system-bar.wb.dragable(dark, status)
      v-spacer
      div(v-if="!isBrowser && $store.state.platform !== 'darwin'")
        v-icon.window-icon.non-dragable(@click="actOnWindow('minimize')") remove
        v-icon.window-icon.non-dragable(@click="actOnWindow('maximize')") check_box_outline_blank
        v-icon.window-icon.non-dragable(@click="actOnWindow('close')") close

    v-toolbar.mablue.tb(fixed, dark)
      v-toolbar-side-icon(@click.stop='toggleDrawer()')
      v-toolbar-title.white--text.title.hidden-xs-only かわニメ
      v-spacer
      v-btn(icon, v-show="$store.state.isUpdateAvailable", v-tooltip:left="{ html: 'Update KawAnime' }", @click='restartAndUpdate()')
        v-icon.green--text file_download
      info-modal
      v-btn(icon, v-tooltip:left="{ html: 'Open KawAnime in your browser' }", @click='openInBrowser()')
        v-icon open_in_new
      settings

    main.m
      transition(name='page', mode='out-in')
        router-view

    env(v-show='$store.state.NODE_ENV === "development"')

    info-results(v-show='$store.state.info.show')

    //- Used for displaying any info
    v-snackbar(
      :timeout='5000',
      :top='true',
      :bottom='false',
      :right='false',
      :left='false',
      v-model='$store.state.infoSnackbar.show'
    ) {{ $store.state.infoSnackbar.text }}
      v-btn.pink--text(flat, @click='$store.state.infoSnackbar.show = false') Close

    v-footer.grey.darken-4.pr-2
      v-spacer
      .white--text © 2016 - 2017 Kylart
</template>

<script>
  import axios from 'axios'
  import Meta from 'mixins/meta'

  export default {
    mixins: [Meta],
    mounted () {
      this.isBrowser = !window.process
    },
    data () {
      return {
        searchModal: false,
        drawer: false,
        isBrowser: false,
        links: [
          {link: 'Github', to: 'https://github.com/Kylart/KawAnime', icon: 'github-circle'},
          {link: 'Updates', to: '', icon: ''}
        ],
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
              }
            ]
          }
//            Too soon...
//          {
//            title: 'Torrenting',
//            items: [
//              {title: 'Current downloads'},
//              {title: 'Sourcing'},
//              {title: 'Create torrents'}
//            ]
//          }
        ]
      }
    },
    methods: {
      toggleDrawer () {
        this.$store.commit('toggleDrawer')
      },
      actOnWindow (action) {
        axios.get('/_win', {
          params: {
            action
          }
        })
      },
      openInBrowser () {
        this.$store.dispatch('openInBrowser')
      },
      restartAndUpdate () {
        this.$store.dispatch('updateApp')
      }
    }
  }
</script>

<style scoped>
  .m
  {
    min-width: 100%;
    padding-top: calc(48px + 24px);
  }

  .wb
  {
    position: fixed;
    width: 100%;
    z-index: 100;
    background-color: #303030 !important;
  }

  .tb
  {
    margin-top: 24px !important;
    max-height: 48px;
    padding-left: 1%;
  }

  .navigation-drawer
  {
    padding-top: 24px;
    background-image: url('/static/images/sidebar-background.png');
    background-position: left bottom;
    background-size: 75%;
  }

  .ripple
  {
    position: relative;
  }

  .window-icon
  {
    cursor: pointer;
  }

  .title
  {
    overflow: hidden;
    padding-left: 20px;
    font-family: 'Hiragino Mincho Pro', 'MS PMincho', serif;
    font-size: 30px !important;
  }
</style>

<style lang="stylus">
  @import './stylus/main'
</style>

<style>
  @import '../node_modules/animate.css/animate.min.css';
  @import './iconfont/material-icons.css';
</style>
