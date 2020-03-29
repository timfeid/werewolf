import { Card } from './card'

export class VillagerCard extends Card {
  get name() {
    return 'Villager'
  }

  get description() {
    return `<p>The Villager has no special abilities, but he is definitely not a
werewolf. Players may often claim
to be a Villager.</p><p><strong>The Villager is on
the village team.</strong></p>`
  }

  get turnLength() {
    return 0
  }
}
