import { calculateHandValue } from "../engine/calculate-hand-value";
import { createDeck } from "../engine/create-deck";
import { drawHand } from "../engine/draw-hand";
import { shuffleTiles } from "../engine/shuffle-tiles";
import type { GameState } from "./game-state";

type RandomSource = () => number;

export function startNewGame(
  random: RandomSource = Math.random,
): GameState {
  const deck = createDeck(1);
  const shuffledDeck = shuffleTiles(deck, random);

  const { hand, remainingDrawPile } = drawHand(shuffledDeck);

  return {
    status: "awaiting-prediction",
    score: 0,
    round: 1,

    currentHand: hand,
    currentHandValue: calculateHandValue(hand),

    drawPile: remainingDrawPile,
    discardPile: [],

    exhaustionCount: 0,
    nextDeckSequence: 2,

    history: [],
    gameOverReasons: [],
  };
}


// للوجك:

// ينشئ أول Deck برقم 1.
// يخلطه.
// يسحب أول Hand.
// يحسب قيمة أول Hand.
// يبدأ Score من صفر.
// يبدأ Round من 1.
// يبقى 132 Tile في Draw Pile.
// الـDeck القادم سيكون رقمه 2.
// تصبح الحالة awaiting-prediction.

// أول Hand لا تعتبر Win أو Loss؛ هي أساس المقارنة فقط.

// نفّذ: