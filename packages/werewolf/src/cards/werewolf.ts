import { Lobby } from '@werewolf/lobby'
import { Card } from './card'

export class WerewolfCard extends Card {
  get name() {
    return 'Werewolf'
  }

  get winsWith(): string {
    return 'werewolves'
  }

  get description() {
    return `<p>At night, all Werewolves open
their eyes and look for other
werewolves. If no one else opens
their eyes, the other Werewolves
are in the center.</p><p><strong>Werewolves are
on the werewolf team.</strong></p>`
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
