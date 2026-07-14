// This file contains the type definitions for the game of Mahjong, including the different types of tiles and their properties
export type NumberSuit = "characters" | "bamboo" | "dots";

export type NumberRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type WindKind = "east" | "south" | "west" | "north";

export type DragonKind = "red" | "green" | "white";

export type TileCategory = "number" | "wind" | "dragon";
//basetile is the base interface for all types of tiles in the game of Mahjong. It contains the common properties that all tiles share, such as id, category, and value.
//يعني ذي الاشياء المشتركةبين البلاط او الاحجار المستخدمه
//بدل تكرار هذه الخصائص في كل Interface، وضعناها في BaseTile.
interface BaseTile {
  readonly id: string;
  readonly category: TileCategory;
  readonly value: number;
}

//example of a number tile in the game of Mahjong. It has a suit of "bamboo", a rank of 3, and a value of 3. The valueGroup is null because it is not part of any group of tiles with the same value.
// const tile: NumberTile = {
//   id: "deck-1:number:bamboo:3:2",
//   category: "number",
//   suit: "bamboo",
//   rank: 3,
//   value: 3,
//   valueGroup: null,
// };
export interface NumberTile extends BaseTile {
  readonly category: "number";
  readonly suit: NumberSuit;
  readonly rank: NumberRank;
  readonly valueGroup: null;
}

export interface WindTile extends BaseTile {
  readonly category: "wind";
  readonly kind: WindKind;
  readonly valueGroup: string;
}

export interface DragonTile extends BaseTile {
  readonly category: "dragon";
  readonly kind: DragonKind;
  readonly valueGroup: string;
}

export type Tile = NumberTile | WindTile | DragonTile;

export type Hand = readonly Tile[];