"use client";

import { create } from "zustand";

import type { PredictionDirection } from "../engine/resolve-prediction";
import type { GameState } from "../state/game-state";
import { playRound } from "../state/play-round";
import { startNewGame } from "../state/start-new-game";

interface GameActions {
  readonly startGame: () => void;
  readonly makePrediction: (direction: PredictionDirection) => void;
  readonly resetGame: () => void;
}

type GameStore = GameState & GameActions;

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

export const useGameStore = create<GameStore>((set) => ({
  ...initialGameState,

  startGame: () => {
    set(startNewGame());
  },

  makePrediction: (direction) => {
    set((state) => playRound(state, direction));
  },

  resetGame: () => {
    set(initialGameState);
  },
}));



// اللوجك:

// initialGameState: الحالة قبل بدء اللعبة
// startGame: تشغّل startNewGame
// makePrediction: تشغّل playRound
// resetGame: يرجع اللعبة إلى idle
// Zustand يحفظ الحالة ويحدث أي Component يستخدم useGameStore
// الـStore لا يحتوي قواعد اللعبة؛ هو فقط يربط الوظائف بالحالة