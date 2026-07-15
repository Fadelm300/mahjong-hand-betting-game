// history-panel.tsx
// يعرض قائمة الجولات السابقة بشكل مختصر (عمود جانبي أصغر)، الأحدث فوق.

import type { RoundHistoryEntry } from "../state/game-state";

interface HistoryPanelProps {
  readonly history: readonly RoundHistoryEntry[];
}

const OUTCOME_STYLE: Record<string, string> = {
  win: "text-[color:var(--color-win)]",
  loss: "text-[color:var(--color-loss)]",
  push: "text-[color:var(--color-muted)]",
};

export function HistoryPanel({ history }: HistoryPanelProps) {
  const reversedHistory = [...history].reverse();

  return (
    <section>
      <h2 className="text-lg font-semibold text-[color:var(--color-accent-strong)]">
        History
      </h2>

      {reversedHistory.length === 0 ? (
        <p className="mt-4 text-sm italic text-[color:var(--color-muted)]">
          No rounds played yet.
        </p>
      ) : (
        <ul className="mt-4 flex max-h-[28rem] flex-col gap-2 overflow-y-auto pr-1">
          {reversedHistory.map((entry) => {
            const { prediction, revealedHandValue, settledHandValue } =
              entry.resolution;

            return (
              <li
                key={entry.roundNumber}
                className="rounded-md border border-[color:var(--color-surface-muted)] bg-[color:var(--color-surface)] px-3 py-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-muted)]">
                    Round {entry.roundNumber}
                  </span>

                  <span
                    className={`font-semibold uppercase ${
                      OUTCOME_STYLE[prediction.outcome] ?? ""
                    }`}
                  >
                    {prediction.outcome}
                  </span>
                </div>

                <p className="mt-1 text-[color:var(--color-muted)]">
                  Predicted{" "}
                  <strong className="text-[color:var(--color-foreground)]">
                    {prediction.direction}
                  </strong>{" "}
                  · Revealed {revealedHandValue} → Settled {settledHandValue}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
