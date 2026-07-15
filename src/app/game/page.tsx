"use client";

import { useRouter } from "next/navigation";

import { useGameHydration } from "@/features/game/hooks/use-game-hydration";
import { useGameStore } from "@/features/game/store/game-store";
import type { Tile } from "@/features/game/types/game";

function getTileLabel(tile: Tile): string {
  if (tile.category === "number") {
    return `${tile.rank} ${tile.suit}`;
  }

  if (tile.category === "wind") {
    return `${tile.kind} wind`;
  }

  return `${tile.kind} dragon`;
}

export default function GamePage() {
  const router = useRouter();
  const hasHydrated = useGameHydration();

  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const round = useGameStore((state) => state.round);

  const currentHand = useGameStore((state) => state.currentHand);
  const currentHandValue = useGameStore(
    (state) => state.currentHandValue,
  );

  const drawPileCount = useGameStore(
    (state) => state.drawPile.length,
  );
  const discardPileCount = useGameStore(
    (state) => state.discardPile.length,
  );
  const exhaustionCount = useGameStore(
    (state) => state.exhaustionCount,
  );

  const history = useGameStore((state) => state.history);
  const gameOverReasons = useGameStore(
    (state) => state.gameOverReasons,
  );

  const startGame = useGameStore((state) => state.startGame);
  const makePrediction = useGameStore(
    (state) => state.makePrediction,
  );

  const lastRound = history[history.length - 1];
  const canPredict = status === "awaiting-prediction";

  if (!hasHydrated) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p>Loading saved game...</p>
      </main>
    );
  }

  if (status === "idle") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold">No active game</h1>

        <p className="mt-4">
          Return to the home page to start a new game.
        </p>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 border px-6 py-3"
        >
          Back to home
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">
        Mahjong Higher or Lower
      </h1>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        <p>Score: {score}</p>
        <p>Round: {round}</p>
        <p>Status: {status}</p>
        <p>Draw pile: {drawPileCount}</p>
        <p>Discard pile: {discardPileCount}</p>
        <p>Exhaustions: {exhaustionCount}/3</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Current hand</h2>

        <ul className="mt-4 grid gap-3 sm:grid-cols-4">
          {currentHand.map((tile) => (
            <li key={tile.id} className="border p-4">
              <p>{getTileLabel(tile)}</p>
              <p>Value: {tile.value}</p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xl">
          Hand value: {currentHandValue ?? "—"}
        </p>
      </section>

      {lastRound && (
        <section className="mt-8 border p-4">
          <h2 className="font-semibold">Last round</h2>
          <p>
            Prediction: {lastRound.resolution.prediction.direction}
          </p>
          <p>
            Result: {lastRound.resolution.prediction.outcome}
          </p>
          <p>
            Revealed value: {lastRound.resolution.revealedHandValue}
          </p>
          <p>
            Settled value: {lastRound.resolution.settledHandValue}
          </p>
        </section>
      )}

      {status === "game-over" ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Game over</h2>

          <ul className="mt-3">
            {gameOverReasons.map((reason, index) => (
              <li key={`${reason.type}-${index}`}>
                {reason.type}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={startGame}
            className="mt-6 border px-6 py-3"
          >
            Start another game
          </button>
        </section>
      ) : (
        <section className="mt-8 flex gap-4">
          <button
            type="button"
            disabled={!canPredict}
            onClick={() => makePrediction("higher")}
            className="border px-6 py-3 disabled:opacity-50"
          >
            Predict higher
          </button>

          <button
            type="button"
            disabled={!canPredict}
            onClick={() => makePrediction("lower")}
            className="border px-6 py-3 disabled:opacity-50"
          >
            Predict lower
          </button>
        </section>
      )}

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mt-8 underline"
      >
        Exit to home
      </button>
    </main>
  );
}