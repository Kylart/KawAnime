<template lang="pug">
  v-dialog(width='800', v-model='$store.state.info.show', persistent, lazy, absolute)
    v-card
      v-card-title.headline Result for «{{ searchTerm }}»
      v-card-text
        h4(v-if='error') {{ error }}
        div(v-else-if='loading')
          h5.loading-text.white--text Gathering data...
          h5.loading-text.white--text Info should be displayed in a few seconds
        v-card.secondary.pb-3(v-else)
          v-layout(row, wrap)
            v-flex.flex-v-centered(xs9)
              v-card-title.info-title
                | 「{{ info.alternativeTitles.japanese[0].replace('Japanese: ', '') }}」ー {{ info.type }}
            v-flex(xs3)
              v-card-title.score-container
                p.info-score {{ info.statistics.score.value }}
                p.info-score ({{ info.statistics.score.count }} votes)
          v-layout.mb-3(row, wrap)
            v-flex.info-pic-container(xs3)
              img.info-pic(:src='info.image')
            v-flex.info-synopsis-container(xs9)
              p.info-synopsis {{ info.synopsis }}
          v-layout.top-info
            v-flex.info-text.pl-2(xs9)
              span.genre-title Genres:
              span.info-genres {{ info.genres.join(' / ') }}
            v-flex.info-text.h-centered(xs3) {{ info.episodes }} {{ episodeLabel }}
          v-layout.bottom-info
            v-flex.info-text.pl-2(xs5)
              span.genre-title Studios:
              span.info-genres.pl-4 {{ info.studios.join(' / ') }}
            v-flex.info-text(xs4) {{ info.classification }}
            v-flex.info-text.h-centered(xs3) {{ info.status }} ({{ info.aired.split(' ')[2] }})
      v-card-actions
        v-spacer
        v-btn.blue--text.darken-1.close-button(flat, @click="$store.commit('showInfo', false)") Thanks!
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
      },
      episodeLabel () {
        return this.info.episodes !== 1
          ? 'episodes'
          : 'episode'
      }
    }
  }
</script>

<style scoped>
  .flex-v-centered
  {
    display: flex;
    align-items: center;
  }

  .h-centered
  {
    text-align: center;
  }

  .loading-text
  {
    text-align: center;
    position: relative;
  }

  .info-title
  {
    width: 100%;
    padding-left: 15% !important;
    font-family: 'Hiragino Mincho Pro', 'MS PMincho', serif;
    font-size: 24px;
    font-weight: 100;
  }

  .score-container
  {
    justify-content: center;
  }

  .info-score
  {
    margin-bottom: 0;
    font-size: 20px;
    font-weight: 200;
    letter-spacing: 1px;
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
    padding: 20px;
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

  .genre-title
  {
    padding-left: 15px;
    letter-spacing: 1px;
    font-weight: 100;
    font-style: italic;
  }

  .info-genres
  {
    padding-left: 5%;
    letter-spacing: 1px;
  }
</style>
