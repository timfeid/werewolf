import { LobbyUser } from "./user";
import { CardPosition } from "./lobby";
import { Card } from "@werewolf/werewolf/src";

export class ActionWhat {
  position: CardPosition
  card: Card
}

export class Action {
  who: LobbyUser
  action: string
  whats: ActionWhat[]
  constructor (who: LobbyUser, action: string, what: ActionWhat[]) {
    this.who = who
    this.action = action
    this.whats = what
  }
}
