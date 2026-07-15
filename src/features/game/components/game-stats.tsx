import { RULES_FROM_ASSESSMENT } from "../config/game-rules";

interface GameStatsProps {
  readonly score: number;
  readonly round: number;
  readonly exhaustionCount: number;
  readonly drawPileCount: number;
  readonly discardPileCount: number;
  readonly onExit: () => void;
}

interface StatBlockProps {
  readonly label: string;
  readonly value: string | number;
}

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="min-w-0 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-muted)] px-3 py-3 text-center sm:min-w-24 sm:px-4 sm:text-right">
      <p className="truncate text-[9px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-muted)] sm:text-[10px]">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-[color:var(--color-accent-strong)] sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

export function GameStats({
  score,
  round,
  exhaustionCount,
  drawPileCount,
  discardPileCount,
  onExit,
}: GameStatsProps) {
  return (
    <header className="rounded-[1.75rem] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4 shadow-[0_24px_80px_rgb(0_0_0_/_24%)] sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onExit}
          className="group flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm font-medium text-[color:var(--color-muted)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-foreground)]"
        >
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←
          </span>
          Exit
        </button>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <StatBlock label="Score" value={score} />
          <StatBlock label="Round" value={round} />
          <StatBlock
            label="Reshuffles"
            value={`${exhaustionCount}/${RULES_FROM_ASSESSMENT.maximumDrawPileExhaustions}`}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[color:var(--color-line)] pt-4 text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--color-muted)] sm:text-sm">
        <span>
          Draw pile{" "}
          <strong className="tabular-nums text-[color:var(--color-foreground)]">
            {drawPileCount}
          </strong>
        </span>
        <span
          aria-hidden="true"
          className="text-[color:var(--color-accent)]"
        >
          ◆
        </span>
        <span>
          Discard pile{" "}
          <strong className="tabular-nums text-[color:var(--color-foreground)]">
            {discardPileCount}
          </strong>
        </span>
      </div>
    </header>
  );
}