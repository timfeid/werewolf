import { Lobby } from '@werewolf/lobby'
import { Card } from './card'

export class MysticWolfCard extends Card {
  get name() {
    return 'Mystic Wolf'
  }

  get description() {
    return 'Mystic wolf'
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
