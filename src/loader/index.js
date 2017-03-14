/**
 * Created by Kylart on 13/03/2017.
 *
 * In this file is present the vue object to render this HTML part
 * of the loader page.
 *
 */

const self = this

const html = `
<div>
  <div class="loading-text">
    <h3>少々お待ち下さい。</h3>
  </div>
  <div class="loader-gif"></div>
</div>`

Vue.component('loader', {
  template: html
})

exports.loader = new Vue({
  el: '#loader-container',
  data: {
    show: true
  }
})