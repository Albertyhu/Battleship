//Have an 2-tier array that contains the ships and the coordinates 
//The ships arrays of 
//The game has to recognize that the ships cannot go out of bounds. 

//const samplearray = ["carrier"= [], "battleship"=[], "destroyer" = [], "submarine" = [], "patrol"=[]]

import { generateGrid } from './grid.js';
import { placeAllShips } from './placeShips.js';


export const createPlayer = (name, container, isAI) => {
    const newplayer = new Object();
    newplayer.boardArray = [];
    newplayer.boardColumns = 0; 
    newplayer.boardNode = null;
    newplayer.shipArray = []; 
    newplayer.name = name;
    newplayer.messages = []; 
    newplayer.setBoardColumns = (columns) => {
        newplayer.boardColumns = columns; 
    }
    newplayer.getBoardColumns = () => {
        return newplayer.boardColumns; 
    }
    newplayer.reset = () => {
        while (newplayer.boardArray.length !== 0) {
            var item = newplayer.boardArray.pop();
        }
        newplayer.boardArray = [];
        newplayer.boardNode = null;
        while (newplayer.shipArray.length !== 0) {
            var item = newplayer.shipArray.pop();
        }
        newplayer.shipArray = [];
        newplayer.name = name;
        while (newplayer.messages.length !== 0) {
            var item = newplayer.messages.pop();
        }
        newplayer.messages = [];
    }

    const playerArea = document.getElementById(container);
    playerArea.appendChild(generateGrid(10, newplayer));
    placeAllShips(newplayer, 10)

    return newplayer; 
}
