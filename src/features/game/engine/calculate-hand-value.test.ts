import { describe, expect, it } from "vitest";

import type { Hand } from "../types/game";
import { calculateHandValue } from "./calculate-hand-value";

describe("calculateHandValue", () => {
  it("adds the values of all tiles", () => {
    const hand: Hand = [
      {
        id: "number-1",
        category: "number",
        suit: "bamboo",
        rank: 2,
        value: 2,
        valueGroup: null,
      },
      {
        id: "number-2",
        category: "number",
        suit: "dots",
        rank: 7,
        value: 7,
        valueGroup: null,
      },
      {
        id: "wind-1",
        category: "wind",
        kind: "east",
        value: 5,
        valueGroup: "wind-1",
      },
      {
        id: "dragon-1",
        category: "dragon",
        kind: "red",
        value: 6,
        valueGroup: "dragon-1",
      },
    ];

    expect(calculateHandValue(hand)).toBe(20);
  });

  it("returns zero for an empty hand", () => {
    expect(calculateHandValue([])).toBe(0);
  });
});