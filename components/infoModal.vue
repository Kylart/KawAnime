<template>
  <div>
    <v-dialog v-model="searchShow" width="650" lazy absolute>
      <v-btn icon slot="activator">
        <v-icon>search</v-icon>
      </v-btn>
      <v-card class="secondary">
          <v-card-title class="headline">Which anime are you looking for?</v-card-title>
          <v-card-text>
            <v-layout wrap justify-center>
              <v-flex xs6>
                <v-text-field
                    name="search-name"
                    label="Anime name"
                    v-model="searchTerm"
                    dark
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-layout row wrap justify-center>
                  <template v-if="results.length"
                            v-for="item in results">
                    <v-flex xs3 class="elem"
                           @click.native="search(item.name)">
                      <v-layout wrap justify-center
                                class="elem-content elevation-3"
                                @click.all="search(item.name)"
                                ripple>
                        <v-flex xs8>
                          <img :src="item.image_url" height="140" class="elem-picture">
                        </v-flex>
                        <v-flex xs10 class="elem-name">{{ item.name }}</v-flex>
                      </v-layout>
                    </v-flex>
                  </template>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1 close-button" flat @click.native="searchShow = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="800" v-model="resultShow" persistent lazy absolute>
      <v-card class="secondary">
          <v-card-title class="headline">Result for «{{ searchTerm }}»</v-card-title>
          <v-card-text>
            <h4 v-if="error">{{ error }}</h4>
            <div v-else-if="loading">
              <h5 class="loading-text">Gathering data...</h5>
              <h5 class="loading-text">Info should be displayed in a few seconds</h5>
            </div>
            <v-card v-else class="secondary">
              <v-card-content>
                <v-layout row wrap>
                  <v-flex xs9>
                    <v-card-title class="info-title">{{ info.alternativeTitles.japanese[0].replace('Japanese: ', '') }} [{{ info.type }}]</v-card-title>
                  </v-flex>
                  <v-flex xs3>
                    <v-card-title>{{ info.statistics.score.value }} ({{ info.statistics.score.count }})</v-card-title>
                  </v-flex>
                </v-layout>
              </v-card-content>
              <v-layout row wrap>
                <v-flex xs3 class="info-pic-container">
                  <img :src="info.image" class="info-pic"/>
                </v-flex>
                <v-flex xs9 class="info-synopsis-container">
                  <p class="info-synopsis">{{ info.synopsis }}</p>
                </v-flex>
              </v-layout>
              <v-card-content class="top-info">
                <v-layout>
                  <v-flex xs9 class="info-text">{{ info.genres.join(', ') }}</v-flex>
                  <v-flex xs3 class="info-text">{{ info.episodes }} {{ episodeLabel }}</v-flex>
                </v-layout>
              </v-card-content>
              <v-card-content class="bottom-info">
                <v-layout>
                  <v-flex xs5 class="info-text">{{ info.studios.join(', ') }}</v-flex>
                  <v-flex xs4 class="info-text">{{ info.classification }}</v-flex>
                  <v-flex xs3 class="info-text">{{ info.status }} ({{ info.aired.split(' ')[2] }})</v-flex>
                </v-layout>
              </v-card-content>
            </v-card>
          </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1 close-button" flat @click.native="closeResults()">Thanks!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import _ from 'lodash'
  import Loader from '~components/loader.vue'

  export default {
    data () {
      return {
        searchShow: false,
        resultShow: false,
        searchTerm: '',
        results: [],
        info: {},
        error: '',
        loading: true
      }
    },
    computed: {
      episodeLabel () {
        return this.info.episodes !== 1
          ? 'episodes'
          : 'episode'
      }
    },
    components: {
      Loader
    },
    methods: {
      async search (name) {
        this.searchTerm = name

        if (this.info.title === name) {
          this.resultShow = true
          this.searchShow = false
        } else {
          this.loading = true
          this.resultShow = true
          this.searchShow = false

          const {data, status} = await axios.get(`getInfoFromMal?term=${name}`)

          this.loading = false

          status === 200
            ? this.info = data
            : this.error = `An error occurred while retrieving information of ${name}..`
        }
      },
      quickSearch: _.debounce(
        async function () {
          const term = this.searchTerm

          if (term.length > 2) {
            try {
              const {data, status} = await axios.get(`searchTermOnMal?term=${term}`)

              if (status === 200) {
                this.results = data.categories[0].items
              }
            } catch (e) {
              console.log((new Date()).toLocaleTimeString() + e.message)
              this.$store.commit('setInfoSnackbar', e.message)
            }
          } else {
            this.results = []
          }
        },
        300),
      closeResults () {
        this.searchTerm = ''
        this.resultShow = false
      }
    },
    watch: {
      async searchTerm () {
        this.quickSearch()
      }
    }
  }
</script>

<style scoped>
  .loading-text
  {
    text-align: center;
    position: relative;
    color: rgba(255, 255, 255, 0.8);
  }

  .close-button
  {
    margin-right: 10px !important;
  }

  .elem
  {
    margin-top: 10px;
  }

  .elem-content
  {
    height: 100%;
    position: relative;
    margin-left: 10%;
    width: 100%;
    background-color: rgb(60, 60, 60);
    padding-bottom: 5px;
  }

  .elem-name
  {
    font-size: 16px;
    text-align: center;
  }

  .elem-picture
  {
    max-width: 90%;
  }

  .info-title
  {
    padding-left: 15% !important;
  }

  .info-pic-container
  {
    max-width: 200px;
  }

  .info-pic
  {
    max-width: 100%;
    max-height: 400px;
  }

  .info-synopsis-container
  {
    padding: 15px;
  }

  .info-synopsis
  {
    text-align: justify;
    font-size: 16px;
    line-height: 22px;
    white-space: pre-wrap;
  }

  .bottom-info
  {
    margin-top: 15px;
    padding-bottom: 15px;
  }

  .info-text
  {
    font-weight: 100;
    font-size: 16px;
  }
</style>
