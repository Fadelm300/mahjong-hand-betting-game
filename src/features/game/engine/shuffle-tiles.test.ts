import { describe, expect, it } from "vitest";

import { shuffleTiles } from "./shuffle-tiles";

describe("shuffleTiles", () => {
  it("returns a new array without changing the original", () => {
    const original = ["A", "B", "C", "D"];

    const shuffled = shuffleTiles(original, () => 0);

    expect(original).toEqual(["A", "B", "C", "D"]);
    expect(shuffled).not.toBe(original);
  });

  it("keeps all original elements", () => {
    const original = ["A", "B", "C", "D"];

    const shuffled = shuffleTiles(original, () => 0.5);

    expect([...shuffled].sort()).toEqual([...original].sort());
  });

  it("supports a predictable random source for testing", () => {
    const shuffled = shuffleTiles(
      ["A", "B", "C", "D"],
      () => 0,
    );

    expect(shuffled).toEqual(["B", "C", "D", "A"]);
  });
});