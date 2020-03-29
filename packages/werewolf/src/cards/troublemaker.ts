import { Card } from './card'

export class TroublemakerCard extends Card {
  get name() {
    return 'Troublemaker'
  }

  get description() {
    return `<p>At night, the Troublemaker may
switch the cards of two other
players without looking at those
cards.</p><p> The players who receive
a different card are now the role
(and team) of their new card, even
though they don’t know what role that is until
the end of the game.</p><p><strong>The Troublemaker is on the
village team.</strong></p>`
  }
}
