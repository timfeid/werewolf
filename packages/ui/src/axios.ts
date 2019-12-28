import a from "axios"
import store from './store'


const axios = a.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT
})

axios.interceptors.request.use((config) => {
  config.headers.common.Authorization = 'Bearer ' + store.getters['user/jwt']

  return config
})

export default axios
