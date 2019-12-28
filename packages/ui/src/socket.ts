import io from 'socket.io-client'
import Vue from 'vue'
import events from './events'
import store from './store'

const url = process.env.VUE_APP_SOCKET_URL || ''

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
    console.log(obj)
    events.$emit('lobby.end', obj)
  })

}

export default function (app: Vue) {
  setup.call(app, store.getters['user/jwt'])
  store.watch(
    (state, getters) => getters['user/jwt'],
    setup.bind(app)
  )
}
