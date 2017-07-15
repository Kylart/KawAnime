<template xmlns:v-tooltip="http://www.w3.org/1999/xhtml">
  <div style="min-height: 95vh">
    <loader v-if="!season[1].items"></loader>

    <v-container fluid v-else style="padding: 20px 0 0">
      <v-layout row wrap justify-center class="form-container">
        <v-flex sm3 xs8 class="season-container">
          <v-select
              v-bind:items="seasonChoices"
              v-model="$store.state.season"
              label="Season"
              dark
              item-text="name"
              item-value="value"/>
        </v-flex>
        <v-flex offset-sm1 sm3 xs8 class="year-container">
          <v-text-field name="input-year"
                        type="number" min="2010"
                        label="Year"
                        v-model="$store.state.year"
                        dark>
          </v-text-field>
        </v-flex>
        <v-flex offset-sm1 sm2 xs8 class="refresh-button">
          <v-btn secondary block dark @click.native="refreshSeason()">Refresh</v-btn>
        </v-flex>
      </v-layout>

      <v-tabs id="tabs" dark fixed centered>
        <v-tabs-bar slot="activators" class="mablue">
          <v-tabs-slider class="primary"></v-tabs-slider>
          <v-tabs-item v-for="i in 3"
                       :href="'#' + i"
                       :key="i">
            {{ season[i].name }}
          </v-tabs-item>
        </v-tabs-bar>
        <v-tabs-content v-for="i in 3"
                        v-bind:id="`${i}`"
                        :key="i">
          <v-text-field class="query"
                        v-model="query"
                        label="Search entry" dark>
          </v-text-field>
          <v-layout row wrap class="elems">
            <transition-group name="list">
              <v-flex md6 xs12 v-for="item in computedSeason[i].items"
                      style="display: inline-block"
                      :key="item.key">
                <v-layout row wrap class="elem elevation-3" v-ripple="true">
                  <!-- Header of elem -->
                  <v-flex xs12 v-tooltip:bottom="{ html: item.title }">
                    <h6 class="title ellipsis">
                      {{ item.title }}
                    </h6>
                  </v-flex>
                  <v-flex xs8 v-tooltip:bottom="{ html: item.genres.join(' ') }">
                    <p class="genres ellipsis">{{ item.genres.join(' ') }}</p>
                  </v-flex>
                  <v-flex xs3 v-tooltip:bottom="{ html: item.fromType }">
                    <p class="from-type ellipsis">
                      {{ item.fromType }}
                    </p>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <!-- Picture of elem -->
                  <v-flex xs4 class="image-container">
                    <img :src="item.picture" class="image"/>
                  </v-flex>
                  <v-flex xs8 class="bottom-right">
                    <v-layout wrap justify-space-between align-center>
                      <v-flex xs12>
                        <div class="synopsis">
                          {{ reduced(item.synopsis) }}
                        </div>
                      </v-flex>
                      <v-flex xs12>
                        <v-layout wrap justify-space-between>
                          <v-flex xs3 class="date">{{ getDate(item.releaseDate) }}</v-flex>
                          <v-flex xs4 class="nb-ep">{{ item.nbEp }} {{ episode(item.npEp) }}</v-flex>
                        </v-layout>
                        <v-layout wrap justify-space-between>
                          <v-flex xs8 class="producers"><strong>{{ item.producers.join(' ') }}</strong></v-flex>
                          <v-flex xs4 class="dropdown-container">
                            <v-menu open-on-hover
                                    transition="slide-x-transition">
                              <v-btn flat dark slot="activator">
                                More
                              </v-btn>
                              <v-list>
                                <v-list-tile v-on:click.native="openModal(item.title, item.synopsis)">
                                  <v-list-tile-action>
                                    <v-icon>more</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-title>
                                    Check synopsis
                                  </v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile>
                                  <v-list-tile-action>
                                    <v-icon>info_outline</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-title>Information</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click.native="showChoices(item.title)">
                                  <v-list-tile-action>
                                    <v-icon>add_box</v-icon>
                                  </v-list-tile-action>
                                  <v-list-tile-title>
                                    Add to
                                  </v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
            </transition-group>
          </v-layout>
        </v-tabs-content>
      </v-tabs>
      <div class="text-xs-center modal-container">
        <v-dialog v-model="modal" width="70%">
          <v-card class="secondary white--text">
            <v-card-text class="white--text">
              <h2 class="headline white--text">{{ modalTitle }}</h2>
            </v-card-text>
            <v-card-text class="text white--text">
              {{ modalText }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="blue--text darken-1" flat
                     style="width: 100px"
                     v-on:click.native="modal = false">Thanks!
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <choice-window :entry="choiceTitle"></choice-window>
    </v-container>
  </div>
</template>

<script>
  import Loader from '~components/loader.vue'
  import ChoiceWindow from '~components/choiceWindow.vue'

  export default {
    head () {
      return {
        title: 'Seasons',
        meta: [
          {hid: 'description', name: 'description', content: 'Browse the anime seasons'}
        ]
      }
    },
    data () {
      return {
        query: '',
        choiceTitle: '',
        choices: [],
        modalTitle: '',
        modalText: '',
        modal: false,
        seasonChoices: [
          {name: 'Winter', value: 'winter'},
          {name: 'Spring', value: 'spring'},
          {name: 'Summer', value: 'summer'},
          {name: 'Fall', value: 'fall'}
        ]
      }
    },
    computed: {
      seasons: function () {
        return this.$store.state.seasons
      },
      stats: function () {
        return this.$store.state.seasonsStats
      },
      TVs: function () {
        return this.seasons.TV
      },
      OVAs: function () {
        return this.seasons.OVAs
      },
      Movies: function () {
        return this.seasons.Movies
      },
      season: function () {
        return [
          '',
          {name: 'TV', items: this.TVs},
          {name: 'OVA', items: this.OVAs},
          {name: 'Movies', items: this.Movies}
        ]
      },
      computedSeason: function () {
        const query = this.query.toLowerCase()
        return query === ''
          ? this.season
          : this.season.map((list) => {
            if (list.items) {
              return {
                name: list.name,
                items: list.items.filter((elem) => {
                  return elem.title.toLowerCase().indexOf(query) !== -1
                })
              }
            } else return ''
          })
      }
    },
    components: {
      Loader,
      ChoiceWindow
    },
    methods: {
      reduced (text) {
        return text.length > 270
          ? text.slice(0, 300) + '...'
          : text
      },
      getDate (string) {
        return string.split(' ').slice(0, 3).join(' ')
      },
      episode (nbEp) {
        return parseInt(nbEp) !== 1
          ? 'episodes'
          : 'episode'
      },
      refreshSeason () {
        this.$store.dispatch('refreshSeasons')
      },
      openModal (title, text) {
        console.log(`[${(new Date()).toLocaleTimeString()}]Opening modal for ${title}`)

        this.modalTitle = title
        this.modalText = text

        this.modal = true
      },
      showChoices (name) {
        this.choiceTitle = name
        this.$store.commit('setAddToChoice', true)
      }
    }
  }
</script>

<style scoped>
  h6
  {
    margin: 0;
  }

  .text
  {
    text-align: justify;
    text-align-last: center;
    padding: 20px;
    font-size: 16px;
  }

  .query
  {
    margin: 30px 0 0;
    margin-left: 10%;
    width: 25%;
  }

  /* ----------- ELEM ---------- */
  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .elems
  {
    padding: 0 1% 2% 1%;
  }

  .elem
  {
    position: relative;
    margin: 5px 0 10px;
    background-color: rgb(60, 60, 60);
    color: rgba(255, 255, 255, 0.8);
  }

  .elem:hover
  {
    transition: all 0.25s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .title
  {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 10px;
    line-height: 26px;
    color: rgba(255, 255, 255, 0.8);
  }

  .from-type
  {
    margin-bottom: 5px;
    text-align: right;
    font-weight: 700;
    font-size: 120%;
  }

  .genres
  {
    padding-left: 5px;
    font-weight: 600;
  }

  .image-container
  {
    padding: 0;
    max-height: 220px;
  }

  .image
  {
    max-height: 220px;
    max-width: 100%;
  }

  .bottom-right
  {
    position: relative;
    display: flex;
  }

  .synopsis
  {
    padding-left: 15px;
    padding-right: 15px;
    text-align: justify;
    display: block;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    height: 7.5em;
    line-height: 1.5em;
  }

  .date
  {
    margin-top: 5%;
  }

  .nb-ep
  {
    text-align: right;
    margin-top: 5%;
    padding-right: 20px;
  }

  .producers
  {
    margin-top: 4%;
  }
</style>
