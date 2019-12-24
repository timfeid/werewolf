import { Card } from './card'

export class DrunkCard extends Card {
  get name() {
    return 'Drunk'
  }

  get description() {
    return 'Drunk'
  }

  get isWerewolf () {
    return false
  }
}
