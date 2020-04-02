import { Card } from './card'

export class AssassinCard extends Card {
  get name() {
    return 'Assassin'
  }

  get winsWith(): string {
    return 'assassins'
  }

  get description() {
    return `<p>You place a ‘Mark of the Assassin’ on another player. You win only if the player with the ‘Mark of the Assassin’ dies.</p><p><strong>
The assassin is on a team of his own.</strong></p>`
  }
}
