export const RULES_FROM_ASSESSMENT = {
  numberTileValue: "face-value",
  honorInitialValue: 5,
  honorValueChange: 1,
  minimumTileValue: 0,
  maximumTileValue: 10,
  maximumDrawPileExhaustions: 3,
  leaderboardLimit: 5,
} as const;

export const GAME_ASSUMPTIONS = {
  handSize: 4,

  score: {
    correctPrediction: 1,
    incorrectPrediction: 0,
  },

  tieOutcome: "loss",
  honorValueScope: "tile-instance",
  useAdjustedValueAsNextBaseline: true,
  thirdExhaustionTiming: "after-round",

  deck: {
    numberSuits: ["characters", "bamboo", "dots"],
    numberRanks: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    winds: ["east", "south", "west", "north"],
    dragons: ["red", "green", "white"],
    copiesPerTile: 4,
  },
} as const;