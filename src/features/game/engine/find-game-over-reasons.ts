import { RULES_FROM_ASSESSMENT } from "../config/game-rules";

import type { Hand } from "../types/game";

export type GameOverReason =
  | {
      readonly type: "tile-value-minimum";
      readonly tileId: string;
      readonly value: number;
    }
  | {
      readonly type: "tile-value-maximum";
      readonly tileId: string;
      readonly value: number;
    }
  | {
      readonly type: "draw-pile-exhausted";
      readonly exhaustionCount: number;
    };

export function findGameOverReasons(
  hand: Hand,
  exhaustionCount: number,
): GameOverReason[] {
  if (!Number.isInteger(exhaustionCount) || exhaustionCount < 0) {
    throw new Error("exhaustionCount must be a non-negative integer");
  }

  const reasons: GameOverReason[] = [];

  for (const tile of hand) {
    if (tile.category === "number") {
      continue;
    }

    if (tile.value <= RULES_FROM_ASSESSMENT.minimumTileValue) {
      reasons.push({
        type: "tile-value-minimum",
        tileId: tile.id,
        value: tile.value,
      });
    }

    if (tile.value >= RULES_FROM_ASSESSMENT.maximumTileValue) {
      reasons.push({
        type: "tile-value-maximum",
        tileId: tile.id,
        value: tile.value,
      });
    }
  }

  if (
    exhaustionCount >=
    RULES_FROM_ASSESSMENT.maximumDrawPileExhaustions
  ) {
    reasons.push({
      type: "draw-pile-exhausted",
      exhaustionCount,
    });
  }

  return reasons;
}


// للوجك:

// يفحص Winds وDragons فقط؛ لأن Number Tiles ثابتة من 1 إلى 9
// إذا وصلت قيمة Honor Tile إلى 0 يضيف سبب انتهاء
// إذا وصلت إلى 10 يضيف سبب انتهاء
// إذا وصل الاستنزاف إلى 3 يضيف سبب انتهاء
// يرجع Array لأن أكثر من سبب يمكن أن يحدث في الجولة نفسها
// إذا رجع [] فهذا يعني أن اللعبة مستمرة

// نفّذ: