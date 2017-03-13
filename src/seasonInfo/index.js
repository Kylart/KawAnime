/**
 * Created by Kylart on 01/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the season displayer.
 *
 */

const self = this

exports.show = false

const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')

const functions = require('./functions')

Vue.component('season-info', {
  template: html,
  data: function () {
    return {
      searching: false,
      season: functions.getCurrentSeason().season,
      year: functions.getCurrentSeason().year,
      link: {
        marginTop: 0,
        marginBottom: 0,
        float: 'right'
      },
      scoreStyle: {
        margin: '0 0 0 0',
      },
      textStyle: {
        marginLeft: '35%',
        height: '50%'
      },
      synopsisStyle: {
        paddingRight: '0',
        textAlign: 'justify',
        paddingTop: '5px',
        height: '123.5px'
      },
      pictureStyle: {
        position: 'absolute',
        bottom: 0
      }
    }
  },
  computed: {
    TVs: function () {
      return this.$root.TVs
    },
    ONAs: function () {
      return this.$root.ONAs
    },
    OVAs: function () {
      return this.$root.OVAs
    },
    Movies: function () {
      return this.$root.Movies
    },
    Specials: function () {
      return this.$root.Specials
    },
  },
  methods: {  // Some functions need some rework
    reduced: function (text, nb) {
      return functions.reduceString(text, nb)
    },
    getGenres: function (genres) {
      let result = ''

      genres.forEach((elem) => {
        result += `${elem}, `
      })

      return result.slice(0, -2)
    },
    searchThis: function (arg) {
      functions.searchThis(arg)
    },
    getThisSeason: function (year, season) {
      // TODO
    }
  }
})

exports.season = new Vue({
  el: '#season-info-container',
  data: {
    show: false,
    TVs: [],
    ONAs: [],
    OVAs: [],
    Movies: [],
    Specials: [],
  }
})