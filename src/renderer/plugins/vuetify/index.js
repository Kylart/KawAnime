import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import Vuetify from 'vuetify/lib'

import theme from './theme.js'

export default (Vue) => {
  Vue.use(Vuetify)

  return new Vuetify({
    theme,
    icons: {
      iconfont: 'md'
    }
  })
}
