import { Card } from './card'

export class MasonCard extends Card {
  get name() {
    return 'Mason'
  }

  get description() {
    return 'Mason'
  }

  get isWerewolf () {
    return false
  }
}
