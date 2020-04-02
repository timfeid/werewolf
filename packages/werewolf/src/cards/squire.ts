import { Lobby } from '../../../lobby/src'
import { Card } from './card'

export class SquireCard extends Card {
  get name() {
    return 'Squire'
  }

  get winsWith(): string {
    return 'werewolves'
  }

  get description() {
    return `<p>The Squire gets to see the Werewolves cards and verify if their cards have been switched.</p><p>The Squire uses this information to try and protect the Werewolves.</p>
    <p><strong>This Squire is on the werewolf team.</strong></p>`
  }

  get turnLength() {
    return 6
  }

  data(lobby: Lobby): any {
    return {
      werewolves: lobby.findOriginalWerewolves().map(u => {
        return {
          ...u.toObject(),
          card: u.card.toObject(),
        }
      }),
    }
  }

}
