/**
 * Created by Kylart on 18/03/2017.
 */

const self = this

const path = require('path')
const Vue = require(path.join(__dirname, '..', '..', 'node_modules', 'vue', 'dist', 'vue.js'))

const html = `
<h1>It works!</h1>
`

Vue.component('preferences', {
  template: html
})

const preferences = new Vue({
  el: '#container'
})