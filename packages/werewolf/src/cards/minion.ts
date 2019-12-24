import { Card } from './card'

export class MinionCard extends Card {
  get name() {
    return 'Minion'
  }

  get description() {
    return 'Minion'
  }

  get isWerewolf () {
    return false
  }

}
