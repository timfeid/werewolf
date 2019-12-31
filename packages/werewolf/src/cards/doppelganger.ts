import { Card } from './card'

export class DoppelgangerCard extends Card {
  get name() {
    return 'Doppelganger'
  }

  get description() {
    return 'Doppelganger'
  }

  get turnLength () {
    return 20
  }
}
