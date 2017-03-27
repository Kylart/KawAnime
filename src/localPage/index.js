/**
 * Created by Kylart on 04/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the local page.
 *
 */

const self = this

const functions = require('./functions.js')

const html = `
<div>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col top-buttons">
      <div class="mdl-grid">
        <div class="mdl-cell mdl-cell--4-col nb-ep">
          <h6>{{ numberOfEpisodes }} {{ episodeLabel }}
          <md-button class="md-icon-button"
                     @click.native="sort()"
                     v-bind:style="sortButtonStyle"
                     v-if="descendingFilter"
                     v-bind:title="sortButtonTitle">
            <i class="mdi mdi-sort-ascending mdi-24px"></i>
          </md-button>
          <md-button class="md-icon-button"
                     @click.native="sort()"
                     v-bind:style="sortButtonStyle" v-else
                     v-bind:title="sortButtonTitle">
            <i class="mdi mdi-sort-descending mdi-24px"></i>
          </md-button>
          </h6>
        </div>
        <div class="mdl-cell mdl-cell--8-col">
          <md-button class="md-icon-button play-button"
                     @click.native="refreshDir()"
                     title="Refresh current directory."
                     v-bind:style="refreshButtonStyle">
            <i class="mdi mdi-refresh mdi-36px"></i>
          </md-button>
          <md-button @click.native="changeDir()">Change Dir</md-button>
        </div>
      </div>
    </div>
    <template v-for="file in files">
      <div class="mdl-cell mdl-cell--6-col local-elem" v-bind:style="elemStyle">
      <md-ink-ripple></md-ink-ripple>
        <div class="mdl-grid local-info">
          <div class="mdl-cell mdl-cell--6-col">
            <div class="local-title text-ellipsis">
               <h6 class="title-text" v-bind:title="file.title">{{ file.title }}</h6>
            </div>
          </div>
          <div class="mdl-cell mdl-cell--2-col">
            <div class="local-episodes title-text">
            <h6 class="ep-number-text">
              {{ file.episode }}/{{ file.numberOfEpisodes }}
             </h6>
            </div>
          </div>
          <div class="mdl-cell mdl-cell--4-col">
            <div class="local-page-buttons">
              <md-button class="md-icon-button play-button"
                         @click.native="openFile(file.filename)"
                         v-bind:style="playButtonStyle">
                <i class="mdi mdi-play-circle-outline mdi-36px"></i>
              </md-button>
              <md-button class="md-icon-button play-button" 
                         @click.native="delFile(file.filename)"
                         v-bind:style="delButtonStyle">
                <i class="mdi mdi-delete-empty mdi-24px"></i>
              </md-button>
            </div>
          </div>
          <div class="mdl-cell mdl-cell--8-col">
            <p class="genres-text text-ellipsis"
               v-bind:title="file.genres">{{ file.genres }}</p>
          </div>
          <div class="mdl-cell mdl-cell--4-col">
            <p class="classification-text text-ellipsis"
               v-bind:title="file.classification">{{ file.classification }}</p>
          </div>
          <div class="local-pic-synopsis-container">
            <div class="local-picture">
              <img v-bind:src="file.picture">
            </div>
            <div class="synopsis-year-container">
              <div class="local-synopsis">
                {{ file.synopsis }}
              </div>
              <div class="local-year-container">
                <div class="mdl-grid">
                  <div class="mdl-cell mdl-cell--2-col">
                   {{ file.year }}
                  </div>
                  <div class="mdl-cell mdl-cell--7-col text-ellipsis">
                    {{ file.status }}
                  </div>
                  <div class="mdl-cell mdl-cell--3-col">
                    <h5 class="mark">{{ file.mark }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</div>`

Vue.component('local-page', {
  template: html,
  data: function () {
    return {
      elemStyle: {
        marginBottom: '1.5%'
      },
      playButtonStyle: {
        paddingLeft: '2px',
        marginRight: '0px',
        marginLeft: '0px'
      },
      delButtonStyle: {
        paddingLeft: '8px',
        marginLeft: '0px'
      },
      refreshButtonStyle: {
        paddingLeft: '2px',
        marginRight: '0px',
        marginLeft: '0px',
        marginTop: '0.4%'
      },
      sortButtonStyle: {
        paddingLeft: '9px',
        paddingTop: '8px',
        marginTop: '-3%',
        marginLeft: '20%',
        marginRight: '0'
      }
    }
  },
  computed: {
    episodeLabel: function () {
      return this.numberOfEpisodes === 1
          ? 'episode'
          : 'episodes'
    },
    numberOfEpisodes: function () {
      return this.$root.files.length
    },
    files: function () {
      return this.$root.files
    },
    descendingFilter: function () {
      // true corresponds to descending sorting.
      return this.$root.descendingFilter
    },
    sortButtonTitle: function () {
      return this.descendingFilter
          ? 'Sort by ascending episodes.'
          : 'Sort by descending episodes.'
    }
  },
  methods: {
    findFiles: function () {
      return functions.findFiles(this.$root, this.$root.currentDir)
    },
    openFile: function (name) {
      functions.playFile(name)
    },
    delFile: function (name) {
      functions.delFile(this.$root, name)
    },
    changeDir: function () {
      functions.changePathDialog(this.$root)
    },
    refreshDir: function () {
      this.$root.files = []
      this.findFiles()
      console.log("Local files refreshed.")
    },
    sort: function () {
      this.$root.descendingFilter
          ? this.$root.descendingFilter = false
          : this.$root.descendingFilter = true

      functions.sortFiles(this.$root.files, this.$root.descendingFilter)

      console.log("Sorting changed.")
    }
  }
})

exports.localPage = new Vue({
  el: '#local-page',
  data: {
    show: false,
    files: [],
    currentDir: functions.DIR,
    descendingFilter: false
  }
})

// Init
functions.findFiles(self.localPage, self.localPage.currentDir)
console.log("[INIT] Local Files loaded.")