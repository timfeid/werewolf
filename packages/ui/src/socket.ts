import io from 'socket.io-client'
import Vue from 'vue'
import events from './events'
import store from './store'

const url = process.env.VUE_APP_SOCKET_URL || `${window.location.host}:3052`

function setup (this: Vue, jwt: string) {
  const socket = io(url, {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    },
    reconnectionDelay: 0,
    forceNew: true,
  })

  socket.on('lobby.refresh', ({ lobby }: any) => {
    events.$emit('lobby.refresh', lobby)
  })

  socket.on('lobby.card', ({ lobby, card }: any) => {
    events.$emit('lobby.refresh', lobby)
    events.$emit('lobby.card', lobby, card)
  })

  socket.on('lobby.turn.timer', (obj: {timeLeft: number; lobby: any}) => {
    events.$emit('lobby.turn.timer', obj)
  })

  socket.on('lobby.turn.start', (a: any) => {
    events.$emit('lobby.turn.start', a)
  })

  socket.on('lobby.turn.start', (a: any) => {
    events.$emit('lobby.turn.start', a)
  })

  socket.on('lobby.turn.mine.start', (a: any) => {
    events.$emit('lobby.turn.mine.start', a)
  })

  socket.on('lobby.turn.end', (a: any) => {
    events.$emit('lobby.turn.end', a)
  })

  socket.on('lobby.turn.mine.end', (a: any) => {
    events.$emit('lobby.turn.mine.end', a)
  })

  socket.on('lobby.jury', (obj: { timeLeft: number; lobby: any }) => {
    events.$emit('lobby.jury', obj)
  })

  socket.on('lobby.end', (obj: any) => {
    events.$emit('lobby.end', obj)
  })

  socket.on('lobby.restart', (obj: any) => {
    events.$emit('lobby.restart', obj)
  })

  socket.on('lobby.disconnect', (obj: any) => {
    events.$emit('lobby.disconnect', obj)
  })

  socket.on('lobby.join', (obj: any) => {
    events.$emit('lobby.join', obj)
  })

}

export default function (app: Vue) {
  setup.call(app, store.getters['user/jwt'])
  store.watch(
    (state, getters) => getters['user/jwt'],
    setup.bind(app)
  )
}
