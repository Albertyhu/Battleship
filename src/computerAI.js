import { genRandom } from './randGen.js'; 
import { generateCoordinates } from './placeShips'; 
import { hitEmpty, hitOccupied } from './grid.js';

//It only needs to keep track of the opponent's ships and board 
//randomly picks coordinates. 
//Need to recognize not to pick hit areas
//When it does hit the opponent's ship, it needs to hit the adjacent areas. 
//Needs to know when it's turn comes up
//Needs to know when the game is over. 

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
    memory.opponent_columns = player.getBoardColumns(); 
}

//turn is false when it's the AI's turn 
export const runAI = (player) => {
    if(!player.turnTracker.getTurnStatus()) {
        hitOpponentArea(player);
    }
  
}
//needs to know the player's board 
//needs to avoid hit areas 
export const hitOpponentArea = (player) => {
    var attackArea = false;
    while (!attackArea) {
        var coordinates = generateCoordinates(10); 
        for (var i = 0; i < player.opponent.boardArray.length; i++) {
            if (coordinates.x === player.opponent.boardArray[i].x && coordinates.y === player.opponent.boardArray[i].y) {
                if (!player.opponent.boardArray[i].hit) {
                    //if area does contain the enemy ship 
                    const square = getSquare(player.opponent.name, coordinates.x, coordinates.y)
                    if (player.opponent.boardArray[i].occupied) {
                        hitOccupied(player.opponent, square, coordinates.x, coordinates.y); 
                        attackArea = false;
                    }
                    else {
                        hitEmpty(square); 
                        player.turnTracker.toggleTurn(); 
                        attackArea = true; 
                       
                    }
                    player.opponent.boardArray[i].hit = true;


                }
                //if the area has already been hit. 
                else {
                    attackArea = false; 
                }
            }
        }
    }
}


export const getSquare = (player, x , y) => {
    const squareID = player + "-" + x + "," + y; 
    const square = document.getElementById(squareID); 
    return square; 
}