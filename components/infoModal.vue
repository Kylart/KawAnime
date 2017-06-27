<template>
  <div class="modals text-xs-center">
    <v-dialog v-model="searchShow" width="650" scrollable>
      <v-btn icon primary slot="activator">
        <v-icon>search</v-icon>
      </v-btn>
      <v-card class="secondary">
        <v-card-row>
          <v-card-title>Which anime are you looking for?</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            <v-row>
              <v-col xs7 offset-xs2 @keydown.enter="search()">
                <v-text-field
                    name="search-name"
                    label="Anime name"
                    v-model="searchTerm"
                    dark
                ></v-text-field>
              </v-col>
              <v-col xs12>
                <v-row>
                  <template v-if="results.length"
                            v-for="item in results">
                    <v-col xs3 class="elem"
                           @click.native="search(item.name)">
                      <v-row class="elem-content elevation-3"
                             @click.all="search(item.name)"
                             v-ripple>
                        <v-col xs12>
                          <img :src="item.image_url" height="140" max-width="100%">
                        </v-col>
                        <v-col xs12 class="elem-name">{{ item.name }}</v-col>
                      </v-row>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="blue--text darken-1 close-button" flat @click.native="searchShow = false">Close</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
    <v-dialog width="650" v-model="resultShow" persistent scrollable>
      <v-card class="secondary">
        <v-card-row>
          <v-card-title>Result for «{{ searchTerm }}»</v-card-title>
        </v-card-row>
        <v-card-row>
          <v-card-text>
            hello world
          </v-card-text>
        </v-card-row>
        <v-card-row actions>
          <v-btn class="blue--text darken-1 close-button" flat @click.native="resultShow = false">Thanks!</v-btn>
        </v-card-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import Loader from '~components/loader.vue'

  export default {
    data () {
      return {
        searchShow: false,
        resultShow: false,
        searchTerm: '',
        results: [],
        info: {}
      }
    },
    components: {
      Loader
    },
    methods: {
      search: function (name) {
        if (this.searchTerm.length > 2) {
          this.resultShow = true
          this.searchShow = false
        } else {
          this.$store.commit('setInfoSnackbar', 'Please enter a valid name.')
        }
      }
    },
    watch: {
      async searchTerm () {
        const term = this.searchTerm

        if (term.length > 2) {
          try {
            const {data, status} = await axios.get(`searchTermOnMal?term=${term}`)

            if (status === 200) {
              this.results = data.categories[0].items
            }
          } catch (e) {
            console.log((new Date).toLocaleTimeString() + e.message)
            this.$store.commit('setInfoSnackbar', 'You type too much, too fast!')
          }
        } else {
          this.results = []
        }
      }
    }
  }
</script>

<style scoped>
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
    width: 99%;
    background-color: rgb(60, 60, 60);
    padding-bottom: 5px;
  }

  .elem-name
  {
    font-size: 16px;
  }
</style>
