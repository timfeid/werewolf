import { Card } from './card'

export class DrunkCard extends Card {
  get name() {
    return 'Drunk'
  }

  get description() {
    return `<p>The Drunk is so drunk that he
doesn’t remember his role.</p>
<p>When it comes time to wake up at night,
he must exchange his Drunk card
for any card in the center, but he
does not look at it.
</p><p><strong>The Drunk is now the new role
in front of him (even though he doesn’t know
what that new role is) and is on that team.</strong></p>`
  }

  get turnLength() {
    return 8
  }
}
