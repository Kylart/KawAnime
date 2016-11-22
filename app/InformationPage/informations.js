/**
 * Created by Kylart on 22/11/16.
 */

const remote = require('electron').remote
const main = remote.require(`${__dirname}/../../main.js`)
const mal = require('malapi').Anime
const ProgressBar = require('progressbar.js');


// let container = new Vue({
//     el: '#container',
//     data: {
//         showForm: 'v-a'
//     },
//     components: {
//         'v-a': {
//             template: `
//       <div id="form-container">
//         <h4>{{ title }}</h4>
//         <form action="#" @keydown.enter="gotInfo()">
//             <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
//                 <input class="mdl-textfield__input" type="text" id="sample3" autofocus>
//                 <label class="mdl-textfield__label" for="sample3">Enter the anime name</label>
//             </div>
//         </form>
//         <div id="buttons-container">
//             <button id="back" v-on:click="back()"
//                     class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
//                 {{ toMain }}
//             </button>
//             <button id="info" v-on:click="gotInfo()"
//                     class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
//                 {{ bringIt }}
//             </button>
//         </div>
//        </div>`,
//             data: function () {
//                 return {
//                     title_: 'Need infos ?',
//                     toMain: 'To main page',
//                     bringIt: 'Gimme info!'
//                 }
//             },
//             computed: {
//                 title: function () {
//                     return this.title_
//                 }
//             },
//             methods: {
//                 back: function () {
//                     main.getMainPage()
//                 },
//                 gotInfo: function () {
//                     console.log('Clicked')
//                     container.showForm = 'v-b'
//                 },
//                  getDownloader: function () {
//                      main.openDownloader()
//                  }
//             }
//         },
//         'v-b': {
//             template: `<div id="info-container"><h1>Hello</h1></div>`
//         }
//     }
// })

function makeResearch(name) {
    mal.fromName(name).then(anime => {
        let t0 = performance.now();
        console.log(anime)
        let t1 = performance.now();
        console.log("Information gathered in " + (t1 - t0) + " seconds.")
    })
}

let sakuraTrick = {
    title: 'Sakura Trick',
    japaneseTitle: '桜Trick',
    image: 'https://myanimelist.cdn-dena.com/images/anime/2/56189.jpg',
    synopsis: 'Love is in the air when the story of Sakura Trick begins. Haruka Takayama and Yuu Sonoda were best' +
    ' friends in middle school, and are now attending Misato West High School together. They are assigned to the same class in their first year, but are given seats on opposite sides of the room! If that wasn\'t enough, it is announced at the entrance ceremony that the school will be closed in three years. This doesn\'t bother either of them, as they still plan on having lots of fun together during their high school years.\r\n\r\nHaruka gets jealous of Yuu making new friends though, so the two decide to deepen their bond. "Let\'s do something we\'d never do with other girls," Yuu says, and they share a kiss in a vacant classroom after school one day. After that one kiss leads to many kisses, the two begin to realize that the relationship they share has changed completely. But what will happen to their relationship once a disapproving older sister begins to suspect that something is going on between the two?',
    episodes: '12',
    studio: [ 'Studio Deen' ],
    stats: { score: { value: '7.20', count: '50,078' },
        popularity: '#500',
        members: '106,584',
        favorites: '899',
        ranking: '#2648' },
    genres: [ 'Slice of Life',
        'Comedy',
        'Romance',
        'School',
        'Seinen',
        'Shoujo Ai' ],
    status: 'Finished Airing',
    aired: 'Jan 10, 2014 to Mar 28, 2014',
    type: 'TV'
}

let container = new Vue({
    el: '#container-',
    data: {
        title: 'Sakura Trick',
        japaneseTitle: '桜Trick',
        image: 'https://myanimelist.cdn-dena.com/images/anime/2/56189.jpg',
        synopsis: 'Love is in the air when the story of Sakura Trick begins. Haruka Takayama and Yuu Sonoda were best' +
        ' friends in middle school, and are now attending Misato West High School together. They are assigned to the same class in their first year, but are given seats on opposite sides of the room! If that wasn\'t enough, it is announced at the entrance ceremony that the school will be closed in three years. This doesn\'t bother either of them, as they still plan on having lots of fun together during their high school years.\r\n\r\nHaruka gets jealous of Yuu making new friends though, so the two decide to deepen their bond. "Let\'s do something we\'d never do with other girls," Yuu says, and they share a kiss in a vacant classroom after school one day. After that one kiss leads to many kisses, the two begin to realize that the relationship they share has changed completely. But what will happen to their relationship once a disapproving older sister begins to suspect that something is going on between the two?',
        episodes: '12',
        studios: [ 'Studio Deen' ],
        stats: { score: '7.20',
            popularity: '#500',
            members: '106,584',
            favorites: '899',
            ranking: '#2648' },
        genres: [ 'Slice of Life',
            'Comedy',
            'Romance',
            'School',
            'Seinen',
            'Shoujo Ai' ],
        status: 'Finished Airing',
        aired: 'Jan 10, 2014 to Mar 28, 2014',
        type: 'TV',
        characters: [
            { name: 'Takayama, Haruka',
                role: 'Main',
                actor: 'Tomatsu, Haruka',
                language: 'Japanese' },
                { name: 'Sonoda, Yuu',
                    role: 'Main',
                    actor: 'Iguchi, Yuka',
                    language: 'Japanese' },
                { name: 'Ikeno, Kaede',
                    role: 'Main',
                    actor: 'Fuchigami, Mai',
                    language: 'Japanese' },
                { name: 'Iizuka, Yuzu',
                    role: 'Main',
                    actor: 'Toda, Megumi',
                    language: 'Japanese'
                }
            ],
        staff : [
            { name: 'Ishikura, Kenichi', role: [ 'Director',
                                        'Episode Director',
                                        'Storyboard',
                                        'Series Composition' ] },
            { name: 'Ishigura, Kenichi',
                role: [ 'Director', 'Series Composition' ] },
            { name: 'Iida, Satoki', role: [ 'Sound Director' ] },
            { name: 'Tomatsu, Haruka', role: [ 'Theme Song Performance' ] } ]
    },
    methods: {
        back: function () {
            main.getMainPage()
        },
        gotInfo: function () {
            console.log('Clicked')
            container.showForm = 'v-b'
        },
        getDownloader: function () {
             main.openDownloader()
        },
        toSearch: function () {
            container.showForm = 'v-b'
        }

    }
})

let elemFound = false

try
{
    let bar = new ProgressBar.Circle(document.getElementById('mark-displayer'), {
        color: '#aaa',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            autoStyleContainer: false
        },
        from: {color: '#aaa', width: 1},
        to: {color: '#0af', width: 4},
        // Set default step function for all animate calls
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            let value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value / 10);
            }

        }
    });
    bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    bar.text.style.color = '#3cf';

    bar.animate(container.stats.score / 10);  // Number from 0.0 to 1.0
c
    elemFound = true
}
catch (e) {

}