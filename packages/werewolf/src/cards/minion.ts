import { Lobby } from '../../../lobby/src'
import { Card } from './card'
import { WerewolfCard } from './werewolf'

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
      werewolves: lobby.findPlayersWithOriginalCard(WerewolfCard.name).map(u => u.toObject())
    }
  }

}
