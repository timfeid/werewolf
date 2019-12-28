import { User } from '@werewolf/data'
import { Card } from '@werewolf/werewolf'

export class LobbyUser {
  protected _user: User
  protected _isOwner: boolean
  protected _originalCard: Card
  protected _card: Card
  protected _color: string

  constructor (user: User, color: string, isOwner = false) {
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

  get isOwner (): boolean {
    return this._isOwner
  }

  get card (): Card {
    return this._card
  }

  set card (card: Card) {
    this._card = card
    if (!this._originalCard) {
      this._originalCard = card
    }
  }

  get originalCard(): Card {
    return this._originalCard
  }

  toObject () {
    return {
      name: this.user.name,
      id: this.user.id,
      owner: this.isOwner,
      color: this.color,
    }
  }
}
