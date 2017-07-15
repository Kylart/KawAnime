<template>
  <v-dialog lazy absolute width="75%"
            v-model="$store.state.historyModal">
    <v-btn secondary dark
           @click.mative="refresh()"
           slot="activator">History
    </v-btn>
    <v-card class="secondary">
      <v-card-title class="headline">History</v-card-title>
      <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-expansion-panel expand class="secondary">
              <v-expansion-panel-content class="item-container"
                                         ripple
                                         v-for="item in Object.keys(history).reverse()"
                                         :key="item">
                <div slot="header"
                     v-ripple="true"
                     class="day">{{ item }}
                </div>
                <v-card>
                  <v-card-text class="lighten-3 info-container">
                    <v-layout row wrap>
                      <template v-for="info in history[item]">
                        <v-flex xs2 class="time entry"
                               :class="isDelete(info.type)">
                          {{ info.time }}
                        </v-flex>
                        <v-flex xs2 class="type entry" :class="isDelete(info.type)">
                          {{ info.type }}
                        </v-flex>
                        <v-flex xs7
                               class="ellipsis text entry"
                               :class="isDelete(info.type)">
                          {{ info.text }}
                        </v-flex>
                        <v-flex xs1
                               class="entry"
                               :class="isDelete(info.type)">
                          <v-icon class="delete-entry"
                                  v-ripple="true"
                                  @click.stop="clearEntry(info, item)">
                            clear
                          </v-icon>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-layout>
        </v-card-text>
      <v-divider></v-divider>
      <v-card-actions style=" padding-right: 20px;">
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1"
               flat
               style="width: 100px;"
               @click.native="$store.commit('setHistoryModal', false)">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {}
    },
    computed: {
      history: function () {
        return this.$store.state.history
      },
      modal: function () {
        return this.$store.state.historyModal
      }
    },
    watch: {
      modal: function () {
        console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing history.`)
        this.$store.dispatch('getHistory')
      }
    },
    methods: {
      isDelete (type) {
        return type === 'Delete'
          ? 'delete'
          : 'not-delete'
      },
      clearEntry (info, item) {
        this.$store.dispatch('removeFromHistory', {
          date: item,
          info
        })
      }
    }
  }
</script>

<style scoped>
  h6, p
  {
    margin: 0;
  }

  .expansion-panel > li
  {
    border: 1px solid #444 !important;
  }

  .ellipsis
  {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-container
  {
    background-color: rgb(50, 50, 50);
    border-bottom: 0 !important;
  }

  .info-container
  {
    background-color: rgb(50, 50, 50);
  }

  .day
  {
    position: relative;
    font-size: 17px;
    font-weight: 700;
    padding-left: 15px;
  }

  .entry
  {
    height: 27px;
    padding-top: 1px;
  }

  .not-delete
  {
    background-color: rgba(119, 221, 119, 0.62);
    border-bottom: 1px solid rgba(119, 221, 119, 0.62);
    border-top: 1px solid rgba(119, 221, 119, 0.62);
  }

  .delete
  {
    background-color: rgba(216, 24, 24, 0.55);
    border-bottom: 1px solid rgba(235, 26, 26, 0.20);
    border-top: 1px solid rgba(235, 26, 26, 0.20);
  }

  .time
  {
    font-size: 16px;
    font-weight: 600;
  }

  .type
  {
    font-size: 16px;
    font-style: italic;
  }

  .text
  {
    font-size: 16px;
    font-weight: 700;
  }

  .delete-entry
  {
    cursor: pointer;
    position: relative;
  }
</style>
