import { User } from '@salem/data'
import { JwtService } from '@salem/services'
import { UserSocket } from '../user-socket'

export default function () {
  return async (socket: UserSocket, next: CallableFunction) => {
    const header = socket.request.headers.authorization
    try {
      const user = await JwtService.getUserFromHeader(header)

      if (user instanceof User) {
        socket.user = user
        return next()
      }
    } catch (err) {
      return next(err)
    }

    return next(new Error('Unable to authenticate'))
  }
}
