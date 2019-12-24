import { User } from '@salem/data'
import { Socket } from '@salem/socket'
import { Card, cardConfiguration, Werewolf } from '@salem/werewolf'
import { EventEmitter } from 'typeorm/platform/PlatformTools'
import { MinionCard } from '../../werewolf/src/cards/minion'
import { RobberCard } from '../../werewolf/src/cards/robber'
import { SeerCard } from '../../werewolf/src/cards/seer'
import { TroublemakerCard } from '../../werewolf/src/cards/troublemaker'
import { VillagerCard } from '../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../werewolf/src/cards/werewolf'
import { LobbyUser } from './user'

interface Message {
  user?: LobbyUser;
  except?: LobbyUser;
  message: string;
  attrs?: Record<string, any>;
}

export interface CardPosition {
  type: 'middle' | 'player';
  index: number;
}

export class Lobby extends EventEmitter {
  protected _users: LobbyUser[] = []
  protected maxUsers = 10
  protected minUsers = 3
  protected deck: Card[] = []
  protected _middle: Card[] = []
  protected _id: string
  protected socket: Socket

  constructor (user: User, id: string, socket: Socket) {
    super()
    this.socket = socket
    this._id = id
    this.setDeck([
      WerewolfCard.name,
      MinionCard.name,
      SeerCard.name,
      RobberCard.name,
      TroublemakerCard.name,
      VillagerCard.name,
    ])
    this.addUser(user, true)
  }

  public addUser (user: User, isOwner = false) {
    this._users.push(new LobbyUser(user, isOwner))

    this.sendMessage({
      message: 'lobby.users',
      attrs: {
        users: this.toObject().users
      }
    })
  }

  get isStartable () {
    return this._users.length >= this.minUsers && this._users.length <= this.maxUsers && this.valid
  }

  get id () {
    return this._id
  }

  get valid () {
    return this.validation.valid
  }

  get validation () {
    return Werewolf.isValidDeck(this.deck, this._users.length)
  }

  get owner () {
    return this._users.find(u => u.isOwner)
  }

  get middle() {
    return this._middle
  }

  get users() {
    return this._users
  }

  setDeck (cardList: string[]) {
    this.deck = []
    cardList.forEach(c => {
      cardConfiguration.forEach(card => {
        if (card.card.name === c) {
          this.deck.push(new card.card)
        }
      })
    })

    this.emit('deck.set')
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  deal () {
    if (!this.isStartable) {
      return
    }
    this.shuffle()
    this._users.forEach(lu => {
      lu.card = this.deck.pop()
    })
    this._middle = this.deck.slice(0)
    this.emit('dealt')

    this.users.forEach(user => {
      this.sendMessage({
        user,
        message: 'lobby.start',
        attrs: {
          card: user.card.toObject(),
        }
      })
    })
  }

  getPlayerCard(index: number): Card {
    if (index > this._users.length) {
      return null
    }

    return this._users[index].card
  }

  getMiddleCard(index: number): Card {
    if (index > this.middle.length) {
      return null
    }

    return this.middle[index]
  }

  getCard(position: CardPosition) {
    if (position.type === 'player') {
      return this.users[position.index].card
    }

    return this.middle[position.index]
  }

  swapCards(swapIndex: CardPosition, withIndex: CardPosition) {
    let swapCard: Card
    if (swapIndex.type === 'player') {
      swapCard = this._users[swapIndex.index].card
      if (withIndex.type === 'middle') {
        this._users[swapIndex.index].card = this.middle[withIndex.index]
        this.middle[withIndex.index] = swapCard
      } else if (withIndex.type === 'player') {
        swapCard = this._users[swapIndex.index].card
        this._users[swapIndex.index].card = this._users[withIndex.index].card
        this._users[withIndex.index].card = swapCard
      }
    }

    if (!swapCard && swapIndex.type === 'middle') {
      this.swapCards(withIndex, swapIndex)
    }
  }

  findPlayersWithCard(cardId: string) {
    return this._users.filter(u => u.card.constructor.name === cardId)
  }

  toObject () {
    return {
      id: this._id,
      users: this.users.map(u => {
        return {
          name: u.user.name,
          id: u.user.id,
          owner: u.isOwner,
        }
      }),
      deck: this.deck.map(c => {
        return {
          name: c.name,
          description: c.description,
          isWerewolf: c.isWerewolf,
        }
      }),
    }
  }

  sendMessage (message: Message) {
    let users: LobbyUser[] = []
    if (message.user) {
      users = [message.user]
    } else if (message.except) {
      users = this.users.filter(u => u.user.id !== message.except.user.id)
    } else {
      users = this.users
    }
    users.forEach(u => this.sendTo(u.user, message.message, message.attrs))
  }

  async sendTo(user: User, msg: string, attrs: Record<string, any>) {
    const presence = await this.socket.presence.getSocketIdByUserId(user.id)
    if (presence) {
      this.socket.io.to(presence.socketId).emit(msg, attrs)
    }
  }
}
