import { describe, expect, it } from "vitest";

import { createDeck } from "./create-deck";

describe("createDeck", () => {
  it("creates 136 Mahjong tiles", () => {
    const deck = createDeck();

    expect(deck).toHaveLength(136);
  });

  it("creates a unique ID for every tile", () => {
    const deck = createDeck();
    const uniqueIds = new Set(deck.map((tile) => tile.id));

    expect(uniqueIds.size).toBe(deck.length);
  });

  it("creates the correct number of tile categories", () => {
    const deck = createDeck();

    const numberTiles = deck.filter(
      (tile) => tile.category === "number",
    );
    const windTiles = deck.filter(
      (tile) => tile.category === "wind",
    );
    const dragonTiles = deck.filter(
      (tile) => tile.category === "dragon",
    );

    expect(numberTiles).toHaveLength(108);
    expect(windTiles).toHaveLength(16);
    expect(dragonTiles).toHaveLength(12);
  });

  it("uses rank values for numbers and 5 for honors", () => {
    const deck = createDeck();

    for (const tile of deck) {
      if (tile.category === "number") {
        expect(tile.value).toBe(tile.rank);
      } else {
        expect(tile.value).toBe(5);
      }
    }
  });
});