"use client";

import { useRouter } from "next/navigation";

import { useGameHydration } from "@/features/game/hooks/use-game-hydration";
import { useGameStore } from "@/features/game/store/game-store";

const HOW_TO_PLAY_STEPS = [
  {
    title: "Draw a hand",
    description:
      "Every round starts with 4 tiles. Number tiles count at face value; Wind and Dragon tiles start at 5.",
  },
  {
    title: "Read the total",
    description:
      "The hand value is the sum of all 4 tiles — that's the number you're betting against.",
  },
  {
    title: "Predict higher or lower",
    description:
      "Guess whether the next hand's total will be higher or lower than the current one. A tie counts as a loss.",
  },
  {
    title: "Watch honor tiles shift",
    description:
      "Wind and Dragon tiles move up or down by 1 each round based on the outcome — the deck keeps evolving.",
  },
] as const;

const DECORATIVE_GLYPHS_LEFT = ["東", "發", "南"] as const;
const DECORATIVE_GLYPHS_RIGHT = ["中", "西", "北"] as const;

export default function HomePage() {
  const router = useRouter();
  const hasHydrated = useGameHydration();

  const status = useGameStore((state) => state.status);
  const score = useGameStore((state) => state.score);
  const round = useGameStore((state) => state.round);
  const startGame = useGameStore((state) => state.startGame);
  const leaderboard = useGameStore(
    (state) => state.leaderboard,
  );

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
    <main className="relative flex min-h-screen items-center overflow-hidden">
      {/* Radial glow background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* Decorative mahjong glyphs */}
      <div className="pointer-events-none absolute inset-0 hidden select-none lg:block">
        {DECORATIVE_GLYPHS_LEFT.map((glyph, index) => (
          <span
            key={glyph}
            className="absolute font-bold text-[color:var(--color-tile)]/[0.05]"
            style={{
              left: `${2 + index * 3}rem`,
              top: `${8 + index * 15}rem`,
              fontSize: `${9 + index * 2}rem`,
              transform: `rotate(${-8 + index * 4}deg)`,
            }}
          >
            {glyph}
          </span>
        ))}

        {DECORATIVE_GLYPHS_RIGHT.map((glyph, index) => (
          <span
            key={glyph}
            className="absolute font-bold text-[color:var(--color-tile)]/[0.05]"
            style={{
              right: `${2 + index * 3}rem`,
              top: `${6 + index * 16}rem`,
              fontSize: `${9 + index * 2}rem`,
              transform: `rotate(${8 - index * 4}deg)`,
            }}
          >
            {glyph}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:max-w-4xl sm:px-6 sm:py-20 lg:max-w-6xl lg:py-28 xl:max-w-7xl">
        {/* Hero */}
        <section className="max-w-3xl">
          <div className="mb-8 flex justify-center gap-4 text-6xl opacity-70 lg:justify-start">
            <span className="rotate-[-8deg]">🀇</span>
            <span className="translate-y-3">🀄</span>
            <span className="rotate-[8deg]">🀀</span>
          </div>

          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            <span aria-hidden>🀄</span>
            Mahjong hand prediction
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Higher or lower?
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-100/70">
            Predict whether the next Mahjong hand will have a higher or
            lower value than the current hand.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              🎴 136 Mahjong Tiles
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              🏆 High Score Challenge
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              ⚡ Dynamic Honor Tiles
            </span>
          </div>

          {!hasHydrated ? (
            <p className="mt-8">Loading saved game...</p>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleNewGame}
                className="rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-105"
              >
                New game
              </button>

              {canContinue && (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-8 py-4 text-lg font-semibold transition hover:bg-emerald-500/20"
                >
                  Continue game — Round {round}
                </button>
              )}
            </div>
          )}

          {hasHydrated && status === "game-over" && (
            <div className="mt-8 flex flex-wrap gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
              <p className="text-sm text-emerald-100/60">
                Last completed game
              </p>
              <p className="text-sm">
                Final score:{" "}
                <span className="font-bold text-[color:var(--color-accent-strong)]">
                  {score}
                </span>
              </p>
              <p className="text-sm">
                Final round:{" "}
                <span className="font-bold text-[color:var(--color-accent-strong)]">
                  {round}
                </span>
              </p>
            </div>
          )}
        </section>

        {/* How to play + Leaderboard */}
        {hasHydrated && (
          <div className="mt-16 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-amber-400/20 p-3 text-2xl">
                  🀄
                </div>

                <div>
                  <h2 className="text-2xl font-bold">How to play</h2>
                  <p className="text-sm text-emerald-100/60">
                    Learn the rules in under one minute.
                  </p>
                </div>
              </div>

              <ol className="space-y-5">
                {HOW_TO_PLAY_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-black">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm text-emerald-100/60">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-amber-400/20 p-3 text-2xl">
                  🏆
                </div>

                <div>
                  <h2 className="text-2xl font-bold">Leaderboard</h2>
                  <p className="text-sm text-emerald-100/60">
                    Top {leaderboard.length > 0 ? leaderboard.length : ""}{" "}
                    completed games.
                  </p>
                </div>
              </div>

              {leaderboard.length === 0 ? (
                <p className="text-sm italic text-emerald-100/50">
                  No completed scores yet.
                </p>
              ) : (
                <ol className="space-y-2">
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const rankColorClass =
                      rank === 1
                        ? "bg-amber-400 text-black"
                        : rank === 2
                          ? "bg-slate-300 text-black"
                          : rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-white/10 text-emerald-100/70";

                    return (
                      <li
                        key={entry.id}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/10 px-4 py-3"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankColorClass}`}
                        >
                          {rank}
                        </span>

                        <div className="flex flex-1 items-baseline justify-between">
                          <span className="font-semibold text-[color:var(--color-accent-strong)]">
                            Score {entry.score}
                          </span>

                          <span className="text-sm text-emerald-100/60">
                            {entry.rounds} rounds
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </div>
        )}

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-emerald-100/40">
          Mahjong Hand Prediction • Built with Next.js, TypeScript &amp; Zustand,by Fadel Mohammad Fadel
        </footer>
      </div>
    </main>
  );
}