import type { Hand, Tile } from "../types/game";

export function addHandToDiscardPile(
  discardPile: readonly Tile[],
  hand: Hand,
): Tile[] {
  return [...discardPile, ...hand];
}


// اللوجك:

// تستقبل الـDiscard Pile الحالي
// تضيف إليه اليد القديمة
// ترجع Array جديدة بدون تعديل الأصل
// اليد الجديدة لا تدخل Discard؛ لأنها تصبح Current Hand

// مثال:

// Discard Pile قبل الجولة: 8
// Previous Hand: 4
// Discard Pile بعد الجولة: 12

// نفّذ: