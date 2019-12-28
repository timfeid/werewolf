import axios from '@/axios'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '../types'
import { Card, CardsState } from './types'

const namespaced = true

export const state: CardsState = {
  cards: []
}

const getters: GetterTree<CardsState, RootState> = {
}

const actions: ActionTree<CardsState, RootState> = {
  async getCards ({commit, state}) {
    if (!state.cards.length) {
      const response = await axios.get('/cards')
      commit('setCards', response.data.data)
    }
  },
}

const mutations: MutationTree<CardsState> = {
  setCards (state, cards: Card[]) {
    state.cards = cards
  }
}

export const cards: Module<CardsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
