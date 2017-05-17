<template>
  <v-dialog scrollable width="75%"
            v-model="$store.state.infoModal">
    <v-btn secondary dark
           @click.mative="refresh()"
           slot="activator">History
    </v-btn>
    <v-card class="secondary">
      <v-card-title>NAME</v-card-title>
      <v-divider></v-divider>
      <v-card-row height="70%">
        <v-card-text>
          <v-row>
            <h1>Hello</h1>
          </v-row>
        </v-card-text>
      </v-card-row>
      <v-divider></v-divider>
      <v-card-row actions style=" padding-right: 20px;">
        <v-btn class="white--text darken-1"
               style="width: 100px;"
               primary
               @click.native="$store.commit('setInfoModal', false)">
          Close
        </v-btn>
      </v-card-row>
    </v-card>
  </v-dialog>
</template>

<script>
  import Loader from '~components/loader.vue'

  export default{
    data() {
      return {}
    },
    computed: {

    },
    components: {
      Loader
    }
  }
</script>

<style scoped>

</style>