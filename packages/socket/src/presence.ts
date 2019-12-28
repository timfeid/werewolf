import redis from 'redis'
import { UserSocket } from './user-socket'

export interface SocketPresence {
  socketId: string;
  userId: string | number;
  when: number;
}

export class Presence {
  protected client: redis.RedisClient
  public constructor(client: redis.RedisClient) {
    this.client = client
  }


  /**
  * Update/insert a presense
  *
  * @param {UserSocket} socket - The socket
  **/
  public upsert (socket: UserSocket) {
    this.client.hset(
      'presence',
      socket.id,
      JSON.stringify({
        when: Date.now(),
        userId: socket.user.id,
      }),
      function (err) {
        if (err) {
          throw err
        }
      }
    )
  }

  /**
  * Remove a presence. Used when someone disconnects
  *
  * @param {UserSocket} socket - The socket
  **/
  public remove (socketId: string) {
    this.client.hdel(
      'presence',
      socketId,
      function (err) {
        if (err) {
          throw err
        }
      }
    )
  }
  public async list(): Promise<SocketPresence[]>;
  public list(returnPresent?: (err: Error, active: SocketPresence[]) => void): void;
  public async list (returnPresent?: (err: Error, active: SocketPresence[]) => void) {
    if (returnPresent) {
      this.listCallback(returnPresent)
    } else {
      return new Promise((resolve, reject) => {
        this.listCallback((err, active) => {
          if (err) {
            return reject(err)
          }
          return resolve(active)
        })
      })
    }


  }

  protected listCallback(callback: (err: Error, active: SocketPresence[]) => void): void {
    const active: SocketPresence[] = []
    const dead: string[] = []
    const now = Date.now()
    this.client.hgetall('presence', (err, presence) => {
      if (err) {
        return callback(err, [])
      }

      for (const connection in presence) {
        const details = JSON.parse(presence[connection])
        details.socketId = connection

        // Heartbeat lasts 25s
        if (now - details.when > 25000) {
          dead.push(details)
        } else {
          active.push(details)
        }
      }

      if (dead.length) {
        this._clean(dead)
      }

      return callback(null, active)
    })
  }

  /**
  * Cleans a list of connections by removing expired ones
  *
  * @param
  **/
  public _clean (toDelete: any[]) {
    for (const presence of toDelete) {
      this.remove(presence.socketId)
    }
  }

  public async getSocketIdByUserId(userId: number): Promise<SocketPresence> {
    const clients = (await this.list())
    return clients.find(socket => {
      return socket.userId === userId
    })
  }

  public connected () {
    return this.client.connected
  }
}
