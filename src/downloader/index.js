/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the downloader.
 *
 */

const self = this

// To open files
const shell = require('electron').shell
const path = require('path')
const fs = require('fs')
const os = require('os')

const DIR = path.join(os.userInfo().homedir, '.KawAnime')

const functions = require('./functions.js')

const html = `<div>
          <div id="footer-back-left"></div>
          <div id="footer-back-right"></div>

          <div class="downloader-header"></div>
          <div class="mdl-grid mdl-layout__content mdl-typography--text-center downloader-form-container">
            <div class="dummy-cell mdl-cell mdl-cell--12-col"></div>
            <div class="mdl-cell mdl-cell--12-col">
              <form novalidate @submit.stop.prevent="animeNameNext">
                <md-input-container id="anime-name" class="downloader-input">
                  <label><p>Name of the anime...</p></label>
                  <md-input autofocus v-model="animeName" id="animeName-input"
                            style="color: rgba(255, 255, 255, 0.8);text-shadow: 0 0 0 rgba(255, 255, 255, 0.8); "></md-input>
                </md-input-container>
              </form>
            </div>

            <div class="mdl-cell mdl-cell--12-col">
              <form novalidate @submit.stop.prevent="fromEpNext" @keydown.delete="fromEpPrevious">
                <md-input-container id="fromEp" class="downloader-input">
                  <label><p>From episode...</p></label>
                  <md-input type="number"
                            v-model="fromEp"
                            id="fromEp-input"
                            style="text-shadow: 0 0 0 rgba(255, 255, 255, 0.8)"></md-input>
                </md-input-container>
              </form>
            </div>
            <div class="mdl-cell mdl-cell--12-col">
              <form novalidate @submit.stop.prevent="untilEpNext" @keydown.delete="untilEpPrevious">
                <md-input-container id="untilEp" class="downloader-input">
                  <label><p>Until episode...</p></label>
                  <md-input type="number"
                            v-model="untilEp"
                            id="untilEp-input"
                            style="text-shadow: 0 0 0 rgba(255, 255, 255, 0.8)"></md-input>
                </md-input-container>
              </form>
            </div>

            <div class="mdl-cell mdl-cell--12-col">
              <md-theme md-name="radio">
                <div class="mdl-grid">
                  <div class="mdl-cell mdl-cell--4-col">
                    <md-radio v-model="quality"
                              id="480p"
                              name="480p"
                              md-value="480p"><h6>480p</h6>
                    </md-radio>
                  </div>
                  <div class="mdl-cell mdl-cell--4-col">
                    <md-radio v-model="quality"
                              id="720p"
                              name="720p"
                              md-value="720p"><h6>720p</h6>
                    </md-radio>
                  </div>
                  <div class="mdl-cell mdl-cell--4-col">
                    <md-radio v-model="quality"
                              id="1080p"
                              name="1080p"
                              md-value="1080p"><h6>1080p</h6>
                    </md-radio>
                  </div>
                </div>
              </md-theme>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--3-col mdl-cell--3-offset download-button">
              <md-button id="downloader-button"
                         class="md-raised"
                         @click.native="download()">
                <h6>Download!</h6>
              </md-button>
            </div>
            <div class="mdl-cell mdl-cell--3-col download-button">
              <md-button id="magnet-downloader-button"
                         class="md-raised"
                         @click.native="downloadMagnets()">
                <h6>Get Magnets!</h6>
              </md-button>
            </div>
            <div class="mdl-cell mdl-cell--12-col">
              <md-snackbar :md-position="vertical + ' ' + horizontal" ref="snackbar" :md-duration="duration">
                <span>Your magnets are ready, you can open them </span>
                <md-button class="md-accent"
                           md-theme="light-blue"
                           @click.native="openMagnets()">Here!</md-button>
              </md-snackbar>
            </div>
          </div>
        </div>`

Vue.component('downloader', {
  template: html,
  data: function () {
    return {
      show: self.show,
      display: "none",
      quality: '720p',
      animeName: '',
      fromEp: '',
      untilEp: '',
      vertical: 'top',
      horizontal: 'center',
      duration: '4000'
    }
  },
  computed: {},
  methods: {
    download: function () {
      functions.download(this)

      this.untilEp = ''
      this.fromEp = ''
      this.animeName = ''
    },
    downloadMagnets: function () {
      functions.downloadMagnets(this)
    },
    openSnackbar: function () {
      this.$refs.snackbar.open();
    },
    openMagnets: function () {
      this.$refs.snackbar.close()

      shell.openItem(path.join(DIR, 'magnets.txt'))
    },
    animeNameNext: function () {
      document.getElementById('fromEp-input').focus()
    },
    fromEpNext: function () {
      document.getElementById('untilEp-input').focus()
    },
    untilEpNext: function () {
      document.getElementById('animeName-input').focus()
      document.getElementById('downloader-button').click()
    },
    fromEpPrevious: function () {
      if (this.fromEp === '')
        document.getElementById('animeName-input').focus()
    },
    untilEpPrevious: function () {
      if (this.untilEp === '')
        document.getElementById('fromEp-input').focus()
    }
  }
})

exports.downloader = new Vue({
  el: '#download-container',
  data: {
    show: false
  }
})