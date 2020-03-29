import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '../types'

const namespaced = true

type SettingsStore = {
  musicVolume: number
  voiceVolume: number
  notificationVolume: number
}

export const state: SettingsStore = {
  musicVolume: parseInt(localStorage['music-volume'] || '25', 10),
  voiceVolume: parseInt(localStorage['voice-volume'] || '75', 10),
  notificationVolume: parseInt(localStorage['notification-volume'] || '75', 10),
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

  setNotificationVolume(state, volume: number) {
    localStorage.setItem('notification-volume', volume.toString())
    state.notificationVolume = volume
  },

}

export const settings: Module<SettingsStore, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
