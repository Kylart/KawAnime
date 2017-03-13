/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the news page.
 *
 */

const self = this

const functions = require('./functions')

const html = `
<div class="mdl-grid">
  <div v-for="article in news"
       class="news mdl-cell mdl-cell--12-col mdl-cell--12-col-phone">
    <md-ink-ripple></md-ink-ripple>
    <h5 class="news-title">{{ article.title }}</h5>
    <div class="news-picture" v-bind:style="{content: 'url(' + article.image + ')'}"></div>
    <div class="news-synopsis">
      {{ article.text }}
    </div>
    <md-button @click.native="openLink(article.link)"
               class="md-raised md-primary news-link"
               v-bind:style="buttonStyle">
      Open
    </md-button>
  </div>
</div>`

Vue.component('news', {
  template: html,
  data: function () {
    return {
      buttonStyle: {
        position: 'absolute'  // This has to be reworked.
      }
    }
  },
  computed: {
    news: function () {
      return this.$root.news
    }
  },
  methods: {
    openLink: function (link) {
      event.preventDefault()
      functions.openLink(link)
    }
  }
})

exports.news = new Vue({
  el: '#news-container',
  data: {
    show: false,
    news: []
  }
})

// Init
functions.getNews(self.news)