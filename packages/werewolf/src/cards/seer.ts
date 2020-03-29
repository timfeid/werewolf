import { Card } from './card'

export class SeerCard extends Card {
  get name() {
    return 'Seer'
  }

  get description() {
    return `<p>At night, the Seer may look ei- ther at one other player’s card
or at two of the center cards, but
does not move them. </p><p><strong>The Seer is
on the village team.</strong></p>`
  }
}
