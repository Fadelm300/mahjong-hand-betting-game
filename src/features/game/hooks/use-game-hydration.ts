"use client";

import { useEffect } from "react";

import { useGameStore } from "../store/game-store";

export function useGameHydration(): boolean {
  const hasHydrated = useGameStore((state) => state.hasHydrated);
  const setHasHydrated = useGameStore(
    (state) => state.setHasHydrated,
  );

  useEffect(() => {
    if (useGameStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }

    async function hydrateGameStore() {
      try {
        await useGameStore.persist.rehydrate();
      } finally {
        setHasHydrated(true);
      }
    }

    void hydrateGameStore();
  }, [setHasHydrated]);

  return hasHydrated;
}