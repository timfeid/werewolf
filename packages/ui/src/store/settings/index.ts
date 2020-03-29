import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { RootState } from '../types'

const namespaced = true

type SettingsStore = {
  musicVolume: number
  voiceVolume: number
  notificationVolume: number
  showKeeperTutorial: boolean
  showSettingsTutorial: boolean
}

export const state: SettingsStore = {
  musicVolume: parseInt(localStorage['music-volume'] || '25', 10),
  voiceVolume: parseInt(localStorage['voice-volume'] || '75', 10),
  notificationVolume: parseInt(localStorage['notification-volume'] || '75', 10),
  showKeeperTutorial: !(!!localStorage['shown-keeper-tutorial']),
  showSettingsTutorial: !(!!localStorage['shown-settings-tutorial']),
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

  shownKeeperTutorial(state) {
    localStorage.setItem('shown-keeper-tutorial', 'true')
    state.showKeeperTutorial = false
  },

  shownSettingsTutorial(state) {
    localStorage.setItem('shown-settings-tutorial', 'true')
    state.showSettingsTutorial = false
  },

}

export const settings: Module<SettingsStore, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
