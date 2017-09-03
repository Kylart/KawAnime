import {
  Vuetify,
  VApp,
  VGrid,
  VSelect,
  VMenu,
  VList,
  VNavigationDrawer,
  VToolbar,
  VSystemBar,
  VSubheader,
  VFooter,
  VBtn,
  VIcon,
  VSnackbar,
  VCard,
  VDialog,
  VTextField,
  VCheckbox,
  VProgressCircular,
  VRadioGroup,
  VTabs,
  VSwitch
} from 'vuetify'

import { Tooltip, Ripple } from 'vuetify/src/directives'

export default (Vue) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VSelect,
      VMenu,
      VGrid,
      VList,
      VNavigationDrawer,
      VToolbar,
      VSystemBar,
      VSubheader,
      VFooter,
      VBtn,
      VIcon,
      VSnackbar,
      VCard,
      VDialog,
      VTextField,
      VCheckbox,
      VProgressCircular,
      VRadioGroup,
      VTabs,
      VSwitch
    },
    directives: {
      Tooltip,
      Ripple
    }
  })
}
