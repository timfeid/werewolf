import { Card } from './card'

export class CopycatCard extends Card {
  werewolf = false

  set isWerewolf (value: boolean) {
    this.werewolf = value
  }

  get isWerewolf () {
    return this.werewolf
  }

  get name() {
    return 'Copycat'
  }

  get description() {
    return `<p>The Copycat wakes up and must look at one of the center cards. From that point on in the game, the Copycat is the role he viewed. If that role is called, the Copycat wakes up and does that roles action.</p>

<p>The role seen by the original Copycat goes with that card if the Copycat card is moved to another player.</p>

<p><strong>The Copycat is on the team he first views.</strong></p>`
  }
}
