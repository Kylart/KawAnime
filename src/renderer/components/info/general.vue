<template lang="pug">
  v-container.pt-0.pl-0(fluid)
    v-row(no-gutters)

      //- Show poster
      v-col(cols='3').pa-0
        v-img(:src='sanitize(info.img)', contain, height='370', position='left top')

      v-col(cols='9')
        v-card(flat)
          //- Title (EN + JAP)
          v-card-title.text-center.justify-center {{ info.title.en }} [{{ info.type }}]
          v-card-subtitle.jap.text-right {{ info.title.jp }}

          v-divider

          v-row(justify='space-between', no-gutters)
            //- Center part:
            v-col.pb-0(cols='8')
              //-   -- Synopsis
              v-container(fluid)
                .body-2.synopsis(
                  v-html="info.synopsis || 'No sysnopsis.'"
                )

              v-divider

              //-   -- Genres and studios
              v-row(justify='space-between')

                v-col(cols='5')
                  v-tooltip(top)
                    template(v-slot:activator='{ on }')
                      .ellipsis.font-italic(v-on='on') {{ info.genres.join(', ') }}
                    span {{ info.genres.join(', ') }}

                v-col(cols='5')
                  v-tooltip(top)
                    template(v-slot:activator='{ on }')
                      .ellipsis.text-uppercase.text-center(v-on='on') {{ info.studios }}
                    span {{ info.studios }}

                v-col(cols='2')
                  .ellipsis.text-uppercase.text-right {{ info.rating }}

            v-divider(vertical)

            //- Right part:
            //-   -- Status sentence
            //-   -- Mark
            v-col(cols='3')
              .d-flex.flex-column.justify-space-around.align-center
                v-container(fluid)
                  .caption {{ info.sentence }}

                v-container(fluid)
                  .text-center
                    v-progress-circular(
                      rotate='270',
                      size='80',
                      :value='score',
                      :color='scoreColor'
                    )
                      span {{ info.score }} / {{ info.scoreOutOf }}
</template>

<script>
// Mixins
import Info from '@/mixins/info/info.js'
import Sanitize from '@/mixins/info/sanitize.js'

export default {
  name: 'GeneralInformation',

  mixins: [
    // Brings `info` props
    Info,

    // Brings `sanitize` method
    Sanitize
  ],

  computed: {
    score () {
      return (this.info.score / this.info.scoreOutOf) * 100
    },
    scoreColor () {
      // 100% legit
      if (this.score < 50) return 'red'
      else if (this.score < 60) return 'orange'
      else if (this.score < 70) return 'lime accent-2'
      else if (this.score < 75) return 'light-green accent-2'
      else return 'green'
    }
  }
}
</script>

<style lang="stylus" scoped>
  .synopsis
    // Scrolling
    height 180px
    overflow-x hidden
    overflow-y auto

    // Text
    white-space pre-wrap
    text-align center
</style>
