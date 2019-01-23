// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import '../src/common/stylus/icon.styl'
import '../src/common/stylus/reset.css'
import '../src/common/stylus/border.css'
import '../src/common/stylus/icon.styl'

Vue.use(router)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
