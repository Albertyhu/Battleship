
const memory = {
    self: null,
    opponent: null,
    opponent_columns: 0,
    nextTarget: [] 
}


export const setSelf = (player) => {
    memory.self = player;
}

export const setOpponent = (player) => {
    memory.opponent = player;
    memory.opponent_columns = player.getBoardColumns();
}


const oldhitOpponentArea = (player, x, y) => {
    var message = ''; 
    for (var i = 0; i < player.boardArray.length; i++) {

        if (player.boardArray[i].x === x && player.boardArray[i].y === y) {
            var isOccupied = player.boardArray[i].occupied; 
            if (!player.boardArray[i].hit) {
                
                //  const areaID = player.name + "-" + x + "," + y;
            //    i = player.boardArray.length;
                // player.boardArray[i].setHit(true);
               //  console.log(player.boardArray[i].hit)

                if (isOccupied) {
                    message = 'Ship hit';
                }
                else {
                    // hitEmpty(targetSquare);
                    message = 'Empty Area hit';
                }
                player.boardArray[i].hit = true; 
            }
            else {
             //   i = player.boardArray.length;
                message = "Area has already been hit";

            }

        }
        else {

        }
    }

    return message; 
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
                setHit(boolVal) {
                    this.hit = boolVal;
                }
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
    expect(oldhitOpponentArea(player, 3, 2)).toBe("Ship hit")
})


test('Missed target', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    expect(oldhitOpponentArea(player, 4, 4)).toBe("Empty Area hit")
})


const hasAlreadyBeenAttacked = (player, x, y) => {

    for (var i = 0; i < player.boardArray.length; i++) {
        if (player.boardArray[i].x === x && player.boardArray[i].y === y) {
           // console.log(player.boardArray[i])
            if (player.boardArray[i].hit) {
                return true;
            }
            else {
                return false;
            }
            i = player.boardArray.length;
        }
    }
}
    
test('Confirm if area has already been attacked', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)
    expect(hasAlreadyBeenAttacked(player, 3, 2)).toBe(true); 
})

test('Confirm if area has not been attacked', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)

    expect(hasAlreadyBeenAttacked(player, 3, 5)).toBe(false);
})

const chooseValidPotentialTarget = (player, x_coor, y_coor) => {
    const nextTarget = []; 
    if (x_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(player, x_coor + 1, y_coor)) {
            const target = { x: x_coor + 1, y: y_coor }
            nextTarget.push(target);
        }
    }
    if (x_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(player, x_coor - 1, y_coor)) {
            const target = { x: x_coor - 1, y: y_coor }
            nextTarget.push(target);
        }
    }
    if (y_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(player, x_coor, y_coor + 1)) {
            const target = { x: x_coor, y: y_coor + 1 }
            nextTarget.push(target);
        }
    }
    if (y_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(player, x_coor, y_coor - 1)) {
            const target = { x: x_coor, y: y_coor - 1 }
            nextTarget.push(target);
        }
    }
    return nextTarget;
}

test('Target area: {3,2}. Array should contain', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)
    const expectedArray = [{ x: 4, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 3 }]; 
    expect(chooseValidPotentialTarget(player, 3,2)).toEqual(expect.arrayContaining(expectedArray));
})


test('Target area: {3,3}. Array should contain', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)
    //    console.log(player.boardArray)
    const expectedArray = [{ x: 4, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 4 }];
    expect(chooseValidPotentialTarget(player, 3, 3)).toEqual(expect.arrayContaining(expectedArray));
})

    test('Target area: {3,3}. Array should not contain {3,2}', () => {
        const player = createPlayer('testPlayer', false);
        fillArray(player)
        player.placeShips(3, 1);
        player.placeShips(3, 2);
        player.placeShips(3, 3);
        oldhitOpponentArea(player, 3, 2)
        //    console.log(player.boardArray)
        const expectedArray = [{ x: 4, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 2 }];
        expect(chooseValidPotentialTarget(player, 3, 3)).toEqual(expect.not.arrayContaining(expectedArray));
    })

test('Target area: {3,1}. Array should not contain {3,0}', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)
    //    console.log(player.boardArray)
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }];
    expect(chooseValidPotentialTarget(player, 3, 1)).toEqual(expect.not.arrayContaining(expectedArray));
})

test('Target area: {3,1}. Array should contain { x: 4, y: 1 }, { x: 2, y: 1 }', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    oldhitOpponentArea(player, 3, 2)
    //    console.log(player.boardArray)
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }];
    expect(chooseValidPotentialTarget(player, 3, 1)).toEqual(expect.arrayContaining(expectedArray));
})


const clearItem = (targetArr, x, y) => {
    targetArr.forEach((item, index, object) => {
        if (item.x === x && item.y === y) {
            object.splice(index, 1);
        }
    })
}


test('Remove element from array [{ x: 4, y: 1 }, { x: 2, y: 1 }]', () => {
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }];
    clearItem(expectedArray, 4, 1)
    expect(expectedArray).toEqual([{ x: 2, y: 1 }]); 
})

test('Remove element from array [{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }]', () => {
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }];
    clearItem(expectedArray, 3, 0)
    expect(expectedArray).toEqual([{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 2 }]);
})

test('Remove all elements from array [{ x: 4, y: 1 }, { x: 2, y: 1 }]', () => {
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }];
    clearItem(expectedArray, 4, 1)
    clearItem(expectedArray, 2, 1)
    expect(expectedArray.length).toEqual(0);
})

test('Remove all elements from array [{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }]', () => {
    const expectedArray = [{ x: 4, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }];
    clearItem(expectedArray, 4, 1)
    clearItem(expectedArray, 2, 1)
    clearItem(expectedArray, 3, 0)
    clearItem(expectedArray, 3, 2)
    expect(expectedArray.length).toEqual(0);
})


//After hitting a ship the 2nd, program should know what the orientation of the ship is. 
//Function compares the x and y coordinates in the parameters with the x and y coordinates stored in previousTarget
const horizOrVert = (player, previousTarget, x_coor, y_coor) => {
    //if y coordinates are the same, it's horizontal
    if (previousTarget.y === y_coor) {
       // memory.isHoriz = true;
        //go right 
        if (x_coor > previousTarget.x ) {
            //check to see if the next targeted square is valid for an attack 
            if (x_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked(player, x_coor + 1, y_coor)) {
                   return ({ x: x_coor + 1, y: y_coor })
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {

                }
            }
            else {

            }
        }
        //go left
        else if (x_coor < previousTarget.x ) {
            if (x_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked(player, x_coor - 1, y_coor)) {
                    return({ x: x_coor - 1, y: y_coor })
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {

                }
            }
            else {

            }
        }
    }
    //if x coordinates are the same, it's vertical 
    else if (previousTarget.x === x_coor) {
      //  memory.isHoriz = false;
        //Go down
        if (y_coor < previousTarget.y) {
            //check to see if the next targeted square is valid for an attack 
            if (y_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked(player, x_coor, y_coor - 1)) {
                    return({ x: x_coor, y: y_coor - 1 })
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {

                }
            }
            else {

            }
        }
        //go up
        else if (y_coor > previousTarget.y) {
            if (y_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked(player, x_coor, y_coor + 1)) {
                    return { x: x_coor, y: y_coor + 1 }; 
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {

                }
            }
            else {

            }
        }
    }

    /*
    memory.nextTarget.forEach((item, index, object) => {
        if (memory.isHoiz !== item.isHoriz) {
            object.splice(index, 1);
        }
    })
    */
}

/*
test('Find the next target after first hit {3, 1} and 2nd hit {3,2}', () => {

    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    const previousTarget = {
        x: 3, 
        y: 1, 
    }
    expect(horizOrVert(player, previousTarget, 3, 2)).toStrictEqual({x: 3, y:3})

})

test('Find the next target after first hit {3, 3} and 2nd hit {3,2}', () => {

    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);
    const previousTarget = {
        x: 3,
        y: 3,
    }
    expect(horizOrVert(player, previousTarget, 3, 2)).toStrictEqual({ x: 3, y: 1 })

})

test('Find the next target after first hit {6, 4} and 2nd hit {7, 4}', () => {

    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(5, 4);
    player.placeShips(6, 4);
    player.placeShips(7, 4);
    const previousTarget = {
        x: 6,
        y: 4,
    }
    expect(horizOrVert(player, previousTarget, 7, 4)).toStrictEqual({ x: 8, y: 4 })

})

test('Find the next target after first hit {7, 4} and 2nd hit {6, 4}', () => {

    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(5, 4);
    player.placeShips(6, 4);
    player.placeShips(7, 4);
    const previousTarget = {
        x: 7,
        y: 4,
    }
    expect(horizOrVert(player, previousTarget, 6, 4)).toStrictEqual({ x: 5, y: 4 })

})*/

export const isAreaSecure = (sunkShip, hitCounts, currentTarget, isHoriz, previousTarget ) => {
    if (sunkShip.length !== hitCounts) {
        //if the attack pattern was horizontal
        var x_coor = currentTarget.x;
        var y_coor = currentTarget.y;
        if (isHoriz) {
            //if the computer's target was moving right, change the direction of the attack to the left
            if (currentTarget.x > previousTarget.x) {
                x_coor = currentTarget.x - (hitCounts - 1)
            }
            //vice versa 
            else if (currentTarget.x < previousTarget.x) {
                x_coor = currentTarget.x + (hitCounts - 1)
            }
        }
        //if the attack pattern was vertical 
        else {
            //if the computer's target was moving upward, change the direction of the attack downward
            if (currentTarget.y > previousTarget.y) {
                y_coor = currentTarget.y - (hitCounts - 1)
            }
            //vice versa 
            else if (currentTarget.y < previousTarget.y) {
                y_coor = currentTarget.y + (hitCounts - 1)
            }
        }
       // chooseValidPotentialTarget(x_coor, y_coor)
        return ({ x: x_coor, y: y_coor })

    }
    //resetHitCounts()
}


test('Test to see if function can detect other enemy ships nearby sunken ship', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(3, 1);
    player.placeShips(3, 2);
    player.placeShips(3, 3);

    player.placeShips(2, 4);
    player.placeShips(3, 4);
    player.placeShips(4, 4);
    player.placeShips(5, 4);
    const previousTarget = {
        x: 3,
        y: 2,
    }

    const destroyer = new Object(); 
    destroyer.isSunk = true; 
    destroyer.length = 3; 
    const hitCounts = 4; 
    const currentTarget = { x: 3, y: 1 }
    const isHoriz = false; 
    expect(isAreaSecure(destroyer, hitCounts, currentTarget, isHoriz, previousTarget)).toStrictEqual({x: 3 ,y: 4})
})


const attackTheOtherEnd = (currentTarget, previousTarget, hitCounts, isHoriz) => {
    //if the attack pattern was horizontal
    var x_coor = currentTarget.x;
    var y_coor = currentTarget.y;
    if (isHoriz) {
        //if the computer's target was moving right, change the direction of the attack to the left
        if (currentTarget.x > previousTarget.x) {
            x_coor = currentTarget.x - (hitCounts - 1)
        }
        //vice versa 
        else if (currentTarget.x < previousTarget.x) {
            x_coor = currentTarget.x + (hitCounts - 1)
        }
    }
    //if the attack pattern was vertical 
    else {
        //if the computer's target was moving upward, change the direction of the attack downward
        if (currentTarget.y > previousTarget.y) {
            y_coor = currentTarget.y - (hitCounts - 1)
        }
        //vice versa 
        else if (currentTarget.y < previousTarget.y) {
            y_coor = currentTarget.y + (hitCounts - 1)
        }
    }
    //empty nextTarget[]
    //clearNextTarget();
    //previousTarget = { x: x_coor, y: y_coor }
    //chooseValidPotentialTarget(x_coor, y_coor)
    //resetHitCounts();
    return { x: x_coor, y: y_coor }; 
}

test('See if the computer chooses the other end of the ship to be {5, 4}', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(5, 4);
    player.placeShips(6, 4);
    player.placeShips(7, 4);
    player.placeShips(8, 4);
    player.placeShips(9, 4);
    const previousTarget = {
        x: 6,
        y: 4,
    }
    const currentTarget = {
        x: 7,
        y: 4,
    }
    const hitCounts= 3;
    expect(attackTheOtherEnd(currentTarget, previousTarget, hitCounts, true)).toStrictEqual({ x: 5, y: 4})
})


test('See if the computer chooses the other end of the ship to be {5, 4}', () => {
    const player = createPlayer('testPlayer', false);
    fillArray(player)
    player.placeShips(5, 4);
    player.placeShips(6, 4);
    player.placeShips(7, 4);
    player.placeShips(8, 4);
    player.placeShips(9, 4);
    const previousTarget = {
        x: 6,
        y: 4,
    }
    const currentTarget = {
        x: 7,
        y: 4,
    }
    const hitCounts = 3;
    expect(attackTheOtherEnd(currentTarget, previousTarget, hitCounts, true)).toStrictEqual({ x: 5, y: 4 })
})