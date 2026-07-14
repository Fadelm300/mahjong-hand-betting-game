import { GAME_ASSUMPTIONS } from "../config/game-rules";

export type PredictionDirection = "higher" | "lower";

export type HandComparison = "higher" | "lower" | "equal";

export type TieOutcome = "loss" | "push";

export type PredictionOutcome = "win" | "loss" | "push";

export interface PredictionResolution {
  readonly direction: PredictionDirection;
  readonly comparison: HandComparison;
  readonly outcome: PredictionOutcome;
  readonly scoreDelta: number;
}

export function resolvePrediction(
  currentHandValue: number,
  nextHandValue: number,
  direction: PredictionDirection,
  tieOutcome: TieOutcome = GAME_ASSUMPTIONS.tieOutcome,
): PredictionResolution {
  let comparison: HandComparison = "equal";

  if (nextHandValue > currentHandValue) {
    comparison = "higher";
  } else if (nextHandValue < currentHandValue) {
    comparison = "lower";
  }

  let outcome: PredictionOutcome;

  if (comparison === "equal") {
    outcome = tieOutcome === "push" ? "push" : "loss";
  } else {
    outcome = comparison === direction ? "win" : "loss";
  }

  const scoreDelta =
    outcome === "win"
      ? GAME_ASSUMPTIONS.score.correctPrediction
      : GAME_ASSUMPTIONS.score.incorrectPrediction;

  return {
    direction,
    comparison,
    outcome,
    scoreDelta,
  };
}

// مثال 
// Current = 18
// Next = 23
// Prediction = higher

// Comparison = higher
// Outcome = win
// Score Delta = 1
