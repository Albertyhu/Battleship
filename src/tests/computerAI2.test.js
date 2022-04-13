//After hitting a ship the 2nd, program should know what the orientation of the ship is. 
//Function compares the x and y coordinates in the parameters with the x and y coordinates stored in previousTarget

import { genRandom } from '../randGen.js';

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
    newplayer.placeShipPart = (x, y) => {
        newplayer.boardArray.forEach(coor => {
            if (coor.x === x && coor.y === y) {
                coor.occupied = true;
            }
        })
    }

    newplayer.placeShip = (x, y, length, isHoriz, shipName) => {
        if (length !== 0) {
            if (isHoriz) {
                if (x + length <= newplayer.boardColumns) {
                    for (var i = 0; i < newplayer.boardArray.length; i++) {
                        if (newplayer.boardArray[i].x === x && newplayer.boardArray[i].y === y) {
                            newplayer.boardArray[i].occupied = true;
                        }
                    }
                }
                else {
                    console.log("Placement is not valid.")
                    console.log("x: " + x)
                    console.log("length: " + length)
                    console.log("boardColumns: " + newplayer.boardColumns)
                }
                newplayer.placeShip(x + 1, y, length - 1, isHoriz, shipName)
            }
            else {
                if (y - length > 0) {
                    for (var i = 0; i < newplayer.boardArray.length; i++) {
                        if (newplayer.boardArray[i].x === x && newplayer.boardArray[i].y === y) {
                            newplayer.boardArray[i].occupied = true;
                        }

                    }
                }
                else {
                    console.log("Placement is not valid.")
                }
                newplayer.placeShip(x, y - 1, length - 1, isHoriz, shipName)
            }
        }
    } 

    newplayer.hitArea = (x, y) => {
        for (var i = 0; i < newplayer.boardArray.length; i++) {
            if (newplayer.boardArray[i].x === x && newplayer.boardArray[i].y === y) {
                newplayer.boardArray[i].hit = true; 
            }
        }
    }
    return newplayer;
}

const memory = {
    nextTarget: [],
    nextSecondaryTarget: [], 
    hitTarget: [],

    //keeps track of previous target; 
    previousTarget: null,

    //keeps track of the current target 
    currentTarget: null,

    //Keeps track of whether or not enemy ships orientation have been identified 
    identifiedOrientation: false,
    //This keeps track of the orientation of the ship it's attacking. 
    isHoriz: true,

    //number of times an attack hits its target
    // it resets to 0 if an attempt missed its target
    hitCounts: 0,
    opponent: null,
    enemyShipOrientationIdentified: false,
    fillTarget(x_coor, y_coor) {
        this.nextTarget.push({x: x_coor, y: y_coor})
    }
}

function fillArray(player, columns) {
    player.setBoardColumns(10);
    generateRow(columns, columns, player);

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
                setHit(boolVal) {
                    this.hit = boolVal;
                }
            }
            player.boardArray.push(area);
        }
        generateRow(column, count - 1, player)
    }
}


const horizOrVert = (player, x_coor, y_coor) => {
   // console.log('HorizORVert x = ' + x_coor + "; y = " + y_coor)
    //if y coordinates are the same, it's horizontal
    if (memory.previousTarget.y === y_coor) {
        memory.isHoriz = true;
        //go right 
        if (x_coor > memory.previousTarget.x) {
            //check to see if the next targeted square is valid for an attack 
            if (x_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
                    memory.nextTarget.push({ x: x_coor + 1, y: y_coor, isHoriz: true })

                }
            }
            addOtherEnd(player, memory.previousTarget.x - 1, memory.previousTarget.y, true, false); 
        }
        //go left
        else if (x_coor < memory.previousTarget.x) {
            if (x_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked(x_coor - 1, y_coor)) {
                    memory.nextTarget.push({ x: x_coor - 1, y: y_coor, isHoriz: true })
                    addOtherEnd()
                }
            }
            addOtherEnd(player, memory.previousTarget.x + 1, memory.previousTarget.y, true, true)
        }
    }
    //if x coordinates are the same, it's vertical 
    else if (memory.previousTarget.x === x_coor) {
        memory.isHoriz = false;
        //Go down
        if (y_coor < memory.previousTarget.y) {
            //check to see if the next targeted square is valid for an attack 
            if (y_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked(x_coor, y_coor - 1)) {
                    memory.nextTarget.push({ x: x_coor, y: y_coor - 1, isHoriz: false })
    
                }
            }
            addOtherEnd(player, memory.previousTarget.x, memory.previousTarget.y + 1, false, true)
        }
        //go up
        else if (y_coor > memory.previousTarget.y) {
            if (y_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked(x_coor, y_coor + 1)) {
                    memory.nextTarget.push({ x: x_coor, y: y_coor + 1, isHoriz: false })
                }
            }
            addOtherEnd(player, memory.previousTarget.x, memory.previousTarget.y - 1, false, false)
        }
    }

    memory.nextTarget.forEach((item, index, object) => {
        if (memory.isHoriz !== item.isHoriz) {
            memory.nextSecondaryTarget.push(object.splice(index, 1));
        }
    })
    
}

const addOtherEnd = (player, x_coor, y_coor, isHorizontal, isClimbing) => {
    //end conditions:
    //It comes upon a square that has not been attacked
    //it comes upon the edge of the map 
    var moveX = 0;
    var moveY = 0;
    if (isHorizontal && isClimbing && x_coor <= 10) {
        moveX = 1;
    }
    else if (isHorizontal && !isClimbing && x_coor > 0) {
        moveX = -1;
    }
    else if (!isHorizontal && isClimbing && y_coor <= 10) {
        moveY = 1;
    }
    else if (!isHorizontal && !isClimbing && y_coor > 0) {
        moveY = -1;
    }

    for (var i = 0; i < player.boardArray.length; i++) {
        if (player.boardArray[i].x === x_coor && player.boardArray[i].y === y_coor) {
            if (player.boardArray[i].hit && player.boardArray[i].occupied) {
                console.log("Add Other End Recursion: " + x_coor + moveX + "," + y_coor + moveY)
                addOtherEnd(x_coor + moveX, y_coor + moveY, isHorizontal, isClimbing)
            }
            else if (player.boardArray[i].hit && !player.boardArray[i].occupied) {
                //do nothing
            }
            else {
                memory.nextTarget.push({ x: x_coor, y: y_coor, isHoriz: isHorizontal })
                console.log("addOtherEnd: " + x_coor + "," + y_coor)
            }
        }
    }
}

const confirmShipExistence = (player, x_coor, y_coor, length, isHoriz, arr) => {
    if (length != 0) {
        for (var i = 0; i < player.boardArray.length; i++) {
            if (player.boardArray[i].x === x_coor && player.boardArray[i].y === y_coor) {
                if (player.boardArray[i].occupied)
                    arr.push({ x: x_coor, y: y_coor });
            }
        }
        if (isHoriz) {

            confirmShipExistence(player, x_coor + 1, y_coor, length - 1, isHoriz, arr)

        }
        else
            confirmShipExistence(player, x_coor, y_coor - 1, length - 1, isHoriz, arr)
    }
    else {
  //      console.log(arr)
    }
}

test('Test horizontal placement on carrier at {2, 8}', () => {
    const player = createPlayer(); 
    fillArray(player, 10);
    player.placeShip(2, 8, 5, true, 'carrier'); 
    var confirmShip = []
    confirmShipExistence(player, 2, 8, 5, true, confirmShip)
   // console.log(player.boardColumns);
    const expectedArray = [{ x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }]
    expect(confirmShip).toEqual(expect.arrayContaining(expectedArray))
})

test('Test vertical placement on carrier at {2, 8}', () => {
    const player = createPlayer();
    fillArray(player, 10);
    player.placeShip(2, 8, 5, false, 'carrier');
    var confirmShip = []
    confirmShipExistence(player, 2, 8, 5, false, confirmShip)
    const expectedArray = [{ x: 2, y: 8 }, { x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 }]
    expect(confirmShip).toEqual(expect.arrayContaining(expectedArray))
})



test('Test vertical placement on carrier at {2, 8}', () => {
    const player = createPlayer();
    fillArray(player, 10);
    player.placeShip(2, 8, 5, false, 'carrier');
    player.placeShip(2, 7, 4, true, 'battleship');
    player.placeShip(1, 10, 3, true, 'destroyer');
    player.placeShip(1, 1, 2, true, 'patrol');

    var confirmShip = []
    confirmShipExistence(player, 2, 8, 5, false, confirmShip)
    const expectedArray = [{ x: 2, y: 8 }, { x: 2, y: 7 }, { x: 2, y: 6 }, { x: 2, y: 5 }, { x: 2, y: 4 }]
    expect(confirmShip).toEqual(expect.arrayContaining(expectedArray))
})

const decideTarget = () => {
    //If the AI has currently identified the general location of the ship and is attacking it
    if (memory.nextTarget.length !== 0) {
        const nextArea = memory.nextTarget[genRandom(memory.nextTarget.length) - 1];
        //   console.log("Current target: ");
        //   console.log(nextArea);
        return nextArea;
    }
    //If AI doesn't have any clues of the location of the opponent's ships 
    else {
        if (memory.nextSecondaryTarget.length != 0) {
            const nextArea = memory.nextTarget[genRandom(memory.nextSecondaryTarget.length) - 1];
            return nextArea;
        }
        else 
             return generateCoordinates(10);
    }
}

test('Test if  genRandom', () => {
    memory.fillTarget(3, 2)
    expect(decideTarget()).toStrictEqual({x: 3, y: 2})
})

test('See if decideTarget works ', () => {
    const player = createPlayer();
    fillArray(player, 10);
    player.placeShip(2, 8, 5, false, 'carrier');
    player.placeShip(3, 7, 4, false, 'battleship');
    player.placeShip(4, 8, 3, false, 'destroyer');
})