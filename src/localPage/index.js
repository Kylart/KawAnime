/**
 * Created by Kylart on 04/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the local page.
 *
 */

const functions = require('./functions.js')

const html = `
<div>
  <h1>{{ message }}</h1>
</div>`

Vue.component('local-page', {
  template: html,
  data: function () {
    return {
      message: "Hello"
    }
  },
  methods: {
    findFiles: function () {
      return functions.findFiles()
    }
  }
})