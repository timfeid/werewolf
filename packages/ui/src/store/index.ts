import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { cards } from './cards'
import { RootState } from './types'
import { user } from './user'
import { settings } from './settings'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0' // a simple property
  },
  modules: {
    user,
    cards,
    settings,
  }
}

export default new Vuex.Store<RootState>(store)
