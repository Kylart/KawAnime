<template>
  <v-container fluid id="watch-list" class="pa-0">
    <v-tabs id="tabs" grow icons>
      <v-tabs-bar slot="activators" class="mablue">
        <v-tabs-slider class="primary"></v-tabs-slider>
        <template v-for="i in 5">
          <v-tabs-item :href="'#tabs-' + i">
            {{ actionsList[i - 1].name }}
            <v-icon>{{ actionsList[i - 1].icon }}</v-icon>
          </v-tabs-item>
        </template>
      </v-tabs-bar>
      <v-tabs-content v-for="i in 5" :key="i"
                      lazy
                      v-bind:id="'tabs-' + i">
        <v-card style="background-color: #303030">
          <v-card-text>
            <v-layout row wrap class="list-container">
              <v-flex xs12>
                <v-layout row wrap align-center justify-center class="top-form">
                  <v-flex md3 sm4 xs9>
                    <v-btn icon flat
                           @click="selectAll(i)"
                           v-tooltip:bottom="{ html: allSelected[i] ? 'Unselect all' : 'Select all' }">
                      <v-icon>select_all</v-icon>
                    </v-btn>
                    <!-- Add open-on-hover when vuetify repaired it -->
                    <v-menu transition="slide-x-transition">
                      <v-btn secondary slot="activator">Move to</v-btn>
                      <v-list class="dark">
                        <v-list-tile @click.capture="moveTo(action.list, i)"
                                     v-for="action in actions(i)"
                                     :key="action.name">
                          <v-list-tile-action>
                            <v-icon>{{ action.icon }}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-title>{{ action.name }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-btn @click="deleteSelected(i)"
                           class="red--text"
                           v-tooltip:bottom="{ html: 'Delete all selected items from this list' }"
                           icon>
                      <v-icon>delete_sweep</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex md2 sm2 xs3>
                    <p class="elem-number">
                      {{ lists[i - 1].length }} {{ lists[i - 1].length === 1 ? 'entry' : 'entries' }}
                    </p>
                  </v-flex>
                  <v-flex md3 sm1 hidden-xs-only></v-flex>
                  <v-flex md2 sm3 xs4 @keyup.enter="addEntry(i)">
                    <v-text-field type="text"
                                  class="entry-text"
                                  label="Add entry"
                                  v-model="entries[i]"
                                  dark>
                    </v-text-field>
                  </v-flex>
                  <v-flex hidden-sm-and-up xs1></v-flex>
                  <v-flex md2 sm2 xs4 class="add-button-container">
                    <v-btn dark secondary
                           @click="addEntry(i)"
                           class="add-button">
                      Add
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <transition-group name="list">
                <template v-for="item in lists[i - 1]">
                  <list-entry
                      :item="item"
                      :deleteEntry="deleteEntry"
                      :key="item"
                      :index="i"
                      :select="select"
                      :selected="selected"></list-entry>
                </template>
              </transition-group>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs>
  </v-container>
</template>

<script>
  const removeSelectedClasses = () => {
    const elems = document.getElementsByClassName('elem')

    // Remove all selected class
    for (let j = 0, l = elems.length; j < l; ++j) elems[j].children[0].classList.remove('selected')
  }

  export default {
    components: {
      'list-entry': () => import('components/listEntry.vue')
    },
    data () {
      return {
        selected: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: []
        },
        entries: {
          1: '',
          2: '',
          3: '',
          4: '',
          5: ''
        },
        actionsList: [{
          name: 'Watch list',
          list: 'watchList',
          icon: 'watch_later'
        }, {
          name: 'Watching',
          list: 'watching',
          icon: 'tv'
        }, {
          name: 'Seen',
          list: 'seen',
          icon: 'done_all'
        }, {
          name: 'On hold',
          list: 'onHold',
          icon: 'av_timer'
        }, {
          name: 'Dropped',
          list: 'dropped',
          icon: 'visibility_off'
        }],
        allSelected: {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false
        },
        listNames: {
          1: 'watchList',
          2: 'watching',
          3: 'seen',
          4: 'onHold',
          5: 'dropped'
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
      onHold: function () {
        return this.$store.state.watchLists.onHold
      },
      dropped: function () {
        return this.$store.state.watchLists.dropped
      },
      lists: function () {
        return [
          this.watchList,
          this.watching,
          this.seen,
          this.onHold,
          this.dropped
        ]
      }
    },
    methods: {
      actions: function (i) {
        return this.actionsList.filter((x) => { return x !== this.actionsList[i - 1] })
      },
      addEntry (i) {
        if (this.entries[i] !== '') {
          console.log(`[${(new Date()).toLocaleTimeString()}]: Adding ${this.entries[i]} to list.`)
          this.$store.dispatch('updateList', {
            entry: this.entries[i],
            listName: this.listNames[i]
          })
        }
        this.entries[i] = ''
      },
      deleteEntry (name, i) {
        removeSelectedClasses()

        this.$store.dispatch('removeFromList', {
          listName: this.actionsList[i - 1].list,
          entry: name
        })
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
          this.$store.dispatch('updateList', {
            listName: name,
            entry: anime
          })

          this.$store.dispatch('removeFromList', {
            listName: this.actionsList[i - 1].list,
            entry: anime
          })
        })

        removeSelectedClasses()
      },
      deleteSelected (i) {
        this.selected[i].forEach((anime) => {
          this.$store.dispatch('removeFromList', {
            listName: this.actionsList[i - 1].list,
            entry: anime
          })
        })

        removeSelectedClasses()
      }
    }
  }
</script>

<style scoped>
  h6
  {
    margin: 0;
  }

  span
  {
    width: 100%;
  }

  .card__text
  {
    padding-top: 0;
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
    font-size: 16px;
    font-weight: 700;
    font-style: italic;
  }

  .top-form
  {
    padding-left: 15px;
  }

  .entry-text
  {
    margin-top: 5px;
  }

  .add-button-container
  {
    padding-right: 2%;
    display: flex;
    align-items: center;
  }

  .list-container
  {
    margin-bottom: 85px;
  }
</style>
