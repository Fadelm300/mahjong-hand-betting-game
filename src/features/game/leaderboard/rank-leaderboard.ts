import { RULES_FROM_ASSESSMENT } from "../config/game-rules";

export interface LeaderboardEntry {
  readonly id: string;
  readonly score: number;
  readonly rounds: number;
  readonly completedAt: string;
}

export function rankLeaderboard(
  currentEntries: readonly LeaderboardEntry[],
  newEntry: LeaderboardEntry,
): LeaderboardEntry[] {
  const entriesWithoutDuplicate = currentEntries.filter(
    (entry) => entry.id !== newEntry.id,
  );

  return [...entriesWithoutDuplicate, newEntry]
    .sort((first, second) => {
      if (first.score !== second.score) {
        return second.score - first.score;
      }

      return second.completedAt.localeCompare(first.completedAt);
    })
    .slice(0, RULES_FROM_ASSESSMENT.leaderboardLimit);
}