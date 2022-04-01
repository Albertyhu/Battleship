import { createPlayer } from './player.js'; 
import { generateGrid } from './grid.js'; 
import { placeAllShips } from './placeShips.js';
import { setSelf, setOpponent } from './computerAI.js';
import { trackTurns } from './turnTracking.js';

var playerOneTurn = true; 
const turnMessage = document.getElementById('turnMessage')
export const startGame = () => {

    const playerOne = createPlayer('player1', 'playerAreaOne', false);
    const playerTwo = createPlayer('computer', 'playerAreaTwo', false);
    setOpponent(playerOne);
    setSelf(playerTwo); 
/*  console.log(playerOne.shipArray);
console.log(playerOne.messages)
console.log(playerOne.boardArray);*/
    trackTurns(playerOne, playerTwo); 
    return {
        playerOne, 
        playerTwo,
    }
}

