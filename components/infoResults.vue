<template lang="pug">
  v-dialog(width='800', v-model='$store.state.info.show', persistent, lazy, absolute)
    v-card.secondary
      v-card-title.headline Result for «{{ searchTerm }}»
      v-card-text
        h4(v-if='error') {{ error }}
        div(v-else-if='loading')
          h5.loading-text.white--text Gathering data...
          h5.loading-text.white--text Info should be displayed in a few seconds
        v-card.secondary(v-else)
          v-layout(row, wrap)
            v-flex(xs9)
              v-card-title.info-title
                | {{ info.alternativeTitles.japanese[0].replace('Japanese: ', '') }} [{{info.type }}]
            v-flex(xs3)
              v-card-title {{ info.statistics.score.value }} ({{ info.statistics.score.count }})
          v-layout(row, wrap)
            v-flex.info-pic-container(xs3)
              img.info-pic(:src='info.image')
            v-flex.info-synopsis-container(xs9)
              p.info-synopsis {{ info.synopsis }}
          v-layout.top-info
            v-flex.info-text(xs9) {{ info.genres.join(', ') }}
            v-flex.info-text(xs3) {{ info.episodes }} {{ episodeLabel }}
          v-layout.bottom-info
            v-flex.info-text(xs5) {{ info.studios.join(', ') }}
            v-flex.info-text(xs4) {{ info.classification }}
            v-flex.info-text(xs3) {{ info.status }} ({{ info.aired.split(' ')[2] }})
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