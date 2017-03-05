/**
 * Created by Kylart on 05/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the watchList page.
 *
 */

const functions = require('./functions.js')

const html = `
<div>
<md-tabs md-fixed>
  <md-tab id="anime-tab" md-label="Animes">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
  </md-tab>

  <md-tab id="movie-tab" md-label="Movies">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
  </md-tab>
</md-tabs>
</div>
`

Vue.component('watch-list', {
  template: html,
  data: function () {
    return {
      seeing: [],
      seen: [],
      watchList: []
    }
  },
  methods: function () {

  }
})