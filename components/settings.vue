<template>
  <v-dialog v-model="configModal"
            fullscreen
            transition="dialog-bottom-transition"
            :overlay=false>
    <v-btn icon slot="activator">
      <v-icon>settings</v-icon>
    </v-btn>

    <v-card class="white--text main">
      <v-toolbar dark class="mablue">
        <v-btn icon @click.native="configModal = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="headline">Settings</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat
                 v-on:click.native="save()">
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-navigation-drawer class="pb-0 drawer"
                           v-model="drawer">
        <v-list>
          <template v-for="item in itemGroup">
            <v-list-group v-if="item.items"
                          :key="item.title">
              <v-list-tile slot="item" class="ripple" ripple>
                <v-list-tile-action>
                  <v-icon>{{ item.action }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>
                  {{ item.title }}
                </v-list-tile-title>
                <v-list-tile-action>
                  <v-icon>
                    keyboard_arrow_down
                  </v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-for="subItem in item.items"
                           class="ripple"
                           ripple
                           :to="subItem.href"
                           key="subItem.title">
                <v-list-tile-action>
                  <v-icon>{{ subItem.action }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
            </v-list-group>
            <v-subheader v-else-if="item.header">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider"></v-divider>
            <v-list-tile v-else ripple style="position: relative">
              <v-list-tile-action>
                <v-icon>{{ item.action }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-container fluid class="container">
        <v-layout row wrap justify-center>
          <v-flex xs11>
            <v-card>
              <v-card-title class="headline" id="download">
                Download
              </v-card-title>
              <v-divider></v-divider>
              <v-layout row wrap justify-center>
                <v-flex xs6 class="section-title">Preferred fansub</v-flex>
                <v-flex xs6 class="section-title">Quality</v-flex>
                <v-flex offset-xs1 xs4>
                  <v-select
                      v-bind:items="fansubChoices"
                      v-model="config.fansub"
                      hint="The fansub you want to check first!"
                      persistent-hint
                      dark
                      item-value="text"
                  ></v-select>
                </v-flex>
                <v-flex xs1></v-flex>
                <template v-for="radio in radios">
                  <v-flex xs2>
                    <v-radio :label="radio" :value="radio" v-model="config.quality"></v-radio>
                  </v-flex>
                </template>
                <v-flex offset-xs1 xs3 class="section-title">Magnets</v-flex>
                <v-flex xs8>
                  <v-switch label="Activate" v-model="config.magnets" dark></v-switch>
                </v-flex>
              </v-layout>
            </v-card>
            <v-card class="section">
              <v-card-title class="headline" id="local">Local</v-card-title>
              <v-divider></v-divider>
              <v-layout row wrap justify-center>
                <v-flex xs4 class="section-title">Preferred local path</v-flex>
                <v-flex xs6 class="local-path">{{ config.localPath }}</v-flex>
                <v-flex xs2>
                  <v-btn accent @click.native="$store.dispatch('changePathWithConfig')">Choose</v-btn>
                </v-flex>
                <v-flex xs3 class="section-title">News</v-flex>
                <v-flex xs9>
                  <v-switch :label="config.inside ? 'Inside' : 'Outside'" v-model="config.inside" dark></v-switch>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        configModal: false,
        radios: ['480p', '720p', '1080p'],
        fansubChoices: [
          'HorribleSubs',
          'PuyaSubs!',
          'DurandalSubs',
          'Fuyu',
          'DefinitelyNotMe'
        ],
        soundChoices: [
          'None',
          'Nyanpasu'
        ],
        itemGroup: [
          {
            title: 'Download',
            action: 'file_download',
            to: '#download'
          }, {
            title: 'Local',
            action: 'folder',
            to: '#local'
          }
        ]
      }
    },
    computed: {
      config: function () {
        return this.$store.state.config
      }
    },
    methods: {
      changeConfigPath () {
        this.$store.dispatch('changePathWithConfig')
      },
      save () {
        this.$store.commit('setConfig', this.config)
        const toSave = {...this.config}
        toSave.inside = this.config.inside === 'true'

        this.$store.dispatch('saveConfig', toSave)
      },
      saveAndClose () {
        this.save()
        this.configModal = false
      }
    }
  }
</script>

<style scoped>
  .drawer
  {
    margin-top: 72px;
    width: 23%;
  }

  .main
  {
    padding-left: 23%;
  }

  .container
  {
    padding-left: 23%;
  }

  .section
  {
    margin-top: 20px;
  }

  .section-title
  {
    padding-left: 20px;
    margin-top: 15px;
    font-size: 22px;
    font-weight: 300;
  }

  .local-path
  {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 200;
    text-align: center;
  }
</style>
