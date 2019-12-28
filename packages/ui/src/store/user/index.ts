import axios from '@/axios'
import webtoken from 'jsonwebtoken'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '../types'
import { UserState } from './types'

const namespaced = true

export const state: UserState = {
  jwt: '',
  decoded: {},
}

const getters: GetterTree<UserState, RootState> = {
  name (state) {
    return state.decoded.name || ''
  },

  id (state) {
    return state.decoded.id || ''
  },

  jwt (state) {
    return state.jwt
  }
}

const actions: ActionTree<UserState, RootState> = {
  async updateName ({commit, state, getters}, name: string) {
    const response = await axios.post('/jwt', {
      name,
      ...(getters.id ? {id: getters.id} : {})
    })

    if (response.data.data) {
      commit('setJwt', response.data.data.jwt)
    }
  },

  async init ({commit}) {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      commit('setJwt', jwt)
    } else {
      const response = await axios.post('/jwt', {
        name: '',
      })
      if (response.data.data) {
        commit('setJwt', response.data.data.jwt)
      }
    }
  }
}

const mutations: MutationTree<UserState> = {
  setJwt (state, jwt: string) {
    localStorage.setItem('jwt', jwt)
    state.jwt = jwt
    state.decoded = webtoken.decode(jwt) as { [key: string]: any }
  }
}

export const user: Module<UserState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
