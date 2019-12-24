import { User } from '@tellimer/data'
import io from 'socket.io'

export interface UserSocket extends io.Socket {
  user?: User;
}
