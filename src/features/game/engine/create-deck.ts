import {
  GAME_ASSUMPTIONS,
  RULES_FROM_ASSESSMENT,
} from "../config/game-rules";

import type {
  DragonTile,
  NumberTile,
  Tile,
  WindTile,
} from "../types/game";
//why we have decksequence parameter in createDeck function?
//decksequence parameter is used to create unique ids for each tile in the deck. It is used to differentiate between different decks of tiles in the game. For example, if we have two decks of tiles, we can use decksequence 1 for the first deck and decksequence 2 for the second deck. This way, we can have unique ids for each tile in the game. 
//I still not sure if it's the best way to do it i will come back to it later 
// any way the function should acept a poseteve interger as a parameter and throw an error if the parameter is not a positive integer or <=0

export function createDeck(deckSequence = 1): Tile[] {
  if (!Number.isInteger(deckSequence) || deckSequence <= 0) {
    throw new Error("deckSequence must be a positive integer");
  }

  const tiles: Tile[] = [];
  const { deck } = GAME_ASSUMPTIONS;
// the three for loops below are used to create the number tiles in the deck.
//  The first loop iterates over the number suits, 
// the second loop iterates over the number ranks,
//  and the third loop iterates over the copies per tile.
//  For each combination of suit, rank, and copy, a new NumberTile object is created and pushed to the tiles array.
//example of a number tile in the game of Mahjong. It has a suit of "bamboo", a rank of 3, and a value of 3. The valueGroup is null because it is not part of any group of tiles with the same value.
//3 Suits × 9 Ranks × 4 Copies = 108 Number Tiles  
for (const suit of deck.numberSuits) {
    for (const rank of deck.numberRanks) {
      for (let copy = 1; copy <= deck.copiesPerTile; copy += 1) {
        const tile: NumberTile = {
          id: `deck-${deckSequence}:number:${suit}:${rank}:${copy}`,
          category: "number",
          suit,
          rank,
          //so the value of bamboo 7 value is 7, and the value of bamboo 3 is 3, and the value of bamboo 1 is 1, and so on.
          value: rank,
          valueGroup: null,
        };

        tiles.push(tile);
      }
    }
  }
  //next we create the wind tiles in the deck. The wind tiles are created in a similar way to the number tiles, but with a different set of properties. The wind tiles have a kind property instead of a suit and rank property, and they have a valueGroup property that is either the id of the tile or a string that represents the kind of wind tile, depending on the value of the honorValueScope game assumption.
  //ex 4 Winds × 4 Copies = 16 Wind Tiles each wind tile has a value of 5, and the valueGroup is either the id of the tile or a string that represents the kind of wind tile, depending on the value of the honorValueScope game assumption.

  for (const kind of deck.winds) {
    for (let copy = 1; copy <= deck.copiesPerTile; copy += 1) {
      const id = `deck-${deckSequence}:wind:${kind}:${copy}`;

      const tile: WindTile = {
        id,
        category: "wind",
        kind,
        value: RULES_FROM_ASSESSMENT.honorInitialValue,
        valueGroup:
          GAME_ASSUMPTIONS.honorValueScope === "tile-instance"
            ? id
            : `wind:${kind}`,
      };

      tiles.push(tile);
    }
  }

  //next we create the dragon tiles in the deck. The dragon tiles are created in a similar way to the wind tiles, but with a different set of properties. The dragon tiles have a kind property instead of a suit and rank property, and they have a valueGroup property that is either the id of the tile or a string that represents the kind of dragon tile, depending on the value of the honorValueScope game assumption.
    //ex 3 Dragons × 4 Copies = 12 Dragon Tiles each dragon tile has a value of 5, and the valueGroup is either the id of the tile or a string that represents the kind of dragon tile, depending on the value of the honorValueScope game assumption.
    
  for (const kind of deck.dragons) {
    for (let copy = 1; copy <= deck.copiesPerTile; copy += 1) {
      const id = `deck-${deckSequence}:dragon:${kind}:${copy}`;

      const tile: DragonTile = {
        id,
        category: "dragon",
        kind,
        value: RULES_FROM_ASSESSMENT.honorInitialValue,
        valueGroup:
          GAME_ASSUMPTIONS.honorValueScope === "tile-instance"
            ? id
            : `dragon:${kind}`,
      };

      tiles.push(tile);
    }
  }

  return tiles;
}