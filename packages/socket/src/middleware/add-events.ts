import { app } from '../app'
import { UserSocket } from '../user-socket'

export default function () {
  return async (socket: UserSocket, next: CallableFunction) => {
    app.presence.upsert(socket)

    socket.conn.on('heartbeat', () => {
      app.presence.upsert(socket)
    })

    socket.on('disconnect', () => {
      app.presence.remove(socket.id)
    })

    next()
  }
}
