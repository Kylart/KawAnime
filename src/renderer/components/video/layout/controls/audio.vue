<template lang="pug">
  v-menu(offset-overflow, offset-y, top)
    template(v-slot:activator='{ on }')
      v-btn.ma-0(v-on='on', small, outlined, icon, color='secondary accent-2')
        v-icon(small) music_note

    v-list(
      dense,
      subheader
    )
      v-subheader Audio Track

      v-divider

      v-list-item(
        v-for='track in audios.tracks',
        :key='track.id',
        @click='setTrack(track)'
      )
        v-list-item-title(
          :class="{ 'blue--text': audios.current && track.id === audios.current.id }"
        ) {{ getLangName(track) }}
</template>

<script>
import LangName from '@/mixins/video/tracks/languageName.js'

export default {
  name: 'Audios',

  mixins: [LangName],

  props: {
    audios: {
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
