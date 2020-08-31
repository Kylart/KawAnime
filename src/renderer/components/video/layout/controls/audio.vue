<template lang="pug">
  v-menu(offset-overflow, offset-y, top)
    template(v-slot:activator='{ on }')
      v-btn.ma-0(v-on='on', small, outlined, icon, color='secondary accent-2')
        v-icon(small) music_note

    v-list(dense).subtitle-lang
      v-list-item(
        v-for='track in audios.tracks',
        :key='track.id',
        @click='setTrack(track)'
      )
        v-list-item-title(
          :class="{ 'blue--text': audios.current && track.id === audios.current.id }"
        ) {{ track.lang }}
</template>

<script>
export default {
  name: 'Audios',

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
