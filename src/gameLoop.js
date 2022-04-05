import { createPlayer } from './player.js'; 
import { generateGrid } from './grid.js'; 
import { placeAllShips } from './placeShips.js';
import { setSelf, setOpponent } from './computerAI.js';
import { trackTurns } from './turnTracking.js';
import { runAI } from './computerAI.js'; 

var playerOneTurn = true; 
const turnMessage = document.getElementById('turnMessage')


export const startGame = () => {
    const newGame = new Object();
    newGame.over = false;
    newGame.endGame = () => {
        newGame.over = true; 
    }
    const playerOne = createPlayer('playerOne', 'playerTwo', 'playerAreaOne', false);
    const playerTwo = createPlayer('playerTwo', 'playerOne', 'playerAreaTwo', true);


    //The following two lines is a way to let both player objects know if a winner is announced. 
    playerOne.setGameObject(newGame);
    playerTwo.setGameObject(newGame);

    trackTurns(playerOne, playerTwo);
    if (playerTwo.isComputer) {
        playerTwo.setOpponent(playerOne);
        runAI(playerTwo);
    }

    document.getElementById('announcement').innerHTML = '';
    document.getElementById('endGameMessage').innerHTML = '';


    return {
        playerOne, 
        playerTwo,
    }

}

