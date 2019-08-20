import Vue from 'vue'

import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
// import 'element-theme-dark/lib/index.css'
import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  mounted: function () {
    this.$router.push({path: '/main'})
  }
}).$mount('#app')
