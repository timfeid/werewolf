import { Card } from './card'

export class InsomniacCard extends Card {
  get name() {
    return 'Insomniac'
  }

  get description() {
    return `<p>The Insomniac wakes up and
looks at her card (to see if it has
changed).</p><p>Only use the Insomniac if the Robber and/or the Troublemaker are in the game.</p><p><strong>The
Insomniac is on the village team.</strong></p>`
  }

  get turnLength() {
    return 3
  }
}
