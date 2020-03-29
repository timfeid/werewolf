import { Lobby } from '@werewolf/lobby'
import { Card } from './card'

export class MysticWolfCard extends Card {
  get name() {
    return 'Mystic Wolf'
  }

  get description() {
    return `<p>The Mystic Wolf wakes with the other Werewolves.
    Afterwards, the Mystic Wolf wakes up seperately.
    The Mystic Wolf may look at one other player's card</p>
    <p><strong>The Mystic Wolf is on the Werewolf team</strong></p>`
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
