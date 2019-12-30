import { JwtService } from '@werewolf/services'
import { UserSocket } from '../user-socket'

export default function () {
  return async (socket: UserSocket, next: CallableFunction) => {
    const header = socket.request.headers.authorization
    console.log(header)
    try {
      const user = await JwtService.getUserFromHeader(header)
      console.log(user)
      if (user !== false && user.id !== undefined) {
        socket.user = user
        return next()
      }
    } catch (err) {
      return next(err)
    }

    return next(new Error('Unable to authenticate'))
  }
}
