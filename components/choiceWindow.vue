<template>
  <v-dialog v-model="show"
            width="650">
    <v-card>
      <v-card-row>
        <v-card-title>Add {{ entry }} to</v-card-title>
      </v-card-row>
      <v-card-row>
        <v-card-text>
          <v-row>
            <template v-for="i in 5">
              <v-col v-if="!options[i - 1].half" xs4 class="checkbox-container">
                <v-checkbox v-model="selected"
                            :value="options[i - 1].value"
                            :label="options[i - 1].label"
                            class="option"
                            light>
                </v-checkbox>
              </v-col>
              <v-col v-else xs6 class="checkbox-container">
                <v-checkbox v-model="selected"
                            :value="options[i - 1].value"
                            :label="options[i - 1].label"
                            class="option"
                            light>
                </v-checkbox>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card-row>
      <v-card-row actions>
        <v-btn class="blue--text darken-1" flat="flat" @click.native="add()">Add</v-btn>
      </v-card-row>
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
      add () {
        this.selected.forEach((listName) => {
          const entry = this.entry
          this.$store.dispatch('updateList', {
            listName: listName,
            entry: entry
          })
        })

        this.$store.commit('setAddToChoice', false)
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
