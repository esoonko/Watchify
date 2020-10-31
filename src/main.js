// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import cookies from 'vue-cookies'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(Vuetify, {
  iconfont: 'md'
})
Vue.use(cookies)

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    region: 'SE',
    language: 'SE',
    key: '',
    libraries: 'places'
    // more can (should?) be added here!!
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
