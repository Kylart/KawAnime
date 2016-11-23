/**
 * Created by Kylart on 22/11/16.
 */

const remote = require('electron').remote
const main = remote.require(`${__dirname}/../../main.js`)
const mal = require('malapi').Anime
const ProgressBar = require('progressbar.js');


let container = new Vue({
    el: '#container',
    data: {
        showForm: 'v-a',
        test: 'Hello world'
    },
    methods: {
        getMarker: function () {
            setMark(animeData.stats.score.value)
        }
    },
    components: {
        'v-a': {
            template: `
                    <div id="form-container">
                    <h4>{{ title }}</h4>
                    <form action="#">
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input @keydown.enter="gotInfo()" v-model="animeName" class="mdl-textfield__input" type="text" id="sample3" autofocus>
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
                    bringIt: 'Gimme info!',
                    animeName: ''
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
                    container.showForm = 'v-b'
                    makeResearch(this.animeName)
                },
                 getDownloader: function () {
                     main.openDownloader()
                 }
            }
        },
        'v-b': {
            template: `
                <div>
                    <div id="left-container">
                        <div id="image" v-bind:style="{backgroundImage: 'url(' + image + ')'}">
                            <div id="anime-title"><span>{{ title }}</span></div>
                        </div>
                        <h6 id="jap-title">Japanese title : <span>{{ japaneseTitle }}</span></h6>
            
                        <div id="genres">
                            <h6>Genres</h6>
                            <ul>
                                <li v-for="genre in genres">
                                    {{ genre }}
                                </li>
                            </ul>
                        </div>
                        <div id="studio">
                            <h6>Studio</h6>
                            <ul>
                                <li v-for="studio in studios">
                                    {{ studio }}
                                </li>
                            </ul>
                        </div>
                    </div>
            
                    <div id="middle-container">
                        <div id="middle-title">
                            <h3>{{ title }}</h3>
                        </div>
                        <h6>Synopsis</h6>
                        <div id="synopsis">
                            <pre>{{ synopsis }}</pre>
                        </div>
                        <h6 style="margin-bottom: 2%">Characters</h6>
                        <div id="character-grid">
                            <div class="character" v-for="chara in characters">
                                <p class="seiyuu">
                                    <span class="chara-name">{{ chara.name }}</span>
                                </p>
                                <p class="chara-stat">
                                    <span>&#x2192; </span><span class="actor-name">{{ chara.actor }}</span>
                                </p>
                                <p class="chara-stat">
                                    <span class="lang">{{ chara.language }}</span>
                                    <span class="role">{{ chara.role.slice(0, 7) }}</span>
                                </p>
                            </div>
                        </div>
            
                        <div id="info-buttons-container">
                            <button v-on:click="back()" id="info-back"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                Home
                            </button>
                            <button v-on:click="getDownloader()" id="info-download"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                Downloader
                            </button>
            
                            <button v-on:click="toSearch()" id="info-to-search"
                                    class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
                                Search
                            </button>
                        </div>
            
                    </div>
            
                    <div id="right-container">
                        <div id="mark-displayer"></div>
                        <div id="info-displayer">
                            <h6>{{ episodes }} episodes</h6>
                            <h6>{{ status }}</h6>
                            <h6>Aired on {{ aired }}</h6>
                            <ul>
                                <li v-for="guy in staff">
                                    <p>{{ guy.role[0] }} : <span>{{ guy.name }}</span></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `,
            data: function () {
                return animeData
            },
            methods: {
                back: function () {
                    main.getMainPage()
                },
                getDownloader: function () {
                    main.openDownloader()
                },
                toSearch: function () {
                    location.reload()
                }
            },
            ready: function () {
                console.log('Here i am.')
            }
        }
    }
})

function makeResearch(name) {
    mal.fromName(name).then(anime => {
        let t0 = performance.now();
        animeData.title = anime.title
        animeData.japaneseTitle = anime.japaneseTitle
        animeData.image = anime.image
        animeData.synopsis = anime.synopsis
        animeData.episodes = anime.episodes
        animeData.studios = anime.studios
        animeData.stats = anime.statistics
        animeData.genres = anime.genres
        animeData.status = anime.status
        animeData.aired = anime.aired
        animeData.type = anime.type.split(' ').slice(0, 3).join(' ')
        animeData.characters = anime.characters
        animeData.staff = anime.staff
        let t1 = performance.now();
        console.log("Information gathered in " + (t1 - t0) + " seconds.")
    })
}

let animeData = {   // Template in case no name is entered
    title: 'Sakura Trick | The best',
    japaneseTitle: '桜Trick',
    image: 'https://myanimelist.cdn-dena.com/images/anime/2/56189.jpg',
    synopsis: 'Love is in the air when the story of Sakura Trick begins. Haruka Takayama and Yuu Sonoda were best' +
    ' friends in middle school, and are now attending Misato West High School together. They are assigned to the same class in their first year, but are given seats on opposite sides of the room! If that wasn\'t enough, it is announced at the entrance ceremony that the school will be closed in three years. This doesn\'t bother either of them, as they still plan on having lots of fun together during their high school years.\r\n\r\nHaruka gets jealous of Yuu making new friends though, so the two decide to deepen their bond. "Let\'s do something we\'d never do with other girls," Yuu says, and they share a kiss in a vacant classroom after school one day. After that one kiss leads to many kisses, the two begin to realize that the relationship they share has changed completely. But what will happen to their relationship once a disapproving older sister begins to suspect that something is going on between the two?',
    episodes: '12',
    studios: [ 'Studio Deen' ],
    stats: { score: { value: '7.20', count: '50,109' },
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
    aired: 'Jan 10, 2014 to Mar 28, 2014'.split(' ').slice(0, 3).join(' '),  // Don't forget to apply this
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
}



// This is for the mark displayer
function setMark(mark) {
    try {
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
                circle.path.setAttribute('stroke', state.color)
                circle.path.setAttribute('stroke-width', state.width)

                let value = Math.round(circle.value() * 100)
                if (value === 0) {
                    circle.setText('')
                } else {
                    circle.setText(value / 10)
                }

            }
        })
        bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif'
        bar.text.style.color = '#3cf'

        bar.animate(mark / 10);  // Number from 0.0 to 1.0

        clearInterval(seekElem)
    }
    catch (e) {

    }
}