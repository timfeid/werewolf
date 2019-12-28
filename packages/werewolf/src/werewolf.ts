import { cardConfiguration } from './cards'
import { Card } from './cards/card'

export class WerewolfValidationError extends Error { }

export class NotEnoughPlayers extends Error {
  constructor() {
    super('Not enough players')
  }
}
export class WrongCardCount extends Error {
  constructor() {
    super('Total number of cards needs to be the player count + 3')
  }
}

export class NoWerewolves extends WerewolfValidationError {
  constructor() {
    super('Not enough werewolves')
  }
}

export class TooMany extends WerewolfValidationError {
  constructor(card: typeof Card) {
    super(`Too many ${card.name} cards in this deck`)
  }
}

export class Werewolf {
  constructor () {

  }

  public static hasValidCards (cards: Card[], playerCount: number) {
    const errors: WerewolfValidationError[] = []
    const hasWerewolves = cards.filter(card => card.isWerewolf).length > 0

    if (playerCount < 3) {
      errors.push(new NotEnoughPlayers())
    }

    if (cards.length !== playerCount + 3) {
      errors.push(new WrongCardCount())
    }

    if (!hasWerewolves) {
      errors.push(new NoWerewolves())
    }

    for (const cc of cardConfiguration) {
      const theseCards = cards.filter(card => card.constructor.name === cc.card.name)
      if (cc.max && theseCards.length > cc.max) {
        errors.push(new TooMany(cc.card))
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
