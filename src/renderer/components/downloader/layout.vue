<template lang="pug">
  v-card.background
    .left
    .right

    v-container(fill-height)
      v-layout.form(row, wrap, justify-center, align-center)
        .input-container(
          v-for='(input, i) in inputs',
          :key='input.name'
        )
          v-text-field(
            v-model='inputs[i].model',
            :label='input.label',
            :placeholder='input.placeholder',
            :required='input.required',
            :type='input.type',
            min='0'
          )
        .quality-container
          v-radio-group.group-container(v-model='quality', row)
            v-radio(
              v-for='quality in qualities',
              :key='quality',
              :label='quality',
              :value='quality',
              color='orange'
            )

    .button-container
      .button
        v-btn(block, :loading='searching', @click='download') Download
</template>

<script>
export default {
  name: 'Downloader',

  mounted () {
    // We initialize those variables from the store's config
    ['quality', 'fansub', 'feed']
      .forEach(
        (_var) => this.$set(this, _var, this.$store.state.config.config[_var])
      )

    this.$ipc.on(this.$eventsList.download.success, () => {
      this.$emit('downloaded')
    })
  },

  data: () => ({
    inputs: [{
      placeholder: 'What are you looking for?',
      label: 'Name',
      model: '',
      type: 'text',
      required: true
    }, {
      placeholder: 'From when?',
      label: 'Min episode',
      model: '',
      type: 'number',
      required: false
    }, {
      placeholder: 'Until when?',
      label: 'Max episode',
      model: '',
      type: 'number',
      required: false
    }],
    quality: '',
    fansub: '',
    feed: '',
    searching: false
  }),

  computed: {
    qualities: {
      get () {
        return this.$store.state.config.qualities
      },
      set () {}
    },
    form () {
      return {
        name: this.inputs[0].model,
        fromEp: this.inputs[1].model,
        untilEp: this.inputs[2].model,
        quality: this.quality,
        fansub: this.fansub,
        feed: this.feed
      }
    }
  },

  methods: {
    async download () {
      this.searching = true

      await this.$store.dispatch('downloader/download', this.form)

      this.searching = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .background
    background-image url('../../assets/images/downloader-back.jpg')
    background-size cover
    position relative
    padding 16px

    .left, .right
      position absolute
      height 35%
      z-index 10
      bottom 3%
      background-size contain

    .left
      left 2%
      width 25%
      background-image url('../../assets/images/downloader-char-left.png')

    .right
      right 2%
      width 20%
      background-image url('../../assets/images/downloader-char-right.png')

  .form
    padding-top 16px
    background-color rgba(0, 0, 0, 0.6)

    .input-container
      width 55%
      padding 16px 8px

    .quality-container
      padding 16px 48px
      width 80%
      display flex
      justify-content space-between

      .group-container
        width 100%

  .button-container
    display flex
    justify-content center

    .button
      width 50%
      padding 8px
</style>
