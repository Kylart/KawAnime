<template lang="pug">
  v-container#watch-list.pa-0.mt-0(fluid, fill-height)
    v-tabs#tabs(grow, icons)
      v-tabs-bar.mablue
        v-tabs-slider.primary
        template(v-for='i in 5')
          v-tabs-item(:href="'#tabs-' + i")
            | {{ actionsList[i - 1].name }}
            v-icon {{ actionsList[i - 1].icon }}
      v-tabs-items
        v-tabs-content(v-for='i in 5', :key='i', lazy, v-bind:id="'tabs-' + i")
          v-layout.list-container.pb-2(row, wrap)
            v-flex(xs12)
              v-layout.top-form(row, wrap, align-center, justify-center)
                v-flex(md3, sm4, xs9)
                  v-tooltip(bottom)
                    v-btn(
                      icon, flat,
                      @click='selectAll(i)',
                      slot='activator'
                    )
                      v-icon select_all
                    span {{ selectLabel(i) }}
                  v-menu(open-on-hover, transition='slide-x-transition')
                    v-btn(color='secondary', slot='activator') Move to
                    v-list.dark
                      v-list-tile(
                        @click='moveTo(action.list, i)',
                        v-for='action in actions(i)',
                        :key='action.name'
                      )
                        v-list-tile-action
                          v-icon {{ action.icon }}
                        v-list-tile-title {{ action.name }}
                  v-tooltip(bottom)
                    v-btn.red--text(
                      @click='deleteSelected(i)',
                      slot='activator',
                      icon
                    )
                      v-icon delete_sweep
                    span Delete all selected items from this list
                v-flex(md2, sm2, xs3)
                  p.elem-number
                    | {{ lists[i - 1].length }} {{ lists[i - 1].length === 1 ? 'entry' : 'entries' }}
                v-flex(md3, sm1, hidden-xs-only)
                v-flex(md2, sm3, xs4, @keyup.enter='addEntry(i)')
                  v-text-field.entry-text(type='text', label='Add entry', v-model='entries[i]', dark)
                v-flex(hidden-sm-and-up, xs1)
                v-flex.add-button-container(md2, sm2, xs4)
                  v-btn.add-button(dark, color='secondary', @click='addEntry(i)')
                    | Add
            transition-group(name='list')
              template(v-for='item in lists[i - 1]')
                list-entry(
                  :item='item',
                  :deleteEntry='deleteEntry',
                  :key='item',
                  :index='i',
                  :select='select',
                  :selected='selected'
                )
          k-footer
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
      watchList () {
        return this.$store.state.watchLists.lists.watchList
      },
      seen () {
        return this.$store.state.watchLists.lists.seen
      },
      watching () {
        return this.$store.state.watchLists.lists.watching
      },
      onHold () {
        return this.$store.state.watchLists.lists.onHold
      },
      dropped () {
        return this.$store.state.watchLists.lists.dropped
      },
      lists () {
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
      actions (i) {
        return this.actionsList.filter((x) => { return x !== this.actionsList[i - 1] })
      },
      addEntry (i) {
        if (this.entries[i] !== '') {
          console.log(`[${(new Date()).toLocaleTimeString()}]: Adding ${this.entries[i]} to list.`)
          this.$store.dispatch('watchLists/updateList', {
            entry: this.entries[i],
            listName: this.listNames[i]
          })
        }
        this.entries[i] = ''
      },
      deleteEntry (name, i) {
        removeSelectedClasses()

        this.$store.dispatch('watchLists/removeFromList', {
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
      selectLabel (i) {
        return this.allSelected[i] ? 'Unselect all' : 'Select all'
      },
      moveTo (name, i) {
        this.selected[i].forEach((anime) => {
          this.$store.dispatch('watchLists/updateList', {
            listName: name,
            entry: anime
          })

          this.$store.dispatch('watchLists/removeFromList', {
            listName: this.actionsList[i - 1].list,
            entry: anime
          })
        })

        removeSelectedClasses()
      },
      deleteSelected (i) {
        this.selected[i].forEach((anime) => {
          this.$store.dispatch('watchLists/removeFromList', {
            listName: this.actionsList[i - 1].list,
            entry: anime
          })
        })

        removeSelectedClasses()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  #watch-list
    display inline-block

  h6
    margin 0

  span
    width 100%

  list-container
    background-color #303030

  .elem-number
    margin 10px 0 0 0
    font-size 18px
    font-weight 400
    font-style italic
    letter-spacing 1px

  .top-form
    padding-left 15px

  .entry-text
    margin-top 5px

  .add-button-container
    padding-right 2%
    display flex
    align-items center
</style>
