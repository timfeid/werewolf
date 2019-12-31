import { Lobby } from '../../../lobby/src'
import { Card } from './card'

export class MinionCard extends Card {
  get name() {
    return 'Minion'
  }

  get description() {
    return 'Minion'
  }

  get turnLength() {
    return 0
  }

  data(lobby: Lobby): any {
    return {
      werewolves: lobby.findOriginalWerewolves().map(u => u.toObject())
    }
  }

}
