import { Lobby } from '@werewolf/lobby'

export abstract class Card {
  abstract get name(): string
  abstract get description(): string

  data (lobby: Lobby): any {
    return {}
  }

  get winsWith(): string {
    return 'villagers'
  }

  get isWerewolf(): boolean {
    return false
  }

  get turnLength(): number {
    return 15
  }

  public toObject () {
    return {
      name: this.name,
      description: this.description,
      id: this.constructor.name,
      turnLength: this.turnLength,
      isWerewolf: this.isWerewolf,
      winsWith: this.winsWith,
    }
  }
}
