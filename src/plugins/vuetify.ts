import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import tr from 'vuetify/src/locale/tr';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      
      dark: true,
      light: {
        primary: colors.blue.darken4, // #E53935
        secondary: colors.orange.lighten4, // #FFCDD2
        accent: colors.orange.darken4, // #3F51B5
      },
    },
  },
    lang: {
      locales: { tr },
      current: 'tr',
    },
});
