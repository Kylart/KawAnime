<template>
  <v-container fluid class="page-container">
    <div v-if="files.length">
      <v-layout row wrap style="margin: 0 1% 0 1%;">
        <v-flex xs12 class="menubar">
          <v-layout row wrap>
            <v-flex hidden-sm-and-up xs2></v-flex>
            <v-flex xs4 sm3 md2 class="menu-eps">
              <p class="menu-eps-text">{{ nbEps }} {{ episodeLabel }}</p>
            </v-flex>
            <v-flex xs4 sm2 md2>
              <history-modal></history-modal>
            </v-flex>
            <v-flex xs12 sm7 offset-md3 md5 offset-lg4 lg4 offset-xl5 xl3 class="menu-buttons">
              <v-btn icon
                     class="refresh-button"
                     v-if="!this.$store.state.refreshingLocal"
                     @click="refresh()">
                <v-icon large>refresh</v-icon>
              </v-btn>
              <v-btn v-else icon loading
                     class="refresh-button">
              </v-btn>
              <v-btn flat dark
                     @click="changePath()"
                     class="change-dir-button">
                Change dir
              </v-btn>
              <v-btn secondary dark
                     @click="resetLocal()"
                     v-if="!this.$store.state.resettingLocal"
                     class="reset-cache-button">
                Refresh local info
              </v-btn>
              <v-btn secondary dark loading v-else class="reset-cache-button"></v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <transition-group name="list">
          <template v-for="item in files">
            <v-flex :key="item.path" xs12 sm6 md4 xl3
                    class="elem">
              <v-card class="elem-content elevation-3" v-ripple="true">
                <v-card-text class="elem-card">
                  <v-container fluid style="padding: 0;">
                    <v-layout row wrap class="elem-container">
                      <v-flex xs7
                              v-tooltip:top="{ html: item.name }">
                        <h6 class="elem-title ellipsis white--text">{{ item.name }}</h6>
                      </v-flex>
                      <v-flex xs2
                              v-tooltip:top="{ html: 'Episode ' + item.ep }"
                              class="elem-ep text-xs-right">
                        <p class="ellipsis ep">{{ item.ep }} / {{ item.numberOfEpisode }}</p>
                      </v-flex>
                      <v-flex xs3 class="buttons-container">
                        <v-btn large icon
                               class="play-button"
                               @click="playThis(item)">
                          <v-icon large>play_circle_outline</v-icon>
                        </v-btn>
                        <v-menu open-on-hover
                                transition="slide-x-transition">
                          <v-btn icon medium slot="activator">
                            <v-icon>more_vert</v-icon>
                          </v-btn>
                          <v-list class="dark">
                            <v-list-tile @click="showChoices(item.name)">
                              <v-list-tile-action>
                                <v-icon>add_box</v-icon>
                              </v-list-tile-action>
                              <v-list-tile-title>
                                Add to
                              </v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="delThis(item)">
                              <v-list-tile-action>
                                <v-icon medium class="primary--text">delete_forever</v-icon>
                              </v-list-tile-action>
                              <v-list-tile-title class="primary--text">Delete</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </v-flex>
                      <v-flex xs8
                              v-tooltip:top="{ html: item.genres.length ? item.genres.join(', ') : 'No specified genre' }">
                        <p class="ellipsis genres">
                          {{ item.genres.length ? item.genres.join(', ') : 'No specified genre' }}
                        </p>
                      </v-flex>
                      <v-flex xs4 v-tooltip:top="{ html: item.classification.replace('None', 'No restriction') }">
                        <p class="ellipsis classification">
                          {{ item.classification.replace('None', 'No restriction') }}
                        </p>
                      </v-flex>
                      <v-flex xl5 lg4 md5 sm3 xs4 class="picture-container">
                        <img :src="item.picture" class="picture">
                      </v-flex>
                      <v-flex xl7 lg8 md7 sm9 xs8 class="bottom-right-container">
                        <v-layout row wrap justify-space-between>
                          <v-flex xs12>
                            <div class="synopsis">{{ reduced(item.synopsis) }}</div>
                          </v-flex>
                          <v-flex xs12 style="display: flex">
                            <v-layout align-center justify-space-between style="min-width: 100%">
                              <v-flex xs2>
                                <p class="year">{{ item.year }}</p>
                              </v-flex>
                              <v-flex xs7>
                                <p class="status">{{ item.status }}</p>
                              </v-flex>
                              <v-flex xs3><p class="mark">{{ item.mark }}</p></v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>
          </template>
        </transition-group>
      </v-layout>
    </div>
    <v-container fluid v-else>
      <transition name="fade">
        <img v-if="emptyBg" class="empty-bg" height="400" src="~static/images/empty-bg.png"/>
      </transition>
      <v-layout row wrap>
        <v-flex xs12 class="menubar">
          <v-layout row wrap>
            <v-flex offset-xs2 xs2>
              <history-modal></history-modal>
            </v-flex>
            <v-flex xs5></v-flex>
            <v-flex xs3 class="menu-buttons">
              <v-btn icon
                     class="refresh-button"
                     v-if="!this.$store.state.refreshingLocal"
                     @click="refresh()">
                <v-icon large>refresh</v-icon>
              </v-btn>
              <v-btn v-else icon loading
                     class="refresh-button">
              </v-btn>
              <v-btn flat dark
                     @click="changePath()"
                     class="change-dir-button">
                Change dir
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="empty-message">
          <h3 class="white--text">Wow such empty!</h3>
          <h4 class="white--text">Start downloading anime
            <nuxt-link to="/downloader" class="green--text">here</nuxt-link>
            or
            <nuxt-link to="/" class="cyan--text">here!</nuxt-link>
          </h4>
        </v-flex>
      </v-layout>
    </v-container>
    <choice-window :entry="choiceTitle"></choice-window>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    mounted () {
      setTimeout(() => { this.emptyBg = true }, 1000)

      this.refresh()
    },
    beforeDestroy () {
      this.emptyBg = false
    },
    data () {
      return {
        emptyBg: false,
        choiceTitle: ''
      }
    },
    computed: {
      files: function () {
        return this.$store.state.localFiles
      },
      nbEps: function () {
        return this.files.length
      },
      episodeLabel: function () {
        return this.nbEps === 1
          ? 'episode'
          : 'episodes'
      }
    },
    methods: {
      reduced (text) {
        return text.length > 220 ? text.slice(0, 217) + '...' : text
      },
      playThis (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to play ${item.name} - ${item.ep}. Sending...`)

        // No need to get through store.
        axios.get(`openThis`, {
          params: {
            type: 'video',
            path: item.path,
            dir: this.$store.state.currentDir
          }
        }).then((res) => {
          if (res.status !== 200) { console.log('An error occurred: request to open file ended with a status ' + res.status + '.') }

          this.$store.dispatch('appendHistory', {
            type: 'Play',
            text: item.name
          }).catch(err => { void (err) })
        })
      },
      delThis (item) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to delete ${item.path} - ${item.ep}. Sending...`)

        this.$store.commit('updateLocalFiles', {
          type: 'delete',
          path: item.path
        })

        axios.get(`openThis`, {
          params: {
            type: 'delete',
            path: item.path,
            dir: this.$store.state.currentDir
          }
        }).then((res) => {
          if (res.status !== 200) { console.log('An error occurred: request to delete file ended with a status ' + res.status + '.') }

          this.$store.dispatch('appendHistory', {
            type: 'Delete',
            text: item.name
          }).catch(err => { void (err) })
        }).catch((err) => {
          console.log('An error occurred while trying to delete a file:' + err)
        })
      },
      refresh () {
        this.$store.dispatch('refreshLocal')
      },
      changePath () {
        this.$store.dispatch('changePath')
      },
      resetLocal () {
        this.$store.dispatch('resetLocal')
      },
      showChoices (name) {
        this.choiceTitle = name
        this.$store.commit('setAddToChoice', true)
      }
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active
  {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to
  {
    opacity: 0
  }

  h6
  {
    margin-top: 0.7rem;
    margin-bottom: 0;
  }

  span
  {
    max-width: 100%;
    width: 100%;
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-container
  {
    padding-top: 10px;
    padding-left: 0;
    padding-right: 0;
  }

  /* ------------- MENUBAR ------------- */
  .menubar
  {
    margin-top: 2px;
  }

  .menu-eps-text
  {
    font-size: 16px;
    font-weight: 800;
    margin-top: 12px;
    padding-left: 8%;
  }

  .refresh-button, .change-dir-button
  {
    display: inline-block;
  }

  .reset-cache-button:hover
  {
    border-color: #ff9800 !important;
    background-color: #ff9800 !important;
  }

  .menu-buttons
  {
    display: flex;
    justify-content: center;
  }

  /* -------------- ELEMS -------------- */
  .elem
  {
    margin-bottom: 10px;
    display: inline-block;
  }

  .elem-content
  {
    background-color: rgb(60, 60, 60);
    cursor: default;
  }

  .elem-content:hover
  {
    transition: all 0.25s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .elem-card
  {
    padding: 0 5px 0 0;
  }

  .elem-container
  {
    padding-top: 5px;
  }

  .elem-title
  {
    padding-left: 10px;
    line-height: 30px;
  }

  .elem-ep
  {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ep
  {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
  }

  .buttons-container
  {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
  }

  .play-button
  {
    display: inline;
    margin: 0;
  }

  .genres
  {
    padding-left: 15px;
    font-weight: 600;
  }

  .classification
  {
    padding-right: 10px;
  }

  .picture-container
  {
    height: 220px;
    max-width: 100%;
  }

  .picture
  {
    max-width: 100%;
    height: 220px;
  }

  .bottom-right-container
  {
    position: relative;
    display: flex;
  }

  .synopsis
  {
    padding: 2px 5px 5px 5px;
    text-align: justify;
    display: block;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    height: 9em;
    line-height: 1.5em;
  }

  p.year, p.status, p.mark
  {
    margin-bottom: 0;
  }

  .year
  {
    padding-left: 5px;
    font-weight: 600;
  }

  .status
  {
    text-align: center;
    font-weight: 600;
  }

  .mark
  {
    font-size: large;
    font-weight: 900;
  }

  .empty-message
  {
    margin-top: 5%;
    text-align: center;
  }

  .empty-bg
  {
    position: absolute;
    bottom: 0;
    left: 5%;
  }
</style>
