import { Lobby } from '@werewolf/lobby'
import { Card } from './card'

export class MasonCard extends Card {
  get name() {
    return 'Mason'
  }

  get description() {
    return `<p>When using the Masons always
put both Masons in the game.</p><p>
The Mason wakes up at night and
looks for the other Mason. If the
Mason doesn’t see another Mason,
it means the other Mason card is in
the center.</p><p><strong> Masons are on the village team.</strong></p>`
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
