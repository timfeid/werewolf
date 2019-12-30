// types.ts

export interface Card {
  id: string;
  name: string;
  max: number;
  isWerewolf: boolean;
  mustBe?: number;
}

export interface CardsState {
  cards: Card[];
}
