import { Lobby } from '@werewolf/lobby'
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

  data(lobby: Lobby) {
    return {
      werewolves: lobby.findOriginalWerewolves().map(u => u.toObject())
    }
  }
}
