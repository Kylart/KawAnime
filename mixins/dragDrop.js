import dragDrop from 'drag-drop'

export default {
  data: () => ({
    el: '#app'
  }),

  mounted () {
    const vm = this

    dragDrop(this.el, {
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
      },
      onDragEnter () {},
      onDragLeave () {}
    })
  }
}
