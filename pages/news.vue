<template>
  <v-container fluid style="padding: 0; min-height: 92vh;">
    <loader v-if="!$store.state.news.length"></loader>

    <v-container fluid v-else>
      <v-layout row wrap class="news-container">
        <v-flex xs12 class="refresh-button-container">
          <v-btn icon
                 class="refresh-button"
                 @click="refresh()">
            <v-icon large>refresh</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12
               class="elem elevation-3"
               v-ripple="true"
               v-for="item in $store.state.news" :key="item.name">
          <v-layout row wrap>
            <v-flex xs12>
              <h3 class="title">{{ item.title }}</h3>
            </v-flex>
            <v-flex md2 xs3 >
              <img :src="item.image" class="image"/>
            </v-flex>
            <v-flex md10 xs9>
              <v-layout row wrap>
                <v-flex xs12><p class="synopsis">{{ item.text }}</p></v-flex>
              </v-layout>
              <v-layout row wrap xs12 class="link">
                <div class="button-container">
                  <v-btn secondary block @click="open(item.link)">Open</v-btn>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    head () {
      return {
        title: 'News',
        meta: [
          {hid: 'description', name: 'description', content: 'Anime world news'}
        ]
      }
    },
    data () {
      return {}
    },
    methods: {
      open (link) {
        this.$store.dispatch('openNewsLink', link)
      },
      refresh () {
        console.log('Ok')
        this.$store.dispatch('refreshNews')
      }
    }
  }
</script>

<style scoped>
  /* ----- Refresh button ----- */
  .refresh-button-container
  {
    display: inline-block;
    text-align: right;
    margin-top: 5px;
    margin-bottom: 2px;
    padding-right: 3%;
  }

  .refresh-button
  {
    display: inline-block;
  }

  /* Needed */
  .icon--large
  {
    height: 2.5rem;
  }

  /* ---------- ELEM ---------- */
  .news-container
  {
    padding: 0 2% 1% 2%;
  }

  .elem
  {
    position: relative;
    margin-bottom: 15px;
    padding: 0;
    background-color: rgb(60, 60, 60);
    color: rgba(255, 255, 255, 0.8);
  }

  .elem:hover
  {
    transition: all 0.25s;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12) !important;
  }

  .news-container h3
  {
    color: rgba(255, 255, 255, 0.8);
  }

  .title
  {
    line-height: 24px;
    margin-top: 10px;
    padding-left: 2%;
    padding-right: 2%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .image
  {
    height: 220px;
    max-width: 100%;
  }

  .synopsis
  {
    padding-top: 2%;
    height: 150px;
  }

  .link
  {
    height: 50%;
    width: 100%;
    text-align: right;
    display: inline-block;
    padding: 0 5% 0 10%;
  }

  .button-container
  {
    display: inline-block;
    width: 15%;
  }
</style>
