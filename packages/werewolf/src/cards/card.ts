export abstract class Card {
  abstract get name(): string
  abstract get description(): string
  abstract get isWerewolf(): boolean

  public toObject () {
    return {
      name: this.name,
      description: this.description,
      id: this.constructor.name,
    }
  }
}
