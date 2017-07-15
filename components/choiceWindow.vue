<template>
  <v-dialog v-model="show"
            persistent
            width="650">
    <v-card>
        <v-card-title class="headline">Add «{{ entry }}» to</v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <template v-for="i in 5">
              <v-flex v-if="!options[i - 1].half" xs4 class="checkbox-container">
                <v-checkbox v-model="selected"
                            :value="options[i - 1].value"
                            :label="options[i - 1].label"
                            class="option">
                </v-checkbox>
              </v-flex>
              <v-flex v-else xs6 class="checkbox-container">
                <v-checkbox v-model="selected"
                            :value="options[i - 1].value"
                            :label="options[i - 1].label"
                            class="option">
                </v-checkbox>
              </v-flex>
            </template>
          </v-layout>
        </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1" flat @click.native="add()">Add</v-btn>
        <v-btn class="blue--text darken-1" flat @click.native="hide()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      entry: ''
    },
    data () {
      return {
        selected: [],
        options: [{
          label: 'Watch list',
          value: 'watchList',
          half: false
        }, {
          label: 'Watching',
          value: 'watching',
          half: false
        }, {
          label: 'Seen',
          value: 'seen',
          half: false
        }, {
          label: 'On Hold',
          value: 'onHold',
          half: true
        }, {
          label: 'Dropped',
          value: 'dropped',
          half: true
        }]
      }
    },
    methods: {
      hide () {
        this.$store.commit('setAddToChoice', false)
      },
      add () {
        this.selected.forEach((listName) => {
          const entry = this.entry
          this.$store.dispatch('updateList', {
            listName: listName,
            entry: entry
          })
        })

        this.hide()
      }
    },
    computed: {
      show () {
        return this.$store.state.addToChoice
      }
    }
  }
</script>

<style scoped>
  .option
  {
    width: 60%;
    margin-left: 35%;
  }
</style>
