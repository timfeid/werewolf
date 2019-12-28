import { User } from '@werewolf/data'
import io from 'socket.io'

export interface UserSocket extends io.Socket {
  user?: User;
}
