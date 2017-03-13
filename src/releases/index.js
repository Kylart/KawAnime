/**
 * Created by Kylart on 13/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the releases page.
 *
 */

const self = this

const functions = require('./functions')

const path = require('path')
const renderer = require(path.join(__dirname, '..', 'renderer.js'))
const {searchThisFrom} = require(path.join(__dirname, '..', 'infoPage', 'functions.js'))

const html = `
<div id="releases" class="mdl-grid">
  <div class="mdl-cell mdl-cell--12-col button-container">
    <md-button class="md-icon-button play-button"
               @click.native="refresh()"
               title="Refresh"
               v-bind:style="refreshButtonStyle">
      <i class="mdi mdi-refresh mdi-36px"></i>
    </md-button>
  </div>
  <template v-for="release in releases">
    <div class="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet">
      <div class="elem">
        <md-ink-ripple></md-ink-ripple>
        <h6  v-bind:title="release.title">{{ release.title }}</h6>
        <div class="picture-container">
          <div class="picture"
               v-bind:style="{ content : 'url(' + release.picture + ')'}"></div>
        </div>
        <div class="text-container" v-bind:title="release.synopsis">
          <div class="synopsis ">
            <p>{{ release.reducedSynopsis }}</p>
          </div>
        </div>
        <div class="links">
          <md-button v-if="prefMagnets"
                     v-bind:href="release.magnetLink"
                     class="md-dense link-download"
                     v-bind:style="styleButton">
            <p style="margin-top: 4px;">Download</p>
          </md-button>
          <md-button v-else
                     @click.native="download(release.link, release.realTitle)"
                     class="md-dense link-download"
                     v-bind:style="styleButton">
            <p>Download</p>
          </md-button>
          <md-button @click.native="searchThis(release.researchName)"
                     class="md-dense link-more"
                     v-bind:style="styleButton">
            <p>More</p>
          </md-button>
        </div>
      </div>
    </div>
  </template>
</div>`

Vue.component('releases', {
  template: html,
  data: function () {
    return {
      prefMagnets: true,
      styleButton: {
        minWidth: '0px',
        marginBottom: '0px',
        marginTop: '0px',
        marginLeft: '2px',
        marginRight: '2px'
      },
      refreshButtonStyle: {
        paddingLeft: '2px',
        marginRight: '0px',
        marginLeft: '0px',
        marginTop: '0.4%',
        color: 'rgba(255, 255, 255, 0.8)'
      }
    }
  },
  computed: {
    releases: function () {
      return this.$root.releases
    }
  },
  methods: {
    download: function (url, name) {
      if (!this.prefMagnets)
        startTorrent(url, name)
    },
    refresh: function () {
      functions.getLatest()
    },
    searchThis: function (arg) {
      this.$root.show = false
      renderer.loader.loader.show = true
      searchThisFrom(renderer.lastPage, arg, () => {
        renderer.loader.loader.show = false
      })
    }
  }
})

exports.releases = new Vue({
  el: '#releases-container',
  data: {
    show: false,
    releases: []
  }
})