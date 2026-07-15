import { RULES_FROM_ASSESSMENT } from "../config/game-rules";

import type { Tile } from "../types/game";
import { createDeck } from "./create-deck";
import { shuffleTiles } from "./shuffle-tiles";

type RandomSource = () => number;

export interface ReplenishDrawPileResult {
  readonly drawPile: Tile[];
  readonly discardPile: Tile[];
  readonly exhaustionCount: number;
  readonly nextDeckSequence: number;
  readonly didReplenish: boolean;
  readonly reachedExhaustionLimit: boolean;
}

export function replenishDrawPile(
  discardPile: readonly Tile[],
  exhaustionCount: number,
  nextDeckSequence: number,
  random: RandomSource = Math.random,
): ReplenishDrawPileResult {
  if (!Number.isInteger(exhaustionCount) || exhaustionCount < 0) {
    throw new Error("exhaustionCount must be a non-negative integer");
  }

  if (!Number.isInteger(nextDeckSequence) || nextDeckSequence <= 0) {
    throw new Error("nextDeckSequence must be a positive integer");
  }

  const nextExhaustionCount = Math.min(
    exhaustionCount + 1,
    RULES_FROM_ASSESSMENT.maximumDrawPileExhaustions,
  );

  if (
    nextExhaustionCount >=
    RULES_FROM_ASSESSMENT.maximumDrawPileExhaustions
  ) {
    return {
      drawPile: [],
      discardPile: [...discardPile],
      exhaustionCount: nextExhaustionCount,
      nextDeckSequence,
      didReplenish: false,
      reachedExhaustionLimit: true,
    };
  }

  const freshDeck = createDeck(nextDeckSequence);

  const replenishedDrawPile = shuffleTiles(
    [...freshDeck, ...discardPile],
    random,
  );

  return {
    drawPile: replenishedDrawPile,
    discardPile: [],
    exhaustionCount: nextExhaustionCount,
    nextDeckSequence: nextDeckSequence + 1,
    didReplenish: true,
    reachedExhaustionLimit: false,
  };
}


// اللوجك:

// أول استنزاف: يضيف Deck جديدًا مع Discard ثم يخلطهما.
// ثاني استنزاف: يفعل الشيء نفسه.
// ثالث استنزاف: لا ينشئ Deck، ويرجع reachedExhaustionLimit: true.
// Current Hand لا تدخل هنا؛ الذي يدخل فقط هو discardPile.
// كل Deck جديد يستخدم nextDeckSequence حتى لا تتكرر IDs.
// بعد إعادة التعبئة يصبح discardPile فارغًا.