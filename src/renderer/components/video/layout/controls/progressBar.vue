<script>
import VSlider from 'vuetify/lib/components/VSlider/VSlider'

import Hover from '@/mixins/video/hover'

export default {
  name: 'progress-bar',

  mixins: [
    VSlider,
    Hover
  ],

  props: {
    buffer: Array,
    // Override
    thumbLabel: {
      type: Boolean,
      default: true
    },
    // Override
    thumbSize: {
      type: [Number, String],
      default: 48
    }
  },

  computed: {
    maxTime () {
      return this.$store.getters['streaming/controls'].duration
    },
    inputValue: {
      get () {
        return this.value
      },
      set (value) {
        const { min, max } = this
        value = Math.min(Math.max(value, min), max)

        if (value !== this.value) {
          this.$emit('input', value)
        }
      }
    }
  },

  methods: {
    genListeners () {
      return {
        mouseenter: this.onMouseEnter,
        mouseleave: this.onMouseLeave,
        mousemove: this.onMouseOver,
        blur: this.onBlur,
        click: this.onSliderClick,
        focus: this.onFocus,
        keydown: this.onKeyDown,
        keyup: this.onKeyUp
      }
    },
    formatLabel (value) {
      const time = (value / 100) * this.maxTime

      const hours = Math.floor(time / 3600) || null
      const minutes = Math.floor(time / 60) || null
      const seconds = Math.floor(time % 60) || null

      let result = ''

      result += (hours && `${hours}:`) || ''
      result += `0${minutes || '00'}:`.slice(-3)
      result += `0${seconds || '00'}`.slice(-2)

      return result
    },
    genBuffers () {
      const ticks = this.buffer.map(([start, end]) => {
        const span = this.$createElement('span', {
          class: 'slider__buffer',
          style: {
            left: `${start}%`,
            width: `${end - start}%`
          }
        })

        return span
      })

      return this.$createElement(
        'div',
        {
          class: 'slider__buffer-container'
        },
        ticks
      )
    },

    genHoverPreviewContainer () {
      return this.$createElement('div', {
        on: this.genListeners(),
        staticClass: 'preview',
        style: {
          height: '12px',
          width: '100%'
        }
      })
    },

    // Override
    genChildren () {
      return [
        // this.genBuffers(),
        this.genInput(),
        this.genTrackContainer(),
        this.genSteps(),
        this.genHoverPreviewContainer(),
        this.genHoverThumbContainer(),
        this.genThumbContainer(
          this.formatLabel(this.internalValue),
          this.inputWidth,
          this.isActive,
          this.isFocused,
          this.onThumbMouseDown,
          this.onFocus,
          this.onBlur
        )
      ]
    }
  }
}
</script>

<style lang="stylus">
.slider__buffer-container
  transform translate3d(0, -50%, 0)
  position absolute
  left 0
  height 2px
  width 100%
  top 50%
  overflow hidden

  .slider__buffer
    display inline-block
    vertical-align middle
    background-color #0D47A1
    height 2px
    position absolute
</style>

<style lang="stylus" scoped>
  .video-thumb-container
    height 120px
    position absolute
    background-color rgb(30, 30, 30)
    transform translate(-50%)
    text-align center
    border-radius 2px
    border 1px solid rgba(255, 255, 255, 0.4)

    .video-thumb-preview
      margin-bottom 0

    .video-thumb-text-container
      height 20px
      padding 0 0 3px
      border-top 1px solid rgba(255, 255, 255, 0.3)
      letter-spacing 0.04em
      font-size 14px
      line-height 14px
      font-weight 400

      display flex
      justify-content center
      align-items center

  .thumb-container
    position absolute
    left 0
    bottom 0

  .thumb-content
    display flex
    align-items center
    justify-content center
    font-size 14px
    font-weight 400
    letter-spacing 0.03em
    color #fff
    width 48px
    height 48px
    border-radius 50% 50% 0
    position absolute
    left 0
    bottom 100%
    user-select none

    transform translateY(-20%) translateY(-12px) translateX(-50%) rotate(45deg)

    > *
      transform rotate(-45deg)
</style>
