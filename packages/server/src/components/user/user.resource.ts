import { User } from '@werewolf/data'
import { Resource } from '../resource'

export class UserResource extends Resource {
  protected user: User

  constructor(user: User) {
    super()
    this.user = user
  }

  public getData () {
    return {
      id: this.user.id,
      email: this.user.email,
    }
  }
}
