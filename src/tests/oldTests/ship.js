import {createShip } from '../ship.js'; 


export const createPlayer = (name, isAI) => {
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

const isShipSunk = (player, ship) => {
    var isSunk = true;
    ship.posArray.forEach(pos => {
        if (!pos.isHit) {
            isSunk = false;
        }
    })
    return isSunk;
}

test("Hit ship is not sunk yet", () => {
    const player = createPlayer('playerOne', 'playerOneArea',false)
    const destroyer = createShip(3, "carrier"); 
    destroyer.setPos(3, 1);
    destroyer.setPos(4, 1); 
    destroyer.setPos(5, 1);
    player.shipArray.push(destroyer); 
    destroyer.posArray[1].isHit = true; 
    destroyer.posArray[0].isHit = false; 
    expect(isShipSunk(player, destroyer)).toBe(false); 
})

test("Hit ship is sunk", () => {
    const player = createPlayer('playerOne', 'playerOneArea', false)
    const destroyer = createShip(3, "carrier");
    destroyer.setPos(3, 1);
    destroyer.setPos(4, 1);
    destroyer.setPos(5, 1);
    player.shipArray.push(destroyer);
    destroyer.posArray[0].isHit = true;
    destroyer.posArray[1].isHit = true;
    destroyer.posArray[2].isHit = true;
    expect(isShipSunk(player, destroyer)).toBe(true);
})

