import { Card } from './card'

export class WerewolfCard extends Card {
  get name() {
    return 'Werewolf'
  }

  get description() {
    return 'Werewolf'
  }

  get isWerewolf() {
    return true
  }
}
