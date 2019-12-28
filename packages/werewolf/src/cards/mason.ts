import { Lobby } from '@werewolf/lobby'
import { Card } from './card'

export class MasonCard extends Card {
  get name() {
    return 'Mason'
  }

  get description() {
    return 'Mason'
  }

  get turnLength () {
    return 3
  }

  data(lobby: Lobby) {
    return {
      masons: lobby.findPlayersWithOriginalCard(MasonCard.name).map(u => u.toObject())
    }
  }
}
