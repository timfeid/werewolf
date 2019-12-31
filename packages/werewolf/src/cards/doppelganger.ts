import { Card } from './card'
import { CopycatCard } from './copycat'

export class DoppelgangerCard extends Card {
  werewolf = false

  set isWerewolf(value: boolean) {
    this.werewolf = value
  }

  get isWerewolf() {
    return this.werewolf
  }

  static doNotGoFor = [
    CopycatCard.name,
  ]

  get name() {
    return 'Doppelganger'
  }

  get description() {
    return 'Doppelganger'
  }

  get turnLength () {
    return 25
  }
}
