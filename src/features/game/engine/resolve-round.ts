//                   ملف ((((المايسترو))))
// الي يجمع كل شيء ويطلع النتيجة النهائية للجولة
import { GAME_ASSUMPTIONS } from "../config/game-rules";

import type { Hand } from "../types/game";
import {
  adjustHonorValues,
  type HonorValueChange,
} from "./adjust-honor-values";
import { calculateHandValue } from "./calculate-hand-value";
import {
  resolvePrediction,
  type PredictionDirection,
  type PredictionResolution,
} from "./resolve-prediction";

export interface RoundResolution {
  readonly currentHandValue: number;
  readonly revealedHandValue: number;
  readonly settledHandValue: number;
  readonly nextComparisonValue: number;
  readonly prediction: PredictionResolution;
  readonly settledHand: Hand;
  readonly tileValueChanges: readonly HonorValueChange[];
}

export function resolveRound(
  currentHand: Hand,
  nextHand: Hand,
  direction: PredictionDirection,
): RoundResolution {
  const currentHandValue = calculateHandValue(currentHand);
  const revealedHandValue = calculateHandValue(nextHand);

  const prediction = resolvePrediction(
    currentHandValue,
    revealedHandValue,
    direction,
  );

  const adjustment = adjustHonorValues(nextHand, prediction.outcome);

  const settledHandValue = calculateHandValue(adjustment.adjustedHand);

  const nextComparisonValue =
    GAME_ASSUMPTIONS.useAdjustedValueAsNextBaseline
      ? settledHandValue
      : revealedHandValue;

  return {
    currentHandValue,
    revealedHandValue,
    settledHandValue,
    nextComparisonValue,
    prediction,
    settledHand: adjustment.adjustedHand,
    tileValueChanges: adjustment.changes,
  };
}


// ترتيب الجولة:

// نحسب قيمة اليد الحالية
// نحسب قيمة اليد الجديدة قبل أي تعديل
// نحدد هل التوقع صحيح
// نعدل Winds وDragons حسب النتيجة
// نحسب قيمة اليد بعد التعديل
// نحدد القيمة التي ستُستخدم في الجولة القادمة
// نرجع تفاصيل الجولة كاملة للواجهة والـHistory