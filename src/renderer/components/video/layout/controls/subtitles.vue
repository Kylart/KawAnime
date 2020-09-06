<template lang="pug">
  v-menu(offset-overflow, offset-y, top)
    template(v-slot:activator='{ on }')
      v-btn.ma-0(v-on='on', small, outlined, icon, color='secondary accent-2')
        v-icon(small) subtitles

    v-list(
      dense,
      subheader
    )
      v-subheader Subtitle Track

      v-divider

      v-list-item(
        v-for='track in subtitles.tracks',
        :key='track.id',
        @click='setTrack(track)'
      )
        v-list-item-title(
          :class="{ 'blue--text': subtitles.current && track.id === subtitles.current.id }"
        ) {{ getLangName(track) }}
</template>

<script>
import LangName from '@/mixins/video/tracks/languageName.js'

export default {
  name: 'Subtitles',

  mixins: [LangName],

  props: {
    subtitles: {
      type: Object
    }
  },

  methods: {
    setTrack (track) {
      this.$emit('updateTrack', track)
    }
  }
}
</script>
