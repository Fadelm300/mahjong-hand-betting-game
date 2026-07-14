export const RULES_FROM_ASSESSMENT = {
  numberTileValue: "face-value",
  honorInitialValue: 5,
  honorValueChange: 1,
  minimumTileValue: 0,
  maximumTileValue: 10,
  maximumDrawPileExhaustions: 3,
  leaderboardLimit: 5,
} as const;
// the previous values are based on the assessment of the game rules in the project description, but they can be changed to any other values as long as they are consistent with the game rules.
//the next values are based on the assessment of the game rules in the project description, but they can be changed to any other values as long as they are consistent with the game rules.
export const GAME_ASSUMPTIONS = {
  handSize: 4,

  score: {
    correctPrediction: 1,
    incorrectPrediction: 0,
  },

  tieOutcome: "loss", //if the player and the dealer have the same hand value, the player loses the round you can change this to "win" or "draw" if you want to change the game rules.
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
} as const; //as const يعني ان القيم الموجودة في الكائن لا يمكن تغييرها بعد تعريفها ودقيقة