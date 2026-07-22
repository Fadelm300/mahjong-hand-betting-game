"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

import { GameStats } from "@/features/game/components/game-stats";
import { HandDisplay } from "@/features/game/components/hand-display";
import { HistoryPanel } from "@/features/game/components/history-panel";
import type { GameOverReason } from "@/features/game/engine/find-game-over-reasons";
import { useGameHydration } from "@/features/game/hooks/use-game-hydration";
import { useGameStore } from "@/features/game/store/game-store";

function getGameOverReasonLabel(reason: GameOverReason): string {
  switch (reason.type) {

    case "tile-value-minimum":

      return `Tile ${reason.tileId} reached the minimum value of ${reason.value}.`;

    case "tile-value-maximum":

      return `Tile ${reason.tileId} reached the maximum value of ${reason.value}.`;

    case "draw-pile-exhausted":

      return `The draw pile was exhausted ${reason.exhaustionCount} times.`;

  }

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
  const lastOutcome = lastRound?.resolution.prediction.outcome;

  const canPredict = status === "awaiting-prediction";

  const goHome = () => router.push("/");

  if (!hasHydrated) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--color-muted)] border-t-[color:var(--color-accent)]" />

          <p className="mt-4 text-[color:var(--color-muted)]">
            Loading saved game...
          </p>
        </div>
      </main>
    );
  }

  if (status === "idle") {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-8 text-center shadow-[0_24px_80px_rgb(0_0_0_/_24%)]">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-strong)]">
            Mahjong prediction
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            No active game
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-[color:var(--color-muted)]">
            Return to the home page to start a new game.
          </p>

          <button
            type="button"
            onClick={goHome}
            className="mt-7 rounded-xl bg-[color:var(--color-accent)] px-6 py-3 font-semibold text-[color:var(--color-background)] transition hover:brightness-110 active:scale-[0.98]"
          >
            Back to home
          </button>
        </section>
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
            lastTileValueChanges={
              lastRound?.resolution.tileValueChanges
            }
          />

          {status !== "game-over" && (
            <AnimatePresence mode="wait">
              {lastRound && (
                <motion.section
                  key={lastRound.roundNumber}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  aria-live="polite"
                  className={`mt-6 overflow-hidden rounded-2xl border p-5 ${
                    lastOutcome === "win"
                      ? "border-emerald-400/40 bg-emerald-950/60"
                      : lastOutcome === "push"
                        ? "border-amber-300/40 bg-amber-950/50"
                        : "border-red-400/40 bg-red-950/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ rotate: -12, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{
                        delay: 0.12,
                        type: "spring",
                        stiffness: 250,
                      }}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                        lastOutcome === "win"
                          ? "bg-emerald-400 text-emerald-950"
                          : lastOutcome === "push"
                            ? "bg-amber-300 text-amber-950"
                            : "bg-red-400 text-red-950"
                      }`}
                    >
                      {lastOutcome === "win"
                        ? "✓"
                        : lastOutcome === "push"
                          ? "="
                          : "×"}
                    </motion.div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold uppercase tracking-[0.2em] ${
                          lastOutcome === "win"
                            ? "text-emerald-300"
                            : lastOutcome === "push"
                              ? "text-amber-200"
                              : "text-red-300"
                        }`}
                      >
                        Round {lastRound.roundNumber}
                      </p>

                      <h2 className="mt-1 text-2xl font-semibold">
                        {lastOutcome === "win"
                          ? "Correct prediction!"
                          : lastOutcome === "push"
                            ? "Equal hand"
                            : "Incorrect prediction"}
                      </h2>

                      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                        You predicted{" "}
                        <strong className="text-[color:var(--color-foreground)]">
                          {
                            lastRound.resolution.prediction
                              .direction
                          }
                        </strong>
                        . The hand changed from{" "}
                        <strong className="text-[color:var(--color-foreground)]">
                          {lastRound.resolution.currentHandValue}
                        </strong>{" "}
                        to{" "}
                        <strong className="text-[color:var(--color-foreground)]">
                          {lastRound.resolution.revealedHandValue}
                        </strong>
                        .
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-black/20 px-3 py-1.5">
                          Revealed:{" "}
                          {lastRound.resolution.revealedHandValue}
                        </span>

                        <span className="rounded-full bg-black/20 px-3 py-1.5">
                          Settled:{" "}
                          {lastRound.resolution.settledHandValue}
                        </span>

                        <span className="rounded-full bg-black/20 px-3 py-1.5">
                          Score: +
                          {
                            lastRound.resolution.prediction
                              .scoreDelta
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          )}

          {status === "game-over" ? (
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45 }}
              aria-live="polite"
              className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--color-accent)]/40 bg-[color:var(--color-surface)] shadow-[0_24px_80px_rgb(0_0_0_/_26%)]"
            >
              <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--color-accent-strong)]">
                  Session complete
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Game over
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                      Final score
                    </p>

                    <motion.p
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                      }}
                      className="mt-2 text-5xl font-bold tabular-nums text-[color:var(--color-accent-strong)]"
                    >
                      {score}
                    </motion.p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] p-5 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
                      Rounds played
                    </p>

                    <p className="mt-2 text-5xl font-bold tabular-nums">
                      {round}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[color:var(--color-line)] p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
                    Why the session ended
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {gameOverReasons.map((reason, index) => (
                      <li
                        key={`${reason.type}-${index}`}
                        className="flex gap-2 text-sm"
                      >
                        <span
                          aria-hidden
                          className="text-[color:var(--color-accent)]"
                        >
                          ◆
                        </span>

                        <span>
                          {getGameOverReasonLabel(reason)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={startGame}
                    className="flex-1 rounded-xl bg-[color:var(--color-accent)] px-6 py-3 font-semibold text-[color:var(--color-background)] transition hover:brightness-110 active:scale-[0.98]"
                  >
                    Start another game
                  </button>

                  <button
                    type="button"
                    onClick={goHome}
                    className="flex-1 rounded-xl border border-[color:var(--color-line)] px-6 py-3 font-semibold transition hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-surface-muted)] active:scale-[0.98]"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            </motion.section>
          ) : (
            <>
              <p className="mt-8 text-center text-lg italic text-[color:var(--color-muted)]">
                Will the next hand be higher or lower than{" "}
                <strong className="not-italic text-[color:var(--color-foreground)]">
                  {currentHandValue ?? "—"}
                </strong>
                ?
              </p>

              <section className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!canPredict}
                  onClick={() => makePrediction("higher")}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-emerald-700 px-6 py-4 font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span
                    aria-hidden
                    className="transition-transform group-hover:-translate-y-0.5"
                  >
                    ▲
                  </span>
                  Predict higher
                </button>

                <button
                  type="button"
                  disabled={!canPredict}
                  onClick={() => makePrediction("lower")}
                  className="group flex items-center justify-center gap-3 rounded-xl bg-red-900 px-6 py-4 font-semibold text-white shadow-lg shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-red-800 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-y-0.5"
                  >
                    ▼
                  </span>
                  Predict lower
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