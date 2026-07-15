import { describe, expect, it } from "vitest";

import { createDeck } from "./create-deck";
import { drawHand } from "./draw-hand";

describe("drawHand", () => {
  it("draws 4 tiles and leaves 132", () => {
    const deck = createDeck();

    const result = drawHand(deck);

    expect(result.hand).toHaveLength(4);
    expect(result.remainingDrawPile).toHaveLength(132);
  });

  it("does not change the original draw pile", () => {
    const deck = createDeck();
    const originalLength = deck.length;

    drawHand(deck);

    expect(deck).toHaveLength(originalLength);
  });

  it("rejects drawing an incomplete hand", () => {
    const incompleteDrawPile = createDeck().slice(0, 3);

    expect(() => drawHand(incompleteDrawPile)).toThrow(
      "Draw pile does not contain enough tiles",
    );
  });
});