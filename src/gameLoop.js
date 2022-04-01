import { createPlayer } from './player.js'; 
import { generateGrid } from './grid.js'; 
import { placeAllShips } from './placeShips.js';
import { setSelf, setOpponent } from './computerAI.js';

var playerOneTurn = true; 

export const startGame = () => {
    playerOneTurn = true; 
    const playerOne = createPlayer('player1', 'playerAreaOne', false);
    const playerTwo = createPlayer('computer', 'playerAreaTwo', false);
    setOpponent(playerOne);
    setSelf(playerTwo); 
/*  console.log(playerOne.shipArray);
console.log(playerOne.messages)
console.log(playerOne.boardArray);*/

    return {
        playerOne, 
        playerTwo
    }
}


export const toggleTurn = () => {
    playerOneTurn = !playerOneTurn; 
}