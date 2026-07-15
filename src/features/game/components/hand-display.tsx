import { AnimatePresence } from "motion/react";

import type { HonorValueChange } from "../engine/adjust-honor-values";
import type { Hand } from "../types/game";
import { TileCard } from "./tile-card";

interface HandDisplayProps {
  readonly hand: Hand;
  readonly handValue: number | null;
  readonly lastTileValueChanges?: readonly HonorValueChange[];
}

export function HandDisplay({
  hand,
  handValue,
  lastTileValueChanges = [],
}: HandDisplayProps) {
  return (
    <section className="rounded-[1.75rem] border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 shadow-[0_24px_80px_rgb(0_0_0_/_22%)] sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-accent-strong)]">
            Mahjong tiles
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Current hand
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            Total
          </p>
          <p className="mt-0.5 text-4xl font-light leading-none tabular-nums text-[color:var(--color-foreground)] sm:text-5xl">
            {handValue ?? "—"}
          </p>
        </div>
      </div>

      <ul
        className="mt-7 grid grid-cols-4 gap-2 sm:gap-4"
        style={{ perspective: 1000 }}
      >
        <AnimatePresence mode="popLayout">
          {hand.map((tile, index) => {
            const valueChange =
              lastTileValueChanges.find(
                (change) => change.tileId === tile.id,
              ) ?? null;

            return (
              <li key={tile.id}>
                <TileCard
                  tile={tile}
                  valueChange={valueChange}
                  index={index}
                />
              </li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p className="mt-6 border-t border-[color:var(--color-line)] pt-4 text-center text-xs uppercase tracking-[0.16em] text-[color:var(--color-muted)]">
        Four tiles · values shown in the corner
      </p>
    </section>
  );
}