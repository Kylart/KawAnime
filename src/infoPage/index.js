/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the information page.
 *
 */

const self = this

exports.functions = require('./functions.js')

const path = require('path')
const renderer = require(path.join(__dirname, '..', 'renderer.js'))

const html = `
<div>
  <md-button @click.native="back()"
             id="back-button" class="md-raised md-accent">
    Back
  </md-button>
  <div class="mdl-grid">
    <div id="info-picture"
         class="mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet">
      <div v-bind:style="{ content: 'url(' + infos.image + ')'}"></div>
    </div>
    <div id="title-synopsis-container" class="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet">
      <div id="info-title" >
        <h5>{{ infos.title }} [{{ infos.type }}]</h5>
      </div>
      <div id="synopsis-container" >
        <pre>{{ infos.synopsis }}</pre>
      </div>
    </div>
    <div class="infos-bottom-left mdl-cell mdl-cell--3-col mdl-cell--4-col-phone ">
      <h6>Japanese title: </h6>
      <h6 class="infos-japTitle">{{ infos.japTitle }}</h6>
      <h6>{{ infos.episodes }} episodes</h6>
      <h6>{{ infos.status }}</h6>
      <p class="airing">{{ infos.aired }}</p>
    </div>
    <div class="infos-bottom-middle mdl-cell mdl-cell--7-col mdl-cell--6-col-phone">
      <div class="studios ">
        <h6>Studios</h6>
        <ul>
          <li v-for="studio in infos.studios">{{ studio }}</li>
        </ul>
      </div>
      <div class="genres ">
        <h6 class="infos-genresTitle">Genres</h6>
        <ul>
          <li v-for="genre in infos.genres" >
            {{ genre }}
          </li>
        </ul>
      </div>
    </div>
    <div class="infos-bottom-right mdl-cell mdl-cell--2-col mdl-cell--2-col-phone">
      <div class="infos-bottom-right-inside">
        <h6 >Score:</h6>
        <h4 >{{ infos.stats.score.value }}</h4>
        <h5 >{{ infos.stats.ranking }}</h5>
      </div>
    </div>
    <div class="characters mdl-cell mdl-cell--12-col mdl-cell--12-col-phone">
      <h5>Characters</h5>
      <div class="mdl-grid">
        <div v-for="character in infos.characters"
             class="character mdl-cell mdl-cell--3-col mdl-cell--6-col-phone">
          <h6 class="character-name ">{{ character.name }}</h6>
          <h6 class="seiyuu-name ">by {{ character.actor }}</h6>
        </div>
      </div>
    </div>
  </div>
</div>`

Vue.component('info', {
  template: html,
  computed: {
    infos: function () {
      return this.$root.infos
    }
  },
  methods: {
    back: function () {
      this.$root.show = false

      switch (renderer.lastPage)
      {
        case "downloader":
          renderer.downloader.downloader.show = true;
          renderer.setDownloaderBackground()
          break

        case "local":
          renderer.localPage.localPage.show = true
          break

        case "news":
          renderer.news.news.show = true
          break

        case "releases":
          renderer.releases.releases.show = true
          break

        case "seasonInfo":
          renderer.season.season.show = true
          break

        case "watchList":
          renderer.watchList.watchList.show = true
          break

        default:
          break
      }
    }
  }
})

exports.infoPage = new Vue({
  el: '#info-container',
  data: {
    show: false,
    infos: {}
  }
})

