import NotFoundImage from '../../assets/images/not-found.png'

export default {
  methods: {
    sanitize (link) {
      // This redirects unwanted picture links to fallback picture
      return /(questionmark|missing)/.test(link)
        ? NotFoundImage
        : link
    }
  }
}
