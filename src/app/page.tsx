"use client";

import { useRouter } from "next/navigation";

import { useGameHydration } from "@/features/game/hooks/use-game-hydration";
import { useGameStore } from "@/features/game/store/game-store";

export default function HomePage() {
  const router = useRouter();
  const hasHydrated = useGameHydration();

  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const round = useGameStore((state) => state.round);
  const startGame = useGameStore((state) => state.startGame);

  const canContinue =
    status === "awaiting-prediction" ||
    status === "resolving-round";

  function handleNewGame() {
    startGame();
    router.push("/game");
  }

  function handleContinue() {
    router.push("/game");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
          Mahjong hand prediction
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Higher or lower?
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/70">
          Predict whether the next Mahjong hand will have a higher or
          lower value than the current hand.
        </p>

        {!hasHydrated ? (
          <p className="mt-8">Loading saved game...</p>
        ) : (
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleNewGame}
              className="border px-6 py-3"
            >
              New game
            </button>

            {canContinue && (
              <button
                type="button"
                onClick={handleContinue}
                className="border px-6 py-3"
              >
                Continue game — Round {round}
              </button>
            )}
          </div>
        )}

        {hasHydrated && status === "game-over" && (
          <section className="mt-8 border p-4">
            <h2 className="font-semibold">Last completed game</h2>
            <p className="mt-2">Final score: {score}</p>
            <p>Final round: {round}</p>
          </section>
        )}
      </section>
    </main>
  );
}