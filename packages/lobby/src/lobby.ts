import { Card, cardConfiguration, User, Werewolf } from '@werewolf/werewolf'
import { EventEmitter } from 'typeorm/platform/PlatformTools'
import { DoppelgangerCard } from '../../werewolf/src/cards/doppelganger'
import { MinionCard } from '../../werewolf/src/cards/minion'
import { RobberCard } from '../../werewolf/src/cards/robber'
import { SeerCard } from '../../werewolf/src/cards/seer'
import { TroublemakerCard } from '../../werewolf/src/cards/troublemaker'
import { VillagerCard } from '../../werewolf/src/cards/villager'
import { WerewolfCard } from '../../werewolf/src/cards/werewolf'
import { LobbyUser } from './user'
import { Action } from './action'

export interface CardPosition {
  type: 'middle' | 'player'
  index: number
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
  protected _middle: LobbyUser[] = []
  protected _id: string
  protected dealt = false
  protected _started = false
  protected turn = 0
  protected remainingColors = [...defaultColors]
  protected timeLeft = 0
  protected juryTimeLeft = 300
  protected _actions: Action[] = []

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
    if (this._users.find(u => u.user.name.toLowerCase().replace(/[^a-z]+/g, '') === user.name.toLowerCase().replace(/[^a-z]+/g, ''))) {
      return false
    }

    if (!this._users.find(u => u.user.id === user.id) && !this.started) {
      const u = new LobbyUser(user, this.getCustomColor(user.name), isOwner)
      this._users.push(u)
      this.emit('joined', u)
    }

    const lu = this._users.find(u => u.user.id === user.id)
    if (lu) {
      this.emit('connect', lu.user)
    }

    return true
  }

  public removeUser (user: User) {
    const index = this._users.findIndex(u => u.user.id === user.id)
    if (index !== -1) {
      const user = this._users[index]
      this._users.splice(index, 1)
      if (user.isOwner && this._users.length > 0) {
        this._users[0].isOwner = true
      }
      this.emit('left', user)
      this.remainingColors.push(user.color)
    }

    return true
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

  get started () {
    return this._started
  }

  get actions () {
    return this._actions.map(action => {
      return {
        who: action.who.toObject(),
        originalCard: action.who.originalCard.toObject(),
        currentCard: action.currentCard,
        action: action.action,
        whats: action.whats.map(what => {
          return {
            position: what.position,
            card: what.card.toObject(),
            user: this.getUserInPosition(what.position).toObject(),
          }
        })
      }
    })
  }

  getUserInPosition (position: CardPosition) {
    return position.type == 'player' ? this.users[position.index] : this.middle[position.index]
  }

  addAction (userId: string, action: string, what: string[]) {
    this._actions.push(new Action(this.getUser(userId), action, what.map(card => {
      return {
        position: this.convertToCardPosition(card),
        card: this.getCard(card),
      }
    })))

  }

  getUser(userId: string) {
    return this._users.find(u => u.user.id === userId)
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
      this._middle = this.deck.slice(0).map((c, i) => {
        const lu = new LobbyUser({name: `Middle ${i+1}`, id: `M${i}`}, '#ffffff', false)
        lu.card = c
        return lu
      })
      this.dealt = true
      this.emit('dealt')
    }

    return {
      success: this.isValid,
      errors: this.validation.errors.map(e => e.message),
    }
  }

  getCustomColor(username: string) {
    switch (username) {
      case 'dux':
        return '#FA8072'
      case 'eloff':
        return '#7B5804'
    }

    return this.remainingColors.pop()
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
      this.gameEnded()
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

    return this.middle[index].card
  }

  convertToCardPosition(position: string): CardPosition {
    return {
      type: position[0] === 'M' ? 'middle' : 'player',
      index: parseInt(position[1], 10) - 1,
    }
  }

  getCard(position: CardPosition | string): Card {
    if (typeof position === 'string') {
      position = this.convertToCardPosition(position)
    }

    if (position.type === 'player') {
      return this.users[position.index].card
    }

    return this.middle[position.index].card
  }

  getOriginalCardForUserId(userId: string) {
    for (const u of this._users) {
      if (u.user.id === userId) {
        return u.originalCard
      }
    }
  }

  getOriginalCardObjectForUserId(userId: string) {
    const card = this.getOriginalCardForUserId(userId)
    if (card) {
      return card.toObject()
    }
  }

  getCardForUserId(userId: string) {
    for (const u of this._users) {
      if (u.user.id === userId) {
        return u.card
      }
    }
  }

  getCardObjectForUserId(userId: string) {
    const card = this.getCardForUserId(userId)
    if (card) {
      return card.toObject()
    }
  }

  doppelganger(userId: string, position: CardPosition | string) {
    const user = this.users.find(u => u.user.id === userId)
    const card = this.getCard(position)
    user.doppelganger = card

    if (DoppelgangerCard.doNotGoFor.indexOf(card.constructor.name) === -1) {
      this.emit('doppelganger.turn', { user, card, data: card.data(this) })
    }

    return card.toObject()
  }

  copycat(userId: string, position: CardPosition | string) {
    const user = this.users.find(u => u.user.id === userId)
    const card = this.getCard(position)
    user.copycat = card

    return card.toObject()
  }

  markOfAssassin(position: CardPosition) {
    const user = this.getUserInPosition(position)
    user.hasMarkOfAssassin = true

    return true
  }

  swapCards(swapIndex: CardPosition, withIndex: CardPosition) {
    let swapCard: Card
    if (swapIndex.type === 'player') {
      swapCard = this._users[swapIndex.index].card
      if (withIndex.type === 'middle') {
        this._users[swapIndex.index].card = this.middle[withIndex.index].card
        this.middle[withIndex.index].card = swapCard
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

  get highestVoted () {
    const votes = new Map()
    this.users.forEach(u => {
      if (u.vote && u.vote.id) {
        const voteId = u.vote.id
        votes.set(voteId, votes.has(voteId) ? votes.get(voteId) + 1 : 1)
      }
    })

    const b = [...votes.entries()].sort((a, b) => a[1] > b[1] ? -1 : 1)

    if (b.length > 0) {
      return this.users.find(u => u.user.id === b[0][0]) || this.middle[0]
    }

    return this.middle[0]
  }

  getWinners () {
    const winners: string[] = []

    if (this.middle[0].user.id === this.highestVoted.user.id) {
      winners.push(this.middle.find(m => m.card.isWerewolf) ? 'villagers' : 'werewolves')
      return winners
    }

    if (this.highestVoted.hasMarkOfAssassin) {
      winners.push('assassins')
    }

    winners.push((this.highestVoted.card.isWerewolf && !['Minion', 'Squire'].includes(this.highestVoted.card.name)) ? 'villagers' : 'werewolves')

    return winners
  }

  gameEnded () {
    this.emit('end', this.getWinners())
  }

  end () {
    this.juryTimeLeft = 1
  }

  setClaim(userId: string, cardId: string) {
    const card = this.cards.find(c => c.constructor.name === cardId)
    const user = this.users.find(u => u.user.id === userId)
    if (!card || !user) {
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
      return false
    }

    user.vote = vote.user

    this.emit('user.voted', user)

    return user.vote
  }

  clone (newId: string) {
    const lobby = new Lobby(newId)

    lobby.addUser(this.owner.user, true)

    lobby.deck = [...this.deck]
    const cards: string[] = []
    this.cards.forEach(c => {
      cards.push(c.constructor.name)
    })
    lobby.setCards(cards)

    this.emit('restart', newId)

    return lobby
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
