import { Card, cardConfiguration, User, Werewolf } from '@werewolf/werewolf'
import { EventEmitter } from 'typeorm/platform/PlatformTools'
import { MinionCard } from '../../werewolf/src/cards/minion'
import { RobberCard } from '../../werewolf/src/cards/robber'
import { SeerCard } from '../../werewolf/src/cards/seer'
import { TroublemakerCard } from '../../werewolf/src/cards/troublemaker'
import { VillagerCard } from '../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../werewolf/src/cards/werewolf'
import { LobbyUser } from './user'



export interface CardPosition {
  type: 'middle' | 'player';
  index: number;
}

const defaultColors = [
  // pinks
  '#FFC0CB',
  '#FF69B4',
  '#C71585',
  // reds
  '#FFA07A',
  '#DC143C',
  '#FF0000',
  // greens
  '#556B2F',
  '#00FF00',
  '#90EE90',
  // orange
  '#FFA500',
  // yellow
  '#FFFF00',
  '#FFDAB9',
  '#FFD700',
  // blue
  '#7FFFD4',
  '#B0C4DE',
  '#1E90FF',
  '#0000FF',
  '#000080',
  // browns
  '#800000',
  '#8B4513',
  '#D2B48C',
  // random
  '#E6E6FA',
  '#800080',
  '#FFFFFF',
  '#C0C0C0',
  '#808080',
  '#000000',
]

export class Lobby extends EventEmitter {
  protected _users: LobbyUser[] = []
  protected minUsers = 3
  protected deck: Card[] = []
  protected _cards: Card[] = []
  protected _middle: Card[] = []
  protected _id: string
  protected dealt = false
  protected _started = false
  protected turn = 0
  protected remainingColors = [...defaultColors]
  protected timeLeft = 0
  protected juryTimeLeft = 300

  constructor (id: string) {
    super()
    this._id = id
    this.shuffleColors()
    this.setCards([
      WerewolfCard.name,
      MinionCard.name,
      SeerCard.name,
      RobberCard.name,
      TroublemakerCard.name,
      VillagerCard.name,
    ])
  }

  public addUser (user: User, isOwner = false) {
    if (!this._users.find(u => u.user.id === user.id)) {
      const u = new LobbyUser(user, this.remainingColors.pop(), isOwner)
      this._users.push(u)
      this.emit('joined', u)
    }
  }

  get id () {
    return this._id
  }

  get isValid () {
    return this.validation.valid
  }

  get validation () {
    return Werewolf.hasValidCards(this._cards, this._users.length)
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

  get cards () {
    return this._cards
  }

  setCards (cardList: string[]) {
    this._cards = []
    cardList.forEach(c => {
      cardConfiguration.forEach(card => {
        if (card.card.name === c) {
          // eslint-disable-next-line
          // @ts-ignore
          this._cards.push(new card.card)
        }
      })
    })
    this.emit('cards.set')
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  shuffleColors() {
    for (let i = this.remainingColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.remainingColors[i], this.remainingColors[j]] = [this.remainingColors[j], this.remainingColors[i]]
    }
  }

  deal () {
    if (this.isValid) {
      this.deck = [...this._cards]
      this.shuffle()
      this._users.forEach(lu => {
        lu.card = this.deck.pop()
      })
      this._middle = this.deck.slice(0)
      this.dealt = true
      this.emit('dealt')
    }

    return {
      success: this.isValid,
      errors: this.validation.errors.map(e => e.message),
    }
  }

  start () {
    if (this.isValid && this.dealt) {
      this._started = true
      this.emit('start')
      this.nextTurn()
    }

    return {
      success: this.isValid && this.dealt
    }
  }

  currentTurn () {
    if (!this.turn) {
      return null
    }

    return cardConfiguration[this.turn - 1].card
  }

  turnExistsFor (card: typeof Card) {
    return this._cards.find(c => c.constructor.name === card.name)
  }

  startTurn(card: Card) {
    this.timeLeft = card.turnLength + 1
    this.emit('turn.start', {card, data: card.data(this)})
  }

  endTurn (card: Card) {
    this.emit('turn.end', {card})
    this.nextTurn()
  }

  turnTimer (card: Card) {
    this.timeLeft--

    if (this.timeLeft === 1) {
      setTimeout(this.endTurn.bind(this, card), process.env.NODE_ENV === 'test' ? 1 : 1000)
    } else if (this.timeLeft === 0) {
      this.endTurn(card)
    } else {
      setTimeout(this.turnTimer.bind(this, card), process.env.NODE_ENV === 'test' ? 1 : 1000)
    }

    this.emit('turn.timer', {timeLeft: this.timeLeft})
  }

  nextTurn () {
    if (this.turn++ < cardConfiguration.length) {
      const c = this.turnExistsFor(cardConfiguration[this.turn - 1].card)
      if (c) {
        this.startTurn(c)
        return this.turnTimer(c)
      }
      this.nextTurn()
    } else {
      this.juryPhase()
    }
  }

  juryPhase () {
    this.juryTimeLeft--
    this.emit('jury', {timeLeft: this.juryTimeLeft})
    if (this.juryTimeLeft > 0) {
      setTimeout(this.juryPhase.bind(this), process.env.NODE_ENV === 'test' ? 1 : 1000)
    } else {
      this.emit('end')
    }
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

  convertToCardPosition(position: string): CardPosition {
    return {
      type: position[0] === 'M' ? 'middle' : 'player',
      index: parseInt(position[1], 10) - 1,
    }
  }

  getCard(position: CardPosition | string) {
    if (typeof position === 'string') {
      position = this.convertToCardPosition(position)
    }

    if (position.type === 'player') {
      return this.users[position.index].card
    }

    return this.middle[position.index]
  }

  getOriginalCardForUserId(userId: string | number) {
    for (const u of this._users) {
      if (u.user.id === userId) {
        return u.originalCard.toObject()
      }
    }
  }

  getCardForUserId(userId: string | number) {
    for (const u of this._users) {
      if (u.user.id === userId) {
        return u.card.toObject()
      }
    }
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

  findPlayersWithOriginalCard(cardId: string) {
    return this._users.filter(u => u.originalCard.constructor.name === cardId)
  }

  findOriginalWerewolves() {
    return this._users.filter(u => u.originalCard.isWerewolf)
  }

  end () {
    this.juryTimeLeft = 1
  }

  setClaim(userId: string, cardId: string) {
    const card = this.cards.find(c => c.constructor.name === cardId)
    const user = this.users.find(u => u.user.id === userId)
    if (!card || !user) {
      console.log(cardId, this.cards, userId, this.users)
      return false
    }

    user.claim = card

    this.emit('user.claimed', user)

    return user.claim
  }

  setVote(userId: string, voteUserId: string) {
    const user = this.users.find(u => u.user.id === userId)
    const vote = voteUserId === 'middle' ? {user: {id: 'middle', name: 'middle'}} : this.users.find(u => u.user.id === voteUserId)
    if (!vote || !user) {
      console.log(voteUserId, userId, this.users)
      return false
    }

    user.vote = vote.user

    this.emit('user.voted', user)

    return user.vote
  }

  toObject () {
    return {
      id: this._id,
      users: this.users.map(u => {
        return u.toObject()
      }),
      started: this._started,
      dealt: this.dealt,
      cards: this._cards.map(c => {
        return c.toObject()
      }),
    }
  }
}
