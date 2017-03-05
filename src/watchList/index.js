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
  <!--TODO: Wait for material-vue 0.8.0 to make md-tabs background color as wanted.-->
  <!--See renanhangai's comment https://github.com/marcosmoura/vue-material/issues/202-->
  <md-theme md-name="watchList">
    <md-tabs md-fixed>
      <md-tab id="anime-tab" md-label="Animes">
        <div class="mdl-grid">
          <div class="mdl-cell mdl-cell--6-col">
            <div class="mdl-grid">
              <div class="dummy-cell mdl-cell mdl-cell--4-col"></div>
              <div class="mdl-cell mdl-cell--8-col">
                
              </div>
              <div class="mdl-cell mdl-cell--6-col" 
                   v-for="anime in seeing">
                {{ anime }}
              </div>
            </div>
          </div>
          <div class="mdl-cell mdl-cell--6-col">
            <div class="mdl-grid">
              <div class="mdl-cell mdl-cell--6-col" 
                   v-for="anime in seeing">
                {{ anime }}
              </div>
            </div>
          </div>
        </div>
      </md-tab>
    
      <md-tab id="movie-tab" md-label="Movies">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt dolorum quas amet cum vitae, omnis! Illum quas voluptatem, expedita iste, dicta ipsum ea veniam dolore in, quod saepe reiciendis nihil.</p>
      </md-tab>
    </md-tabs>
  </md-theme>
</div>
`

Vue.component('watch-list', {
  template: html,
  data: function () {
    return {
      seeing: ['sdgf', 'agg', 'agg', 'agg', 'agg', 'agg', 'agg'],
      seen: ['agg', 'agg', 'agg', 'agg', 'agg', 'agg', 'agg', 'agg'],
      watchList: []
    }
  },
  methods: function () {

  }
})