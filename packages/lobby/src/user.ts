import { Card, User } from '@werewolf/werewolf'
import { CopycatCard } from '../../werewolf/src/cards/copycat'
import { DoppelgangerCard } from '../../werewolf/src/cards/doppelganger'

export class LobbyUser {
  protected _user: User
  protected _vote: User
  protected _isOwner: boolean
  protected _originalCard: Card
  protected _doppelganger: Card
  protected _copycat: Card
  protected _card: Card
  protected _claim: Card
  protected _color: string

  constructor(user: User, color: string, isOwner = false) {
    this._isOwner = isOwner
    this._color = color
    this._user = user
  }

  get user(): User {
    return this._user
  }

  get color(): string {
    return this._color
  }

  get isOwner(): boolean {
    return this._isOwner
  }

  set isOwner(owner: boolean) {
    this._isOwner = owner
  }

  get card(): Card {
    return this._card
  }

  set card(card: Card) {
    this._card = card
    if (!this._originalCard) {
      this._originalCard = card
    }
  }

  get claim(): Card {
    return this._claim
  }

  set claim(claim: Card) {
    this._claim = claim
  }

  get doppelganger(): Card {
    return this._doppelganger
  }

  set doppelganger(newCard: Card) {
    (this._originalCard as DoppelgangerCard).isWerewolf = newCard.isWerewolf
    this._doppelganger = newCard
  }

  get copycat(): Card {
    return this._copycat
  }

  set copycat(newCard: Card) {
    (this._originalCard as CopycatCard).isWerewolf = newCard.isWerewolf
    this._doppelganger = newCard

    this._copycat = newCard
  }

  get vote(): User {
    return this._vote
  }

  set vote(vote: User) {
    this._vote = vote
  }

  get originalCard(): Card {
    return this._originalCard
  }

  toObject() {
    return {
      name: this.user.name,
      id: this.user.id,
      owner: this.isOwner,
      color: this.color,
      claim: this.claim ? this.claim.toObject() : null,
      vote: this.vote,
    }
  }
}
