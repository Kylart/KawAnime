<template>
  <v-dialog width="800" v-model="$store.state.info.show" persistent lazy absolute>
    <v-card class="secondary">
      <v-card-title class="headline">Result for «{{ searchTerm }}»</v-card-title>
      <v-card-text>
        <h4 v-if="error">{{ error }}</h4>
        <div v-else-if="loading">
          <h5 class="loading-text white--text">Gathering data...</h5>
          <h5 class="loading-text white--text">Info should be displayed in a few seconds</h5>
        </div>
        <v-card v-else class="secondary">
          <v-layout row wrap>
            <v-flex xs9>
              <v-card-title class="info-title">
                {{ info.alternativeTitles.japanese[0].replace('Japanese: ', '') }} [{{info.type }}]
              </v-card-title>
            </v-flex>
            <v-flex xs3>
              <v-card-title>{{ info.statistics.score.value }} ({{ info.statistics.score.count }})</v-card-title>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs3 class="info-pic-container">
              <img :src="info.image" class="info-pic"/>
            </v-flex>
            <v-flex xs9 class="info-synopsis-container">
              <p class="info-synopsis">{{ info.synopsis }}</p>
            </v-flex>
          </v-layout>
          <v-layout class="top-info">
            <v-flex xs9 class="info-text">{{ info.genres.join(', ') }}</v-flex>
            <v-flex xs3 class="info-text">{{ info.episodes }} {{ episodeLabel }}</v-flex>
          </v-layout>
          <v-layout class="bottom-info">
            <v-flex xs5 class="info-text">{{ info.studios.join(', ') }}</v-flex>
            <v-flex xs4 class="info-text">{{ info.classification }}</v-flex>
            <v-flex xs3 class="info-text">{{ info.status }} ({{ info.aired.split(' ')[2] }})</v-flex>
          </v-layout>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="blue--text darken-1 close-button" flat @click="closeResults()">Thanks!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default{
    computed: {
      info () {
        return this.$store.state.info.info
      },
      error () {
        return this.$store.state.info.error
      },
      loading () {
        return this.$store.state.info.loading
      },
      searchTerm () {
        return this.$store.state.info.term
      }
    }
  }
</script>

<style scoped>
  .loading-text
  {
    text-align: center;
    position: relative;
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