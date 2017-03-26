/**
 * Created by Kylart on 18/03/2017.
 */

const self = this

const functions = require('./functions.js')

const path = require('path')
const fs = require('fs')
const os = require('os')
const {dialog} = require('electron').remote

const Vue = require(path.join(__dirname, '..', '..', 'node_modules', 'vue', 'dist', 'vue.js'))

const VueMaterial = require('vue-material')

Vue.use(VueMaterial)

Vue.material.registerTheme({
  default: {
    primary: 'indigo',
    accent: 'pink',
    warn: 'deep-orange',
    background: 'cyan'
  },
})

const snackBar = `
<md-snackbar :md-position="vertical + ' ' + horizontal" ref="snackbar" :md-duration="duration">
  <span>This configuration was successfully saved!</span>
  <md-button class="md-accent" @click.native="close()">Thanks!</md-button>
</md-snackbar>
`

const html = `
<div class="container dragable">
  ${snackBar}
  <md-layout md-gutter class="section">
    <md-layout md-flex="100" style="position: relative">
      <h3>Downloads</h3>
      <md-button v-bind:style="saveButtonStyle" 
                  class="md-raised non-dragable"
                  @click.native="saveConf()">Save</md-button>
      <md-button v-bind:style="closeButtonStyle"
                  class="md-raised non-dragable"
                  @click.native="close()">Close</md-button>
    </md-layout>
    <md-layout md-flex="35">
      <md-input-container class="fansub-selector">
        <label for="fansub"><h6>Preferred Fansub</h6></label>
        <md-select name="fansub" id="fansub" v-model="config.fansub">
          <md-option value="HorribleSubs">HorribleSubs</md-option>
          <md-option value="PuyaSubs!">PuyaSubs!</md-option>
        </md-select>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="65" class="quality-text">
      <md-layout md-gutter>
        <md-layout md-flex="100" class="quality-title">
          <h6>Quality</h6>
        </md-layout>
        <md-layout md-flex="100">
          <md-layout md-gutter>
            <md-layout md-flex="33">
              <md-radio v-model="config.quality"
                        id="480p"
                        name="480p"
                        md-value="480p"><h6>480p</h6>
              </md-radio>
            </md-layout>
            <md-layout md-flex="33">
              <md-radio v-model="config.quality"
                        id="720p"
                        name="720p"
                        md-value="720p"><h6>720p</h6>
              </md-radio>
            </md-layout>
            <md-layout md-flex="33">
              <md-radio v-model="config.quality"
                        id="1080p"
                        name="1080p"
                        md-value="1080p"><h6>1080p</h6>
              </md-radio>
            </md-layout>
          </md-layout>
        </md-layout>
      </md-layout>
    </md-layout>
    <md-layout md-flex="10"></md-layout>
    <md-layout md-flex="40">
      <md-input-container class="sound-selector">
        <label for="sound"><h6>Preferred sound on magnet download</h6></label>
        <md-select name="sound" id="sound" v-model="config.sound">
          <md-option value="Nyanpasu">Nyanpasu</md-option>
          <md-option value="None">None</md-option>
        </md-select>
      </md-input-container>
    </md-layout>
    <md-layout md-flex="10"></md-layout>
    <md-layout md-flex="10" class="play-button non-dragable">
      <md-button class="md-icon-button"
                 @click.native="playThis()"
                 v-bind:style="playButtonStyle">
        <i class="mdi mdi-play-circle-outline mdi-36px"></i>
      </md-button>
    </md-layout>
    <md-layout md-flex="30"></md-layout>
  </md-layout>
  <md-layout md-gutter class="section">
    <md-layout md-flex="100">
      <h3>Local</h3>
    </md-layout>
    <md-layout md-flex="100"><h6>Preferred directory</h6></md-layout>
    <md-layout md-flex="30">
      <md-button class="choose-path-button" @click.native="openDialog()">Choose</md-button>
    </md-layout>
    <md-layout md-flex="70" class="local-path-text"><h6>Current: {{ config.localPath }}</h6></md-layout>
  </md-layout>
  <md-layout md-gutter class="section">
    <md-layout md-flex="100">
      <h3>News</h3>
    </md-layout>
    <md-layout md-flex="55">
       <h6>Open link inside KawAnime's main window ?</h6>
    </md-layout>
    <md-layout md-flex="45">
      <md-layout md-gutter>
        <md-layout md-flex="50">
          <md-radio v-model="config.inside"
                    md-value="true"><h6>Inside</h6>
          </md-radio>
        </md-layout>
        <md-layout md-flex="50">
          <md-radio v-model="config.inside"
                    md-value="outside"><h6>Outside</h6>
          </md-radio>
        </md-layout>
      </md-layout>
    </md-layout>
  </md-layout>
</div>
`

Vue.component('preferences', {
  template: html,
  data: function () {
    return {
      config: {
        fansub: 'HorribleSubs',
        quality: '720p',
        sound: 'Nyanpasu',
        localPath: path.join(os.userInfo().homedir, 'Downloads'),
        inside: true
      },
      vertical: 'bottom',
      horizontal: 'center',
      duration: 1000,
      playButtonStyle: {
        paddingLeft: '2px',
        marginRight: '0px',
        marginLeft: '0px'
      },
      saveButtonStyle: {
        position: 'absolute',
        top: '5px',
        right: '105px'
      },
      closeButtonStyle: {
        position: 'absolute',
        top: '5px',
        right: '5px'
      }
    }
  },
  mounted: function () {
    functions.loadConf(this)
  },
  methods: {
    openDialog: function () {
      dialog.showOpenDialog({properties: ['openDirectory']}, (dirPath) => {
        if (dirPath !== undefined)
        {
          this.config.localPath = dirPath[0]
        }
      })
    },
    playThis: function () {
      functions.playSound(this.config.sound)
    },
    close: function () {
      window.close()
    },
    saveConf: function () {
      functions.saveConfig(this)
    }
  }
})

const preferences = new Vue({
  el: '#app'
})