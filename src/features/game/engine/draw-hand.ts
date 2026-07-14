import { GAME_ASSUMPTIONS } from "../config/game-rules";

import type { Tile } from "../types/game";

export interface DrawHandResult {
  readonly hand: Tile[];
  readonly remainingDrawPile: Tile[];
}

export function drawHand(
  drawPile: readonly Tile[],
  handSize = GAME_ASSUMPTIONS.handSize,
): DrawHandResult {
  if (!Number.isInteger(handSize) || handSize <= 0) {
    throw new Error("handSize must be a positive integer");
  }

  if (drawPile.length < handSize) {
    throw new Error("Draw pile does not contain enough tiles");
  }

  return {
    hand: drawPile.slice(0, handSize),
    remainingDrawPile: drawPile.slice(handSize),
  };
}

//اللوجك:
// تستقبل الـ Draw Pile.
// تستخدم handSize من القواعد، وقيمته الافتراضية 4
// تتأكد أن حجم الـHand رقم صحيح وموجب
// تمنع سحب Hand ناقصة
// أول أربع بلاطات تصبح hand
// بقية البلاطات تصبح remainingDrawPile
// slice يرجع Arrays جديدة ولا يعدل الـDraw Pile الأصلي

// مثال: إذا كان الـDraw Pile يحتوي 136 بلاطة