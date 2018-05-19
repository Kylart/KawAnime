import dragDrop from 'drag-drop'

export default {
  data: () => ({
    el: '#app',
    overlayEl: '#overlay'
  }),

  computed: {
    overlay: {
      set (val) {
        this.$store.commit('overlay/show', val)
      },
      get () {
        return this.$store.state.overlay.show
      }
    }
  },

  mounted () {
    const vm = this

    dragDrop(this.el, {

      onDragEnter () {
        vm.overlay = true
      }
    })

    dragDrop(this.overlayEl, {
      onDrop (files /*, pos, fileList */) {
        const { name: fullName, path } = files[0]

        const name = fullName.split(' ').slice(1, -1).join(' ') // nyanparser pls

        vm.$store.commit('streaming/play', {
          show: true,
          link: {
            link: path,
            name
          }
        })

        vm.overlay = false
      },
      onDragLeave () {
        vm.overlay = false
      }
    })
  }
}
