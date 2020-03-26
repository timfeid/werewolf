import axios from '@/axios'
import webtoken from 'jsonwebtoken'
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '../types'

const namespaced = true

type SettingsStore = {
  musicVolume: number
  voiceVolume: number
}

export const state: SettingsStore = {
  musicVolume: parseInt(localStorage['music-volume'] || '50', 10),
  voiceVolume: parseInt(localStorage['voice-volume'] || '75', 10),
}

const getters: GetterTree<SettingsStore, RootState> = {

}

const actions: ActionTree<SettingsStore, RootState> = {

}

const mutations: MutationTree<SettingsStore> = {
  setMusicVolume(state, volume: number) {
    localStorage.setItem('music-volume', volume.toString())
    state.musicVolume = volume
  },

  setVoiceVolume(state, volume: number) {
    localStorage.setItem('voice-volume', volume.toString())
    state.voiceVolume = volume
  },

}

export const settings: Module<SettingsStore, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
