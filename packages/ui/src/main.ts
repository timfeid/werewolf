import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import socket from './socket'
import store from './store'

Vue.config.productionTip = false
Vue.use(Vuex)

const app = new Vue({
  router,
  store,
  render: h => h(App),
  async beforeCreate () {
    await this.$store.dispatch('user/init')
    await this.$store.dispatch('cards/getCards')
  }
}).$mount('#app')

socket(app)
