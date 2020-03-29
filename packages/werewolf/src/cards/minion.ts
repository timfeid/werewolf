import { Lobby } from '../../../lobby/src'
import { Card } from './card'

export class MinionCard extends Card {
  get name() {
    return 'Minion'
  }

  get description() {
    return `<p>The Werewolves don’t know who the Minion
is. If the Minion dies and no Werewolves die, the
Werewolves (and the Minion) win.</p><p> If no players
are Werewolves, the Minion wins as long as one
other player (not the Minion) dies.<p></p>This role can
be a very powerful ally for the werewolf team.</p>
<p><strong>This Minion is on the werewolf team.</strong></p>`
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
