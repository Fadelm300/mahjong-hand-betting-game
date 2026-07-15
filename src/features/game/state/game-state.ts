import type { GameOverReason } from "../engine/find-game-over-reasons";
import type { RoundResolution } from "../engine/resolve-round";
import type { Hand, Tile } from "../types/game";

export type GameStatus =
  | "idle"
  | "awaiting-prediction"
  | "resolving-round"
  | "game-over";

export interface RoundHistoryEntry {
  readonly roundNumber: number;
  readonly resolution: RoundResolution;
}

export interface GameState {
  readonly status: GameStatus;
  readonly score: number;
  readonly round: number;

  readonly currentHand: Hand;
  readonly currentHandValue: number | null;

  readonly drawPile: readonly Tile[];
  readonly discardPile: readonly Tile[];

  readonly exhaustionCount: number;
  readonly nextDeckSequence: number;

  readonly history: readonly RoundHistoryEntry[];
  readonly gameOverReasons: readonly GameOverReason[];
}


// ذا الملف يحدد كل المعلومات التي نحتاجها أثناء اللعب:

// status: المرحلة الحالية.
// score: عدد التوقعات الصحيحة.
// round: رقم الجولة.
// currentHand: اليد الحالية.
// currentHandValue: قيمتها بعد التسوية.
// drawPile وdiscardPile.
// exhaustionCount: عدد مرات انتهاء Draw Pile.
// nextDeckSequence: رقم الـDeck القادم.
// history: تفاصيل الجولات السابقة.
// gameOverReasons: سبب أو أسباب انتهاء اللعبة.