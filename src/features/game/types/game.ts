export type NumberSuit = "characters" | "bamboo" | "dots";

export type NumberRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type WindKind = "east" | "south" | "west" | "north";

export type DragonKind = "red" | "green" | "white";

export type TileCategory = "number" | "wind" | "dragon";

interface BaseTile {
  readonly id: string;
  readonly category: TileCategory;
  readonly value: number;
}

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