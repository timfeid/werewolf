import { User } from '@salem/data'
import { Card } from '@salem/werewolf'

export class LobbyUser {
  protected _user: User
  protected _isOwner: boolean
  protected _card: Card

  constructor (user: User, isOwner = false) {
    this._isOwner = isOwner
    this._user = user
  }

  get user (): User {
    return this._user
  }

  get isOwner (): boolean {
    return this._isOwner
  }

  get card (): Card {
    return this._card
  }

  set card (card: Card) {
    this._card = card
  }
}
