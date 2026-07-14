// Every time a non-number tile is part of a winning hand, its value increases by 1. If it is part of a losing hand, it decreases by 1.
// إذا فازت اليد، تزيد قيمة الـ Winds 
// والـ Dragons. وإذا خسرت، تنقص. 
// أما البلاطات الرقمية فلا تتغير.

import { RULES_FROM_ASSESSMENT } from "../config/game-rules";

import type { Hand, Tile } from "../types/game";
import type { PredictionOutcome } from "./resolve-prediction";

export interface HonorValueChange {
  readonly tileId: string;
  readonly previousValue: number;
  readonly nextValue: number;
}

export interface AdjustHonorValuesResult {
  readonly adjustedHand: Hand;
  readonly changes: readonly HonorValueChange[];
}

export function adjustHonorValues(
  hand: Hand,
  outcome: PredictionOutcome,
): AdjustHonorValuesResult {
  if (outcome === "push") {
    return {
      adjustedHand: hand,
      changes: [],
    };
  }

  const delta =
    outcome === "win"
      ? RULES_FROM_ASSESSMENT.honorValueChange
      : -RULES_FROM_ASSESSMENT.honorValueChange;

  const changes: HonorValueChange[] = [];

  const adjustedHand: Tile[] = hand.map((tile) => {
    if (tile.category === "number") {
      return tile;
    }

    const nextValue = tile.value + delta;

    changes.push({
      tileId: tile.id,
      previousValue: tile.value,
      nextValue,
    });

    return {
      ...tile,
      value: nextValue,
    };
  });

  return {
    adjustedHand,
    changes,
  };
}