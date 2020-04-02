import { Card } from './card'

export class RobberCard extends Card {
  get name() {
    return 'Robber'
  }

  get description() {
    return `<p>At night, the Robber may choose
to rob a card from another player
and place his Robber card where
the other card was.</p><p> Then the
Robber looks at his new card. The
player who receives the Robber
card is on the village team.</p><p> <strong>The Robber is on the
team of the card he takes</strong></p><p>He does not do
the action of his new role at night.</p><p><strong>
If the Robber chooses not to rob a card from another player, he remains the Robber and is on the
village team.</strong></p>`
  }
}
