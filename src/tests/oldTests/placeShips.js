import { isItOccuppied } from '../placeShips.js'
//import { createPlayer } from '../player.js'; 
//import { generateGrid } from '../grid.js';
const createPlayer = (name, isAI) => {
    const newplayer = new Object();
    newplayer.boardArray = [];
    newplayer.boardColumns = 0;
    newplayer.boardNode = null;

    //Array of all the player's ships
    newplayer.shipArray = [];
    newplayer.name = name;
    newplayer.messages = [];

    //turnTracker is an object shared between players that tracks whose turn it is 
    newplayer.turnTracker = null;
    //turnBoolID helps to track turns 
    newplayer.turnBoolID = false;
    newplayer.setTurnTracker = (item, turnID) => {
        newplayer.turnTracker = item;
        newplayer.turnBoolID = turnID;
    }
    newplayer.setBoardColumns = (columns) => {
        newplayer.boardColumns = columns;
    }
    newplayer.getBoardColumns = () => {
        return newplayer.boardColumns;
    }

    return newplayer;
}

function fillArray(player) {
    generateRow(10, 10, player);
}

function generateRow(column, count, player) {
    if (count > 0) {
        for (var i = 1; i <= column; i++) {
            const coordinate = i + ',' + count;
            const area = {
                coordinate,
                x: i,
                y: count,
                hit: false,
                occupied: false,
            }
            player.boardArray.push(area);
        }
        generateRow(column, count - 1, player)
    }
}

test("Test for empty area", () => {
    const testPlayer = createPlayer('test'); 
    const playerOneArea = fillArray(testPlayer)
    expect(isItOccuppied(testPlayer, { x: 3, y: 4 }, 3, true)).toBe(false); 
})

