"use client";

import { useRouter } from "next/navigation";

import { GameStats } from "@/features/game/components/game-stats";
import { HandDisplay } from "@/features/game/components/hand-display";
import { HistoryPanel } from "@/features/game/components/history-panel";
import { useGameHydration } from "@/features/game/hooks/use-game-hydration";
import { useGameStore } from "@/features/game/store/game-store";

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

  const goHome = () => router.push("/");

  if (!hasHydrated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p>Loading saved game...</p>
      </main>
    );
  }

  if (status === "idle") {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">No active game</h1>

        <p className="mt-4">
          Return to the home page to start a new game.
        </p>

        <button
          type="button"
          onClick={goHome}
          className="mt-6 border px-6 py-3"
        >
          Back to home
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <GameStats
        score={score}
        round={round}
        exhaustionCount={exhaustionCount}
        drawPileCount={drawPileCount}
        discardPileCount={discardPileCount}
        onExit={goHome}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <HandDisplay
            hand={currentHand}
            handValue={currentHandValue}
            lastTileValueChanges={lastRound?.resolution.tileValueChanges}
          />

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
            <>
              <p className="mt-8 text-lg italic text-[color:var(--color-muted)]">
                Will the next hand be higher or lower than{" "}
                {currentHandValue ?? "—"}?
              </p>

              <section className="mt-4 flex gap-4">
                <button
                  type="button"
                  disabled={!canPredict}
                  onClick={() => makePrediction("higher")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span aria-hidden>▲</span>
                  Bet higher
                </button>

                <button
                  type="button"
                  disabled={!canPredict}
                  onClick={() => makePrediction("lower")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-900 px-6 py-3 font-semibold text-white transition hover:bg-red-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span aria-hidden>▼</span>
                  Bet lower
                </button>
              </section>
            </>
          )}
        </div>

        <div>
          <HistoryPanel history={history} />
        </div>
      </div>
    </main>
  );
}
