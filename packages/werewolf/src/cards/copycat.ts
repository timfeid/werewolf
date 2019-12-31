import { Card } from './card'

export class CopycatCard extends Card {
  werewolf = false

  set isWerewolf (value: boolean) {
    this.werewolf = value
  }

  get isWerewolf () {
    return this.werewolf
  }

  get name() {
    return 'Copycat'
  }

  get description() {
    return 'Copycat'
  }
}
