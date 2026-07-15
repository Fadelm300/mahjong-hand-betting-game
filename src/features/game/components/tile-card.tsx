import { motion } from "motion/react";

import type { HonorValueChange } from "../engine/adjust-honor-values";
import type { Tile } from "../types/game";

const SUIT_LABEL: Record<
  Extract<Tile, { category: "number" }>["suit"],
  string
> = {
  characters: "Characters",
  bamboo: "Bamboo",
  dots: "Dots",
};

const NUMBER_GLYPH: Record<
  Extract<Tile, { category: "number" }>["suit"],
  readonly string[]
> = {
  characters: [
    "🀇",
    "🀈",
    "🀉",
    "🀊",
    "🀋",
    "🀌",
    "🀍",
    "🀎",
    "🀏",
  ],
  bamboo: ["🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘"],
  dots: ["🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"],
};

const WIND_GLYPH: Record<
  Extract<Tile, { category: "wind" }>["kind"],
  string
> = {
  east: "東",
  south: "南",
  west: "西",
  north: "北",
};

const DRAGON_GLYPH: Record<
  Extract<Tile, { category: "dragon" }>["kind"],
  string
> = {
  red: "中",
  green: "發",
  white: "白",
};

interface TileDisplay {
  readonly glyph: string;
  readonly label: string;
  readonly inkClass: string;
}

function getTileDisplay(tile: Tile): TileDisplay {
  if (tile.category === "number") {
    return {
      glyph: NUMBER_GLYPH[tile.suit][tile.rank - 1] ?? `${tile.rank}`,
      label: `${tile.rank} ${SUIT_LABEL[tile.suit]}`,
      inkClass:
        tile.suit === "characters"
          ? "text-red-800"
          : tile.suit === "bamboo"
            ? "text-emerald-800"
            : "text-blue-800",
    };
  }

  if (tile.category === "wind") {
    return {
      glyph: WIND_GLYPH[tile.kind],
      label: `${tile.kind} wind`,
      inkClass: "text-blue-800",
    };
  }

  return {
    glyph: DRAGON_GLYPH[tile.kind],
    label: `${tile.kind} dragon`,
    inkClass:
      tile.kind === "red"
        ? "text-red-700"
        : tile.kind === "green"
          ? "text-emerald-700"
          : "text-[color:var(--color-tile-ink)]",
  };
}

interface TileCardProps {
  readonly tile: Tile;
  readonly valueChange?: HonorValueChange | null;
  readonly index?: number;
}

export function TileCard({
  tile,
  valueChange = null,
  index = 0,
}: TileCardProps) {
  const display = getTileDisplay(tile);
  const delta = valueChange
    ? valueChange.nextValue - valueChange.previousValue
    : 0;

  return (
    <motion.div
      key={tile.id}
      data-tile-id={tile.id}
      role="img"
      aria-label={`${display.label}, value ${tile.value}`}
      initial={{ rotateY: 100, opacity: 0, y: 12 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      whileHover={{ y: -7, rotateX: 2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.09,
        ease: "easeOut",
      }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="relative aspect-[0.72] w-full rounded-[0.85rem] border border-[color:var(--color-tile-edge)] bg-[linear-gradient(145deg,var(--color-tile),#e9dfc5)] shadow-[0_5px_0_var(--color-tile-edge),0_16px_26px_rgb(0_0_0_/_28%)] sm:rounded-[1rem]"
    >
      <div className="pointer-events-none absolute inset-1.5 rounded-[0.6rem] border border-black/10 sm:inset-2 sm:rounded-[0.7rem]" />

      <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border border-black/10 bg-white/65 px-1 text-[10px] font-bold tabular-nums text-[color:var(--color-tile-ink)] shadow-sm sm:right-2.5 sm:top-2.5 sm:h-6 sm:min-w-6 sm:text-xs">
        {tile.value}
      </span>

      <div className="flex h-full flex-col items-center justify-center gap-1 px-1.5 pt-2 sm:gap-2 sm:px-2">
        <span
          className={`font-serif text-4xl font-normal leading-none drop-shadow-[0_1px_0_rgb(255_255_255_/_55%)] sm:text-6xl ${display.inkClass}`}
        >
          {display.glyph}
        </span>

        <span className="max-w-full truncate text-[7px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-tile-muted)] sm:text-[9px]">
          {display.label}
        </span>
      </div>

      {delta !== 0 && (
        <motion.span
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.09 + 0.4 }}
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[11px] font-bold shadow-md ${
            delta > 0
              ? "bg-[color:var(--color-win)] text-[color:var(--color-tile-ink)]"
              : "bg-[color:var(--color-loss)] text-[color:var(--color-tile-ink)]"
          }`}
        >
          {delta > 0 ? "+" : ""}
          {delta}
        </motion.span>
      )}
    </motion.div>
  );
}