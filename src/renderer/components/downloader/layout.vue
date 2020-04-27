<template lang="pug">
  v-card.downloader.background
    .left
    .right

    v-card-text
      v-form.form(v-model='valid')
        v-container
          template(
            v-for='(input, i) in inputs'
          )
            v-row(justify='center')
              v-col(cols='12', sm='8', md='7')
                v-text-field(
                  v-model='inputs[i].model',
                  outlined,
                  :id='input.ref',
                  :ref='input.ref',
                  :label='input.label',
                  :placeholder='input.placeholder',
                  :required='input.required',
                  :type='input.type',
                  :rules='input.rules',
                  :hide-details='i === 2',
                  min='0'
                )

          v-row(justify='center')
            v-col(cols='12', sm='8')
              v-radio-group.qualities(v-model='quality', row)
                v-radio(
                  v-for='quality in qualities',
                  :key='quality',
                  :label='quality',
                  :value='quality',
                  color='orange'
                )

          v-row(justify='center')
            v-col(cols='12', sm='8', md='6', lg='4')
              v-btn(
                block,
                color='primary',
                :disabled='!valid',
                :loading='searching',
                @click='onSubmit'
              ) Download
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Downloader',

  mounted () {
    this.quality = this.config.quality

    this.$nextTick(() => {
      this.$refs.name[0].focus()
    })
  },

  data () {
    return {
      valid: false,
      searching: false,

      quality: null,
      inputs: [{
        placeholder: 'What are you looking for?',
        label: 'Name',
        model: '',
        type: 'text',
        ref: 'name',
        rules: [
          (value) => (value && value.length > 1) || 'At least two characters are required.'
        ],
        required: true
      }, {
        placeholder: 'From when?',
        label: 'Min episode',
        model: '',
        type: 'number',
        ref: 'from',
        required: false
      }, {
        placeholder: 'Until when?',
        label: 'Max episode',
        model: '',
        type: 'number',
        ref: 'until',
        required: false
      }]
    }
  },

  computed: {
    ...mapState('config', [
      'qualities',
      'config'
    ]),

    form () {
      return {
        name: this.inputs[0].model,
        fromEp: this.inputs[1].model,
        untilEp: this.inputs[2].model,
        quality: this.quality,
        fansub: this.config.fansub,
        feed: this.config.feed
      }
    }
  },

  methods: {
    ...mapActions('downloader', [
      'download'
    ]),

    async onSubmit () {
      this.searching = true

      await this.download(this.form)

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
      pointer-events none

    .left
      left 2%
      width 25%
      background-image url('../../assets/images/downloader-char-left.png')

    .right
      right 2%
      width 20%
      background-image url('../../assets/images/downloader-char-right.png')

  .form
    background-color rgba(0, 0, 0, 0.6)
</style>
