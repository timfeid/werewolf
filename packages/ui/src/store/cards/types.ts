// types.ts

export interface Card {
  id: string;
  name: string;
  max: number;
  mustBe?: number;
}

export interface CardsState {
  cards: Card[];
}
