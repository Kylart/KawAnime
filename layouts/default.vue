<template>
  <v-app dark>
    <v-system-bar dark
                  lights-out
                  status
                  v-if="!browser">
      <v-spacer></v-spacer>
      <v-icon class="window-icon">remove</v-icon>
      <v-icon class="window-icon">check_box_outline_blank</v-icon>
      <v-icon class="window-icon">close</v-icon>
    </v-system-bar>

    <v-navigation-drawer class="pb-0"
                         persistent
                         enable-resize-watcher
                         v-model="drawer"
    >
      <v-list>
        <v-list-tile id="title">
          <v-list-tile-action>
            <img src="~static/images/icon2.png" height="55"/>
          </v-list-tile-action>
          <v-list-tile-title class="title">
            かわニメ
          </v-list-tile-title>
          <v-list-tile-action>
            <v-menu origin="center center"
                    transition="scale-transition"
                    bottom>
              <v-btn icon slot="activator">
                <v-icon>expand_more</v-icon>
              </v-btn>
              <v-list>
                <template v-for="item in links">
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon mdi>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{ item.link }}</v-list-tile-title>
                  </v-list-tile>
                </template>
              </v-list>
            </v-menu>
          </v-list-tile-action>
        </v-list-tile>
        <template v-for="item in itemGroup">
          <v-list-group v-if="item.items"
                        :value="item.active"
                        :key="item.title">
            <v-list-tile slot="item" class="ripple" ripple>
              <v-list-tile-action>
                <v-icon>{{ item.action }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
              <v-list-tile-action>
                <v-icon>
                  keyboard_arrow_down
                </v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile v-for="subItem in item.items"
                         :value="subItem.active"
                         class="ripple"
                         ripple
                         to="subItem.href"
                         key="subItem.title">
              <v-list-tile-action>
                <v-icon>{{ subItem.action }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
          </v-list-group>
          <v-subheader v-else-if="item.header">{{ item.header }}</v-subheader>
          <v-divider v-else-if="item.divider"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text title">かわニメ</v-toolbar-title>
      <v-spacer></v-spacer>
      <info-modal></info-modal>
      <v-btn icon
             class="open-in-browser"
             v-tooltip:left="{ html: 'Open KawAnime in your browser' }"
             @click.native="openInBrowser()">
        <v-icon>open_in_new</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>settings</v-icon>
      </v-btn>
    </v-toolbar>

    <main>
      <v-container fluid>
        <nuxt></nuxt>
      </v-container>
    </main>
    <v-footer class="grey darken-4">
      <v-spacer></v-spacer>
      <div class="white--text">&copy; 2016 - 2017 Kylart</div>
    </v-footer>
  </v-app>
</template>

<script>
  import Settings from '~components/settings.vue'
  import infoModal from '~components/infoModal.vue'

  export default {
    data () {
      return {
        searchModal: false,
        drawer: false,
        browser: false,
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
            active: true,
            items: [
              {
                title: 'Downloader',
                action: 'file_download',
                active: false,
                href: '/downloader'
              }, {
                title: 'Latest releases',
                action: 'access_time',
                active: true,
                href: '/'
              }
            ]
          }, {
            title: 'News',
            action: 'info_outline',
            active: false,
            items: [
              {
                title: 'Seasons',
                action: 'hourglass_empty',
                active: false,
                href: '/seasons'
              },
              {
                title: 'News',
                action: 'more',
                active: false,
                href: '/news'
              }
            ]
          },
          {divider: true},
          {header: 'Local'},
          {
            title: 'Anime related',
            active: false,
            action: 'folder_open',
            items: [
              {
                title: 'Animes',
                action: 'tv',
                active: false,
                href: '/localPage'
              }, {
                title: 'Watch list',
                action: 'sort_by_alpha',
                active: false,
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
    components: {
      Settings,
      infoModal
    },
    computed: {
      searchInput () {
        return this.$store.state.searchInput
      },
      openInBrowser () {
        this.browser = true
        this.$store.dispatch('openInBrowser')
      }
    }
  }
</script>

<style scoped>
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
    overflow: auto;
    padding-left: 20px;
    font-family: "Hiragino Mincho Pro", serif;
    font-size: 30px !important;
  }

  .navigation-drawer .list--group__container .list__tile--active .list__tile__title,
  .navigation-drawer .list__tile--active:first-child .icon,
  .navigation-drawer .list--group__header--active:first-child .list__tile__action:first-child .icon
  {
    color: #ff9800 !important;
  }

  .open-in-browser
  {
    margin-top: 6px !important;
  }

  .modal-container .title
  {
    line-height: 25px;
  }
</style>
