/**
 * Created by Kylart on 04/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the local page.
 *
 */

const functions = require('./functions.js')

const html = `
<div>
  <div class="mdl-grid">
    <template v-for="file in files">
      <div class="mdl-cell mdl-cell--6-col local-elem" v-bind:style="elemStyle">
        <div class="mdl-grid local-info">
          <div class="mdl-cell mdl-cell--7-col">
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
          <div class="mdl-cell mdl-cell--3-col">
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
                <div class="local-year">
                  <div class="local-status">
                    {{ file.status }}
                  </div>
                  <div class="local-year-text">
                    {{ file.year }}
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
      files: [],
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
      }
    }
  },
  methods: {
    findFiles: function () {
      return functions.findFiles(this)
    },
    openFile: function (name) {
      functions.playFile(name)
    },
    delFile: function (name) {
      functions.delFile(this, name)
    }
  },
  created: function () {
    this.findFiles()
  }
})