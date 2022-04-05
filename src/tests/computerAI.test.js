//import { hitOpponentArea } from '../computerAI.js'; 
import { generateCoordinates } from '../placeShips.js';

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

/*
const hitOpponentArea = (player, x, y) => {
        //var coordinates = generateCoordinates(10);
    var message = 'Area not found.';
    player.boardArray.forEach(area => {
            if (area.x === x && area.y === y) {
                if (!area.hit) {
                    const areaID = player.name + "-" + area.x + "," + area.y;
                    //  const targetSquare = document.getElementById(areaID)
                    if (area.occuppied) {
                        //   hitOccupied(player, targetSquare, area.x, area.y)
                        message = 'Ship hit';
                    }
                    else {
                        // hitEmpty(targetSquare);
                        // self.turnTracker.toggleTurn();
                        message = 'Empty Area hit'; 
                    }
                    area.hit = true;
                }
                else {
                    message = "Area has already been hit."; 
                }
            }
            else {
            }
        })
    return message; 
}*/


const hitOpponentArea = (player, x, y) => {
 console.log(player.boardArray)
    for (var i = 0; i < player.boardArray.length; i++) {
        if (player.boardArray[i].x === x && player.boardArray[i].y === y) {
            if (!player.boardArray[i].hit) {
                const areaID = player.name + "-" + x + "," + y;
                if (player.boardArray[i].occupied) {
                    //   hitOccupied(player, targetSquare, area.x, area.y)
                    i = player.boardArray.length;
                    return 'Ship hit';
                }
                else {
                    // hitEmpty(targetSquare);
                    // self.turnTracker.toggleTurn();
                    i = player.boardArray.length;
                    return 'Empty Area hit';
                }

                player.boardArray[i].hit = true;
            }
            else {
                i = player.boardArray.length;
                return "Area has already been hit";
            }
        }
        else {

        }
    }
}

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
    newplayer.placeShips =(x, y)=>{
        newplayer.boardArray.forEach(coor => {
            if (coor.x === x && coor.y === y) {
                coor.occupied = true; 
            }
        })
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


const doesShipExist = (player, x, y) => {
    var exist = false; 
    player.boardArray.forEach(area => {
        if (area.x === x, area.y === y) {
            if(area.occupied)
                exist = true; 
    }
    })
    return exist; 
}

/*
test('Is Ship placed?', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);

    expect(doesShipExist(player, 3, 3)).toBe(true)
})
*/

test('Confirm hit ship', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
//    console.log(player.boardArray)
    expect(hitOpponentArea(player, 3, 2)).toBe("Ship hit")
})


test('Missed target', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    expect(hitOpponentArea(player, 4, 4)).toBe("Empty Area hit")
})
    
