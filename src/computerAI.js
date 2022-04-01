import { genRandom } from './randGen.js'; 
import { generateCoordinates } from './placeShips'; 

//Need to keep track of its own board as well as the other player's ships and board 
const memory = {
    self: null,  
    opponent: null,
    opponent_columns: 0,
}

export const setSelf = (player) => {
    memory.self = player; 
}

export const setOpponent = (player) => {
    memory.opponent = player; 
    opponent_columns = player.getBoardColumns(); 
}
