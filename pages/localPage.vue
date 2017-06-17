<template>
  <v-container fluid class="container">
    <div v-if="files.length">
      <v-row style="margin: 0 1% 0 1%;">
        <v-col xs12 class="menubar">
          <v-row>
            <v-col xs2 class="menu-eps">
              <p class="menu-eps-text">{{ nbEps }} {{ episodeLabel }}</p>
            </v-col>
            <v-col xs2>
              <history-modal></history-modal>
            </v-col>
            <v-col xs4></v-col>
            <v-col xs4 class="menu-buttons">
              <v-btn icon
                     class="refresh-button"
                     @click.native="refresh()">
                <v-icon large>refresh</v-icon>
              </v-btn>
              <v-btn flat dark
                     @click.native="changePath()"
                     class="change-dir-button">
                Change dir
              </v-btn>
              <v-btn secondary dark
                     @click.native="resetLocal()"
                     class="reset-cache-button">
                Reset local info
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <template v-for="item in files">
          <v-col xs12 md6 xl4
                 class="elem">
            <v-card class="elem-content elevation-3" v-ripple="true">
              <v-card-text class="elem-card">
                <v-container fluid style="padding: 0;">
                  <v-row class="elem-container">
                    <v-col xs7
                           v-tooltip:top="{ html: item.name }"
                           class="elem-title">
                      <h6 class="title ellipsis">{{ item.name }}</h6>
                    </v-col>
                    <v-col xs2
                           v-tooltip:top="{ html: 'Episode ' + item.ep }"
                           class="elem-ep text-xs-right">
                      <p class="ellipsis ep">{{ item.ep }} / {{ item.numberOfEpisode }}</p>
                    </v-col>
                    <v-col xs3>
                      <v-btn large icon
                             class="play-button"
                             @click.native="playThis(item.path)">
                        <v-icon large>play_circle_outline</v-icon>
                      </v-btn>
                      <v-btn medium icon
                             class="delete-button"
                             @click.native="delThis(item.path)">
                        <v-icon medium>delete_forever</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col xs8 v-tooltip:top="{ html: item.genres.join(', ') }">
                      <p class="ellipsis genres">{{ item.genres.join(', ') }}</p>
                    </v-col>
                    <v-col xs4 v-tooltip:top="{ html: item.classification.replace('None', 'No restriction') }">
                      <p class="ellipsis classification">{{ item.classification.replace('None', 'No restriction')
                        }}</p>
                    </v-col>
                    <v-col xl5 lg4 md5 sm3 xs4 class="picture-container">
                      <img :src="item.picture" class="picture" height="220">
                    </v-col>
                    <v-col xl7 lg8 md7 sm9 xs8 class="bottom-right-container">
                      <p class="synopsis">{{ reduced(item.synopsis) }}</p>
                      <v-row>
                        <v-col xs2>
                          <p class="year">{{ item.year }}</p>
                        </v-col>
                        <v-col xs7>
                          <p class="status">{{ item.status }}</p>
                        </v-col>
                        <v-col xs3><p class="mark">{{ item.mark }}</p></v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </div>
    <v-container fluid v-else>
      <img class="empty-bg" height="400" src="~static/images/empty-bg.png"/>
      <v-row>
        <v-col xs12 class="menubar">
          <v-row>
            <v-col xs9></v-col>
            <v-col xs3 class="menu-buttons">
              <v-btn icon
                     class="refresh-button"
                     @click.native="refresh()">
                <v-icon large>refresh</v-icon>
              </v-btn>
              <v-btn flat dark
                     @click.native="changePath()"
                     class="change-dir-button">
                Change dir
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12 class="empty-message">
          <h3>Wow such empty!</h3>
          <h4>Start downloading anime
            <nuxt-link to="/downloader" class="green--text">here</nuxt-link>
            or <nuxt-link to="/" class="cyan--text">here!</nuxt-link>
          </h4>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
  import HistoryModal from '~components/historyModal.vue'
  import axios from 'axios'

  export default {
    data () {
      return {}
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
    components: {
      HistoryModal
    },
    methods: {
      reduced (text) {
        return text.length > 220 ? text.slice(0, 217) + '...' : text
      },
      playThis (path) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to play ${path}. Sending...`)

        // No need to get through store.
        axios.get(`openThis?type=video&path=${path}&dir=${this.$store.state.currentDir}`).then((res) => {
          if (res.status !== 200) { console.log('An error occurred: request to open file ended with a status ' + res.status + '.') }

          this.$store.dispatch('appendHistory', {
            type: 'Play',
            text: path.split(' ').slice(1, -1).join(' ')
          }).catch(err => { void (err) })
        })
      },
      delThis (path) {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Requested to delete ${path}. Sending...`)

        axios.get(`openThis?type=delete&path=${path}&dir=${this.$store.state.currentDir}`).then((res) => {
          if (res.status !== 200) { console.log('An error occurred: request to delete file ended with a status ' + res.status + '.') }

          this.$store.dispatch('appendHistory', {
            type: 'Delete',
            text: path.split(' ').slice(1, -1).join(' ')
          }).catch(err => { void (err) })
        }).catch((err) => {
          console.log('An error occurred while trying to delete a file:' + err)
        })

        this.$store.dispatch('refreshLocal')
      },
      refresh () {
        this.$store.dispatch('refreshLocal')
      },
      changePath () {
        this.$store.dispatch('changePath')
      },
      resetLocal () {
        this.$store.dispatch('resetLocal')
      }
    }
  }
</script>

<style scoped>
  h6
  {
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.4rem;
    margin-bottom: 0;
  }

  /* Needed */
  /*noinspection CssUnusedSymbol*/
  .icon--large, .icon--medium
  {
    height: 2.5rem;
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ------------- MENUBAR ------------- */
  .menubar
  {
    margin-top: 2px;
  }

  .menu-eps-text
  {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 800;
    margin-top: 12px;
    padding-left: 8%;
  }

  .menu-buttons
  {
    display: inline-block;
    text-align: center;
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

  /* -------------- ELEMS -------------- */
  .elem
  {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 10px;
  }

  .elem-content
  {
    background-color: rgb(60, 60, 60);
    cursor: default;
  }

  .elem-content:hover
  {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .elem-card
  {
    padding: 0 10px 0 0;
  }

  .elem-container
  {
    padding-top: 5px;
  }

  .title
  {
    padding-left: 10px;
    line-height: 30px;
  }

  .ep
  {
    margin-top: 10px;
    font-size: 15px;
    font-weight: 800;
  }

  .play-button
  {
    display: inline;
    margin: 0;
  }

  .delete-button
  {
    display: inline;
    margin: 0;
  }

  .genres
  {
    padding-left: 15px;
    font-weight: 600;
  }

  .picture-container
  {
    height: 220px;
    max-width: 100%;
  }

  .picture
  {
    max-width: 100%;
  }

  .synopsis
  {
    padding: 2px 5px 5px 5px;
    text-align: justify;
    height: 175px;
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
    margin-top: -5px;
    font-size: large;
    font-weight: 900;
  }

  .empty-message
  {
    margin-top: 5%;
    text-align: center;
  }

  .empty-message h3,h4
  {
    color: rgba(255, 255, 255, 0.8);
  }

  .empty-bg
  {
    position: absolute;
    bottom: 0;
    left: 5%;
  }
</style>
