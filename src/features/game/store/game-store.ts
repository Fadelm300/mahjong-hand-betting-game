"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { PredictionDirection } from "../engine/resolve-prediction";
import {
  rankLeaderboard,
  type LeaderboardEntry,
} from "../leaderboard/rank-leaderboard";
import type { GameState } from "../state/game-state";
import { playRound } from "../state/play-round";
import { startNewGame } from "../state/start-new-game";

interface GameActions {
  readonly hasHydrated: boolean;
  readonly setHasHydrated: (value: boolean) => void;
  readonly startGame: () => void;
  readonly makePrediction: (direction: PredictionDirection) => void;
  readonly resetGame: () => void;
}

interface LeaderboardState {
  readonly leaderboard: readonly LeaderboardEntry[];
}

type GameStore = GameState & GameActions & LeaderboardState;

const initialGameState: GameState = {
  status: "idle",
  score: 0,
  round: 0,
  currentHand: [],
  currentHandValue: null,
  drawPile: [],
  discardPile: [],
  exhaustionCount: 0,
  nextDeckSequence: 1,
  history: [],
  gameOverReasons: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...initialGameState,
      hasHydrated: false,
      leaderboard: [],

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },

      startGame: () => {
        set(startNewGame());
      },

      makePrediction: (direction) => {
        set((state) => {
          const nextState = playRound(state, direction);

          const didGameEnd =
            state.status !== "game-over" &&
            nextState.status === "game-over";

          if (!didGameEnd) {
            return nextState;
          }

          const newEntry: LeaderboardEntry = {
            id: crypto.randomUUID(),
            score: nextState.score,
            rounds: nextState.round,
            completedAt: new Date().toISOString(),
          };

          return {
            ...nextState,
            leaderboard: rankLeaderboard(
              state.leaderboard,
              newEntry,
            ),
          };
        });
      },

      resetGame: () => {
        set(initialGameState);
      },
    }),
    {
      name: "mahjong-active-session",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

// اللوجك:

// initialGameState: الحالة قبل بدء اللعبة
// startGame: تشغّل startNewGame
// makePrediction: تشغّل playRound
// resetGame: يرجع اللعبة إلى idle
// Zustand يحفظ الحالة ويحدث أي Component يستخدم useGameStore
// الـStore لا يحتوي قواعد اللعبة؛ هو فقط يربط الوظائف بالحالة