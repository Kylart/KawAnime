/**
 * Created by Kylart on 22/11/16.
 */

const remote = require('electron').remote
const main = remote.require(`${__dirname}/../../main.js`)
const mal = require('malapi').Anime



let container = new Vue({
    el: '#container',
    data: {
        showForm: 'v-a'
    },
    components: {
        'v-a': {
            template: `
      <div id="form-container"> 
        <h4>{{ title }}</h4>
        <form action="#" @keydown.enter="gotInfo()">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="sample3" autofocus>
                <label class="mdl-textfield__label" for="sample3">Enter the anime name</label>
            </div>
        </form>
        <div id="buttons-container">
            <button id="back" v-on:click="back()"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                {{ toMain }}
            </button>
            <button id="info" v-on:click="gotInfo()"
                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                {{ bringIt }}
            </button>
        </div>
       </div>`,
            data: function () {
                return {
                    title_: 'Need infos ?',
                    toMain: 'To main page',
                    bringIt: 'Gimme info!'
                }
            },
            computed: {
                title: function () {
                    return this.title_
                }
            },
            methods: {
                back: function () {
                    main.getMainPage()
                },
                gotInfo: function () {
                    console.log('Clicked')
                    container.showForm = 'v-b'
                }
            }
        },
        'v-b': {
            template: `<div id="info-container"><h1>Hello</h1></div>`
        }
    }
})

function makeResearch(name) {
    mal.fromName(name).then(anime => {
        let t0 = performance.now();
        console.log(anime)
        let t1 = performance.now();
        console.log("Information gathered in " + (t1 - t0) + " seconds.")
    })
}


