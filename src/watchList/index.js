/**
 * Created by Kylart on 05/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the watchList page.
 *
 */

const functions = require('./functions.js')

const seeingHtml = `
<div class="mdl-cell mdl-cell--6-col list">
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col list-title"><h4>Seeing</h4></div>
    <div class="mdl-cell mdl-cell--12-col entry-button">
      <form novalidate @submit.stop.prevent="addItem('seeing')">
        <md-input-container v-bind:style="entryStyle">
          <label>New entry</label>
          <md-input @keydown.enter="addItem('seeing')" 
          v-model="seeingEntry"
          style="text-shadow: 0 0 0 rgba(255, 255, 255, 0.8);"></md-input>
        </md-input-container>
      </form>
    </div>
    <div class="mdl-cell mdl-cell--12-col entry-container" v-for="anime in seeing">
      <div class="mdl-grid entry">
        <div class="mdl-cell mdl-cell--8-col entry-name">
          <h6 class="text-ellipsis" v-bind:title="anime">{{ anime }}</h6>
        </div>
        <div class="mdl-cell mdl-cell--4-col entry-options">
          <md-button class="md-icon-button dl-button" 
             @click.native=""
             v-bind:style="dlButtonStyle">
            <i class="mdi mdi-download mdi-36px"></i>
          </md-button>
          <md-button class="md-icon-button play-button" 
             @click.native="delItem(anime, 'seeing')"
             v-bind:style="delButtonStyle">
            <i class="mdi mdi-delete-empty mdi-24px"></i>
          </md-button>
        </div>
      </div>
    </div>
  </div>
</div>`

const seenHtml = `
<div class="mdl-cell mdl-cell--6-col list">
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col list-title"><h4>Seen</h4></div>
    <div class="mdl-cell mdl-cell--12-col entry-button">
      <form novalidate @submit.stop.prevent="addItem('seen')">
        <md-input-container v-bind:style="entryStyle">
          <label>New entry</label>
          <md-input @keydown.enter="addItem('seen')" 
          v-model="seenEntry"
          style="text-shadow: 0 0 0 rgba(255, 255, 255, 0.8);"></md-input>
        </md-input-container>
      </form>
    </div>
    <div class="mdl-cell mdl-cell--12-col entry-container" v-for="anime in seen">
      <div class="mdl-grid entry">
        <div class="mdl-cell mdl-cell--8-col entry-name">
          <h6 class="text-ellipsis" v-bind:title="anime">{{ anime }}</h6>
        </div>
        <div class="mdl-cell mdl-cell--4-col entry-options">
          <md-button class="md-icon-button dl-button" 
             @click.native=""
             v-bind:style="dlButtonStyle">
            <i class="mdi mdi-download mdi-36px"></i>
          </md-button>
          <md-button class="md-icon-button del-button" 
             @click.native="delItem(anime, 'seen')"
             v-bind:style="delButtonStyle">
            <i class="mdi mdi-delete-empty mdi-24px"></i>
          </md-button>
        </div>
      </div>
    </div>
  </div>
</div>`

const watchListHtml = `
<div class="mdl-cell mdl-cell--12-col watch-list">
  <div class="mdl-cell mdl-cell--12-col list-title"><h4>Watch List</h4></div>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col entry-button">
      <form novalidate @submit.stop.prevent="addItem('watchList')">
        <md-input-container v-bind:style="watchListEntryStyle">
          <label>New entry</label>
          <md-input @keydown.enter="addItem('watchList')" 
          v-model="watchListEntry"
          style="text-shadow: 0 0 0 rgba(255, 255, 255, 0.8);"></md-input>
        </md-input-container>
      </form>
    </div>
    <div class="mdl-cell mdl-cell--6-col entry-container" v-for="anime in watchList">
      <div class="mdl-grid entry">
        <div class="mdl-cell mdl-cell--8-col entry-name">
          <h6 class="text-ellipsis" v-bind:title="anime">{{ anime }}</h6>
        </div>
        <div class="mdl-cell mdl-cell--4-col entry-options">
          <md-button class="md-icon-button dl-button" 
             @click.native=""
             v-bind:style="dlButtonStyle">
            <i class="mdi mdi-download mdi-36px"></i>
          </md-button>
          <md-button class="md-icon-button del-button" 
             @click.native="delItem(anime, 'watchList')"
             v-bind:style="delButtonStyle">
            <i class="mdi mdi-delete-empty mdi-24px"></i>
          </md-button>
        </div>
      </div>
    </div>
  </div>
</div>`

const html = `
<div>
  <!--TODO: Wait for material-vue 0.8.0 to make md-tabs background color as wanted.-->
  <!--See renanhangai's comment https://github.com/marcosmoura/vue-material/issues/202-->
  <md-theme md-name="watchList">
        <div class="mdl-grid">
          ${watchListHtml}
          ${seenHtml}
          ${seeingHtml}
        </div>
  </md-theme>
</div>
`

Vue.component('watch-list', {
  template: html,
  data: function () {
    return {
      seeing: [],
      seen: [],
      watchList: [],
      seeingEntry: '',
      seenEntry: '',
      watchListEntry: '',
      entryStyle: {
        width: '60%'
      },
      watchListEntryStyle: {
        width: '40%'
      },
      dlButtonStyle: {
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
    addItem: function (listName) {
      functions.addItem(this, listName)
      functions.saveLists(this)
    },
    delItem: function (name, listName) {
      functions.delItem(this, name, listName)
      functions.saveLists(this)
    }
  },
  created: function () {
    functions.loadLists(this)
  }
})