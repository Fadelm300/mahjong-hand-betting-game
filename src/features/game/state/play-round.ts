import { addHandToDiscardPile } from "../engine/add-hand-to-discard-pile";
import { drawHand } from "../engine/draw-hand";
import { findGameOverReasons } from "../engine/find-game-over-reasons";
import { replenishDrawPile } from "../engine/replenish-draw-pile";
import {
  resolveRound,
} from "../engine/resolve-round";
import type {
  PredictionDirection,
} from "../engine/resolve-prediction";
import type { GameState } from "./game-state";

type RandomSource = () => number;

export function playRound(
  state: GameState,
  direction: PredictionDirection,
  random: RandomSource = Math.random,
): GameState {
  if (state.status !== "awaiting-prediction") {
    throw new Error("Game is not awaiting a prediction");
  }

  let drawPile = [...state.drawPile];
  let discardPile = [...state.discardPile];
  let exhaustionCount = state.exhaustionCount;
  let nextDeckSequence = state.nextDeckSequence;

  if (drawPile.length === 0) {
    const replenishment = replenishDrawPile(
      discardPile,
      exhaustionCount,
      nextDeckSequence,
      random,
    );

    drawPile = replenishment.drawPile;
    discardPile = replenishment.discardPile;
    exhaustionCount = replenishment.exhaustionCount;
    nextDeckSequence = replenishment.nextDeckSequence;

    if (replenishment.reachedExhaustionLimit) {
      return {
        ...state,
        status: "game-over",
        drawPile,
        discardPile,
        exhaustionCount,
        nextDeckSequence,
        gameOverReasons: findGameOverReasons(
          state.currentHand,
          exhaustionCount,
        ),
      };
    }
  }

  const { hand: nextHand, remainingDrawPile } = drawHand(drawPile);

  const resolution = resolveRound(
    state.currentHand,
    nextHand,
    direction,
  );

  const nextDiscardPile = addHandToDiscardPile(
    discardPile,
    state.currentHand,
  );

  const gameOverReasons = findGameOverReasons(
    resolution.settledHand,
    exhaustionCount,
  );

  const isGameOver = gameOverReasons.length > 0;

  return {
    ...state,
    status: isGameOver ? "game-over" : "awaiting-prediction",
    score: state.score + resolution.prediction.scoreDelta,
    round: isGameOver ? state.round : state.round + 1,

    currentHand: resolution.settledHand,
    currentHandValue: resolution.nextComparisonValue,

    drawPile: remainingDrawPile,
    discardPile: nextDiscardPile,

    exhaustionCount,
    nextDeckSequence,

    history: [
      ...state.history,
      {
        roundNumber: state.round,
        resolution,
      },
    ],

    gameOverReasons,
  };
}




// هذه الوظيفة:

// تتأكد أن اللعبة تنتظر توقعًا.
// تعيد تعبئة Draw Pile إذا كان فارغًا.
// تنهي اللعبة عند الاستنزاف الثالث.
// تسحب اليد الجديدة.
// تحسب نتيجة الجولة.
// تعدل Honor Tiles.
// تنقل اليد القديمة إلى Discard.
// تحدث Score وRound وHistory.
// تفحص شروط Game Over.
// ترجع GameState جديدة بدون تعديل القديمة.