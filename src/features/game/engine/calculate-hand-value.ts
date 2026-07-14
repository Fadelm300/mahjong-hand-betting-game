import type { Hand } from "../types/game";

export function calculateHandValue(hand: Hand): number {
  return hand.reduce((total, tile) => total + tile.value, 0);
}

// للوجك

// تستقبل Hand تحتوي بلاطات
// reduce يمر على جميع البلاطات
// يجمع tile.value
// يبدأ المجموع من 0
// لا يعدل الـHand الأصلية

// مثال:
// Bamboo 3 = 3
// East Wind = 5
// Red Dragon = 5
// Dots 7 = 7

// Total = 20