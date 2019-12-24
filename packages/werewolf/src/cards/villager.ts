import { Card } from './card'

export class VillagerCard extends Card {
  get name() {
    return 'Villager'
  }

  get description() {
    return 'Villager'
  }

  get isWerewolf () {
    return false
  }
}
