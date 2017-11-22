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
  VSwitch,
  VExpansionPanel,
  VDivider,
  VTooltip,
  VDataTable,
  VDatePicker,
  VChip,
  VBadge,
  VSpeedDial
} from 'vuetify'

import { Ripple } from 'vuetify/es5/directives'

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
      VSwitch,
      VExpansionPanel,
      VDivider,
      VTooltip,
      VDataTable,
      VDatePicker,
      VChip,
      VBadge,
      VSpeedDial
    },
    directives: {
      Ripple
    }
  })
}
