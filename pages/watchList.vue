<template>
  <v-container fluid id="watch-list">
    <v-tabs id="tabs" grow icons>
      <v-tab-item href="#tabs-1" slot="activators">
        Watch list
        <v-icon>watch_later</v-icon>
      </v-tab-item>
      <v-tab-item href="#tabs-2" slot="activators">
        Watching
        <v-icon>play_circle_outline</v-icon>
      </v-tab-item>
      <v-tab-item href="#tabs-3" slot="activators">
        Seen
        <v-icon>done_all</v-icon>
      </v-tab-item>
      <v-tab-content v-for="i in 3" :key="i"
                     v-bind:id="'tabs-' + i"
                     slot="content">
        <v-card>
          <v-card-text>
            <v-row>
              <v-col xs12>
                <v-row class="top-form">
                  <v-col md3 sm4 xs12>
                    <v-btn secondary icon
                           @click.native="selectAll(i)"
                           v-tooltip:bottom="{ html: allSelected[i] ? 'Unselect all' : 'Select all' }">
                      <v-icon>select_all</v-icon>
                    </v-btn>
                    <v-menu transition="v-slide-x-transition"
                            bottom
                            right>
                      <v-btn secondary dark slot="activator">Move to</v-btn>
                      <v-list>
                        <v-list-item @click.capture="moveTo(action.list, i)"
                                     v-for="action in actions(i)"
                                     :key="action">
                          <v-list-tile>
                            <v-list-tile-title>{{ action.name }}</v-list-tile-title>
                          </v-list-tile>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                  <v-col md2 sm2 xs12>
                    <p class="elem-number">{{ lists[i - 1].length }} entries</p>
                  </v-col>
                  <v-col md3 sm1 xs0></v-col>
                  <v-col md2 sm3 xs12 @keyup.enter="addEntry(i)">
                    <v-text-field type="text"
                                  class="entry-text"
                                  label="Add entry"
                                  v-model="entries[i]"
                                  dark>
                    </v-text-field>
                  </v-col>
                  <v-col md2 sm2 xs12 class="add-button-container">
                    <v-btn dark secondary
                           @click.native="addEntry(i)"
                           class="add-button">Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <template v-for="item in lists[i - 1]">
                <v-col lg4 sm6 xs12
                       class="elem" :class="item.split(' ').join('-')">
                  <v-row class="elem-content elevation-3"
                         v-ripple="true">
                    <v-col xs1 class="box" @click.capture="select(item, i)">
                      <v-checkbox label="" accent v-model="selected[i]" disabled :value="item" dark/>
                    </v-col>
                    <v-col xs9 v-tooltip:top="{ html: item }" @click.capture="select(item, i)">
                      <h6 class="ellipsis elem-title">{{ item }}</h6>
                    </v-col>
                    <v-col xs2>
                      <v-menu bottom right>
                        <v-btn icon="icon" slot="activator" dark>
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                        <v-list>
                          <v-list-item>
                            <v-list-tile>
                              <v-list-tile-title>Download</v-list-tile-title>
                            </v-list-tile>
                          </v-list-item>
                          <v-list-item>
                            <v-list-tile>
                              <v-list-tile-title>Information</v-list-tile-title>
                            </v-list-tile>
                          </v-list-item>
                          <v-list-item>
                            <v-list-tile>
                              <v-list-tile-title>Delete this entry</v-list-tile-title>
                            </v-list-tile>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
      </v-tab-content>
    </v-tabs>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        selected: {
          1: [],
          2: [],
          3: []
        },
        entries: {
          1: '',
          2: '',
          3: ''
        },
        actionsList: [{
          name: 'Watch list',
          list: 'watchList'
        }, {
          name: 'Watching',
          list: 'watching'
        }, {
          name: 'Seen',
          list: 'seen'
        }
        ],
        allSelected: {
          1: false,
          2: false,
          3: false
        },
        listNames: {
          1: 'watchList',
          2: 'watching',
          3: 'seen'
        }
      }
    },
    computed: {
      watchList: function () {
        return this.$store.state.watchLists.watchList
      },
      seen: function () {
        return this.$store.state.watchLists.seen
      },
      watching: function () {
        return this.$store.state.watchLists.watching
      },
      lists: function () {
        return [
          this.watchList,
          this.watching,
          this.seen
        ]
      }
    },
    methods: {
      download (name) {

      },
      actions: function (i) {
        return this.actionsList.filter((x) => { return x !== this.actionsList[i - 1] })
      },
      addEntry (i) {
        if (this.entries[i] !== '') {
          console.log(`[${(new Date()).toLocaleTimeString()}]: Adding ${this.entries[i]} to list.`)
          this.$store.commit('updateList', {
            entry: this.entries[i],
            listName: this.listNames[i]
          })
        }
        this.entries[i] = ''
      },
      select (item, i) {
        const elem = document.getElementsByClassName(item.split(' ').join('-'))[0].children[0]

        if (elem.classList.contains('selected') === true) {
          elem.classList.remove('selected')
          this.selected[i] = this.selected[i].filter((x) => { return !(x === item) })

          this.allSelected[i] = false
        } else {
          elem.className += ' selected'
          this.selected[i].push(item)

          if (this.selected[i].length === this.lists[[i - 1]]) this.allSelected[i] = true
        }
      },
      selectAll (i) {
        const list = this.lists[i - 1]

        if (this.selected[i].length === list.length) {
          const elems = document.getElementsByClassName('elem')

          this.selected[i] = []

          for (let j = 0, l = elems.length; j < l; ++j) { elems[j].children[0].classList.remove('selected') }

          this.allSelected[i] = false
        } else {
          list.forEach((elem) => {
            // Color element
            const tmpElem = document.getElementsByClassName(elem.split(' ').join('-'))[0].children[0]
            if (!tmpElem.classList.contains('selected') === true) tmpElem.className += ' selected'
          })
          // Add all elements to selected
          this.selected[i] = [...list]

          this.allSelected[i] = true
        }
      },
      moveTo (name, i) {
        this.selected[i].forEach((anime) => {
          this.$store.commit('updateList', {
            listName: name,
            entry: anime
          })

          this.$store.commit('removeFromList', {
            listName: this.actionsList[i - 1].list,
            entry: anime
          })
        })

        // Remove all selected class
        const elems = document.getElementsByClassName('elem')

        for (let j = 0, l = elems.length; j < l; ++j) { elems[j].children[0].classList.remove('selected') }
      }
    }
  }
</script>

<style scoped>
  h6
  {
    margin: 0;
    color: rgba(255, 255, 255, 0.8);
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .elem-number
  {
    margin: 15px 0 0 0;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    font-weight: 700;
    font-style: italic;
  }

  .elem
  {
    padding: 5px 5px 5px 5px;
    color: rgba(255, 255, 255, 0.8);
  }

  .elem-content
  {
    margin-left: 5px;
    position: relative;
    background-color: rgb(60, 60, 60);
  }

  .elem-content:hover
  {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  /*noinspection CssUnusedSymbol*/
  .input-group
  {
    margin: 0;
  }

  .top-form
  {
    margin-bottom: 10px;
    padding-left: 15px;
  }

  .entry-text
  {
    margin-top: 5px;
  }

  .add-button-container
  {
    padding-right: 2%;
  }

  .box
  {
    padding-top: 7px;
    padding-left: 13px;
  }

  .elem-title
  {
    line-height: 24px;
    font-size: 20px;
    padding-top: 10px;
    padding-left: 10px;
  }

  /*noinspection CssUnusedSymbol*/
  .selected
  {
    background-color: #2E7D32;
  }
</style>
