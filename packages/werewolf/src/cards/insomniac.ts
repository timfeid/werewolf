import { Card } from './card'

export class InsomniacCard extends Card {
  get name() {
    return 'Insomniac'
  }

  get description() {
    return 'Insomniac'
  }

  get isWerewolf () {
    return false
  }
}
