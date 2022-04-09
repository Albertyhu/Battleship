import { genRandom } from './randGen.js'; 
import { generateCoordinates } from './placeShips'; 
import { hitEmpty, hitOccupied } from './grid.js';
import { isUndefined } from 'lodash';

//It only needs to keep track of the opponent's ships and board 
//randomly picks coordinates. 
//Need to recognize not to pick hit areas
//When it does hit the opponent's ship, it needs to hit the adjacent areas. 
//Needs to know when it's turn comes up
//Needs to know when the game is over. 

//turn is false when it's the AI's turn 

const memory = {
    nextTarget: [], 
    hitTarget: [],

    //keeps track of previous target; 
    previousTarget: {}, 

    //keeps track of the current target 
    currentTarget: null, 

    //Keeps track of whether or not enemy ships orientation have been identified 
    identifiedOrientation: false, 
    //This keeps track of the orientation of the ship it's attacking. 
    isHoriz: true, 
    consecutiveHit: false, 
    //number of times an attack hits its target
    // it resets to 0 if an attempt missed its target
    hitCounts: 0, 
    opponent: null, 
    shipLocated: false, 
    confirmedHits: [], 
    enemyShips: [], 
}

export const getOpponent = opponent => {
    memory.opponent = opponent; 
}

export const getOpponentShips = () => {
    memory.opponent.shipArray.forEach(ship => {
        memory.enemyShips.push(ship); 
    })
}

const resetHitCounts = () => {
    memory.hitCounts = 0;
}

const incrementHitCount = () => {
    memory.hitCounts += 1; 
}

export const runAI = (player) => {
    if(!player.turnTracker.getTurnStatus()) {
        hitOpponentArea(player);
    }
  
}
//needs to know the player's board 
//needs to avoid hit areas 
//The function needs to pay special attention to when ships are not sunk yet. 
export const hitOpponentArea = (player) => {
    var attackArea = false;
    while (!attackArea) {
        var coordinates = decideTarget(player);      
        for (var i = 0; i < memory.opponent.boardArray.length; i++) {
            if (coordinates.x === memory.opponent.boardArray[i].x && coordinates.y === memory.opponent.boardArray[i].y) {
              //  console.log("coordinates.x = " + coordinates.x)
              //  console.log("coordinates.y = " + coordinates.y)
                if (!memory.opponent.boardArray[i].hit) {
                    //record the coordinate of the current area the AI is attacking 
                    memory.currentTarget = { x: coordinates.x, y: coordinates.y }; 
                    //if area does contain the enemy ship 
                    const square = getSquare(memory.opponent.name, coordinates.x, coordinates.y)
                    if (memory.opponent.boardArray[i].occupied) {
                        incrementHitCount(); 
                        attackArea = true;
                        console.log("confirmed hit: " + coordinates.x + "," + coordinates.y)
                     //   clearNextTarget();
                        memory.confirmedHits.push({x: coordinates.x, y: coordinates.y})

                        //enemy ship was hit for the first time, record the location 
                        //orientation of ship is not known yet 
                        //this part is problematic 
                        if (memory.nextTarget.length !==0 && memory.nextTarget.length !== undefined) {
                            horizOrVert(coordinates.x, coordinates.y)
                        }
                        else {
                            //Enter coordinates of adjacent squares into nextTarget[] 
                            chooseValidPotentialTarget(coordinates.x, coordinates.y);
                        }

                        hitOccupied(memory.opponent, square, coordinates.x, coordinates.y); 
                        //this line is placed here for testing

                        memory.previousTarget = { x: coordinates.x, y: coordinates.y }; 
                        memory.identifiedOrientation = true; 
                        memory.consecutiveHit = true; 
                        player.turnTracker.toggleTurn();
                       
                        console.log(memory.nextTarget);
                    }
                    else {
                        hitEmpty(square); 

                        //this part is problematic
                        clearItem(coordinates.x, coordinates.y);
                        console.log("Missed: " + coordinates.x + "," + coordinates.y)
                        console.log(memory.nextTarget);
                        memory.identifiedOrientation = false; 
                        player.turnTracker.toggleTurn(); 
                        attackArea = true; 
                    }
                    memory.opponent.boardArray[i].hit = true;

                }
                //if the area has already been hit. 
                else {
                    attackArea = false; 
                }
            }
        }
    }
}


//original hitOpponentArea function for testing purposes 
/*
export const hitOpponentArea = (player) => {
    var attackArea = false;
    while (!attackArea) {
        var coordinates = generateCoordinates(10);
        for (var i = 0; i < memory.opponent.boardArray.length; i++) {
            if (coordinates.x === memory.opponent.boardArray[i].x && coordinates.y === memory.opponent.boardArray[i].y) {
                if (!memory.opponent.boardArray[i].hit) {
                    memory.currentTarget = { x: coordinates.x, y: coordinates.y };
                    //if area does contain the enemy ship 
                    const square = getSquare(memory.opponent.name, coordinates.x, coordinates.y)
                    if (memory.opponent.boardArray[i].occupied) {
                        hitOccupied(memory.opponent, square, coordinates.x, coordinates.y);
                        memory.previousTarget = { x: coordinates.x, y: coordinates.y };
                        incrementHitCount();
                        attackArea = false;
                    }
                    else {
                        hitEmpty(square);
                        clearItem(coordinates.x, coordinates.y);
                        player.turnTracker.toggleTurn();
                        resetHitCounts();
                        attackArea = true;
                    }
                    memory.opponent.boardArray[i].hit = true;
                }
                //if the area has already been hit. 
                else {
                    attackArea = false;
                }
            }
        }
    }
}
*/


export const getSquare = (player, x, y) => {
    const squareID = player + "-" + x + "," + y;
    const square = document.getElementById(squareID);
    return square;
}

//Makes the AI smarter 
//Check to see if nextTarget[] is empty. 
//When AI hits a ship, it should search the adjacent areas, until it's confirmed that a ship is sunk  
//It decides to attack the top, bottom, left or right areas.
//It can't attack an area that has already been occupied. 
//Top area: x, y + 1
//bottom area: x, y -1 
//left area: x - 1, y
//right area: x + 1, y 
// It has to know if the area is out of bounds of the grid. 
//If the area it decide to attack doesn't meet the above conditions, in its next turn, it chooses the other end of the ship
//Solution: Track the hit areas in an array. The program must hit the areas around it. 
//Once every target area in that array has been hit and...
//If it receives the message that a ship is sunk, it goes back to randomly choosing tiles on the opponent's board 

//The AI must figure out what is the orientation of the ship. 

//If attacked ship has been hit more than 4 times and if the announcement says that the ship that has been sunk is anything other than a carrier, it must search  the top and bottom areas of either end of the ship.
//this function chooses and returns a coordinate to attack 
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
        return generateCoordinates(10); 
    }
}

//Function takes a look at the squares adjacent to the attacked square 
//and determines whether or not to put them in the next target list. 
const chooseValidPotentialTarget = (x_coor, y_coor) => {
    console.log("chooseValidPotentialTarget x = " + x_coor + "; y = " + y_coor )
    if (x_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
            const target = {x: x_coor + 1,y: y_coor, isHoriz: true }
            memory.nextTarget.push(target); 
        }
    }
    if (x_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(x_coor -1, y_coor)) {
            const target = { x: x_coor - 1, y: y_coor, isHoriz: true  }
            memory.nextTarget.push(target);
        }
    }
    if (y_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(x_coor, y_coor + 1)) {
            const target = { x: x_coor, y: y_coor + 1, isHoriz: false }
            memory.nextTarget.push(target);
        }
    }
    if (y_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(x_coor, y_coor - 1)) {
            const target = { x: x_coor, y: y_coor - 1, isHoriz: false}
            memory.nextTarget.push(target);
        }
    }
}

//clears the nextTarget array; 
const clearNextTarget = () => {
    for (var i = 0; i < memory.nextTarget.length; i++) {
        let discard = memory.nextTarget.pop();
    }
    memory.nextTarget = []; 
}

export const hasAlreadyBeenAttacked = (x, y) => {
    for(var i = 0; i< memory.opponent.boardArray.length; i++) {
        if (memory.opponent.boardArray[i].x === x && memory.opponent.boardArray[i].y === y) {
            if (memory.opponent.boardArray[i].hit) {
                return true;
            }
            else {
                return false; 
            }
            i = memory.opponent.boardArray.length; 
        }
    }
}

//After hitting a ship the 2nd, program should know what the orientation of the ship is. 
//Function compares the x and y coordinates in the parameters with the x and y coordinates stored in previousTarget
const horizOrVert = (x_coor, y_coor) => {
    console.log('HorizORVert x = ' + x_coor + "; y = " + y_coor)
    clearNextTarget();
    //if y coordinates are the same, it's horizontal
    if (memory.previousTarget.y === y_coor) {
        memory.isHoriz = true; 
        //go right 
        if (x_coor > memory.previousTarget.x ) {
            //check to see if the next targeted square is valid for an attack 
            if (x_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
                    memory.nextTarget.push({ x: x_coor + 1, y: y_coor, isHoriz: true })
                    addOtherEnd(memory.previousTarget.x - 1, memory.previousTarget.y, true, false )
                }
             //The next target is invalid.
            //Howver, if the current attack was not followed up by announcement of a sunk ship 
            //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {
                    attackTheOtherEnd(x_coor, y_coor)
                }
            }
            else {
                attackTheOtherEnd(x_coor, y_coor)
            }
        }
        //go left
        else if (x_coor < memory.previousTarget.x) {
            if (x_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked(x_coor - 1, y_coor)) {
                    memory.nextTarget.push({ x: x_coor - 1, y: y_coor, isHoriz: true })
                    addOtherEnd(memory.previousTarget.x + 1, memory.previousTarget.y, true, true)
                }
            //The next target is invalid.
            //Howver, if the current attack was not followed up by announcement of a sunk ship 
            //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {
                    attackTheOtherEnd(x_coor, y_coor)
                }
            }
            else {
                attackTheOtherEnd(x_coor, y_coor)
            }
        }
    }
    //if x coordinates are the same, it's vertical 
    else if (memory.previousTarget.x === x_coor) {
        memory.isHoriz = false;
        //Go down
        if (y_coor < memory.previousTarget.y ) {
            //check to see if the next targeted square is valid for an attack 
            if (y_coor - 1 > 0) {
                if (!hasAlreadyBeenAttacked( x_coor, y_coor - 1)) {
                    memory.nextTarget.push({ x: x_coor, y: y_coor - 1, isHoriz: false })
                    addOtherEnd(memory.previousTarget.x, memory.previousTarget.y + 1, false, true)
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {
                    attackTheOtherEnd(x_coor, y_coor)
                }
            }
            else {
                attackTheOtherEnd(x_coor, y_coor)
            }
        }
        //go up
        else if (y_coor > memory.previousTarget.y ) {
            if (y_coor + 1 <= 10) {
                if (!hasAlreadyBeenAttacked( x_coor, y_coor + 1)) {
                    memory.nextTarget.push({ x: x_coor, y: y_coor + 1, isHoriz: false })
                    addOtherEnd(memory.previousTarget.x, memory.previousTarget.y - 1, false, false)
                }
                //The next target is invalid.
                //Howver, if the current attack was not followed up by announcement of a sunk ship 
                //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
                else {
                    attackTheOtherEnd(x_coor, y_coor)
                }
            }
            else {
                attackTheOtherEnd(x_coor, y_coor)
            }
        }
    }
    
    memory.nextTarget.forEach((item, index, object) => {
        if (memory.isHoriz !== item.isHoriz) {
            object.splice(index, 1);
        }
    })
    
}



const clearItem = (x, y) => {
    memory.nextTarget.forEach((item, index, object) => {
        if (item.x === x && item.y === y) {
            object.splice(index, 1);
        }
    })
}

//function to determine if there are still any enemy boats around an area after a boat has been sunk
//When a sunken ship has been announced, the function finds out whether or not there is discripancy 
//...between the hitCounts and the sunken ship's hit points.
//If there is, pass the coordinates of the location of the sunken ship that was initially hit
//..to chooseValidPotentialTarget
//This function is responsible for adding any valid coordinates to be the next targets. 
export const isAreaSecure = (sunkShip, x_coor, y_coor) => {
    console.log("hitCounts = " + memory.hitCounts)
    console.log("ship length = " + sunkShip.length )
    memory.shipLocated = false; 
    if (sunkShip.length !== (memory.hitCounts)) {
        attackTheOtherEnd(x_coor, y_coor);
    }
    else {
        clearNextTarget()
        memory.previousTarget = null; 
    }
    resetHitCounts ()
}

/*
const attackTheOtherEnd = (x_coor, y_coor) => {
    //if the attack pattern was horizontal
    if (memory.isHoriz) {
        var newX = x_coor; 
        var newY = y_coor; 
        //if the computer's target was moving right, change the direction of the attack to the left
        if (x_coor > memory.previousTarget.x) {
            newX = x_coor - (memory.hitCounts)
            memory.previousTarget.x = newX + 1;
        }
        //vice versa 
        else if (x_coor < memory.previousTarget.x) {
            newX = x_coor + (memory.hitCounts)
            memory.previousTarget.x = newX- 1;
        }
    }
    //if the attack pattern was vertical 
    else {
        //if the computer's target was moving upward, change the direction of the attack downward
        if (y_coor > memory.previousTarget.y) {
            newY = y_coor - (memory.hitCounts)
            memory.previousTarget.y = newY + 1;
        }
        //vice versa 
        else if (y_coor < memory.previousTarget.y) {
            newY = y_coor + (memory.hitCounts)
            memory.previousTarget.y = newY - 1;
        }
    }
    //empty nextTarget[]

    //check to see if the other end is valid 
    var shouldAttackOtherEnd = false; 
    if (newX > 0 && newX <= memory.opponent.boardColumns && newY > 0 && newY <= memory.opponent.boardColumns) {
        for (var i = 0; i < memory.opponent.boardArray.length; i++) {
            if (memory.opponent.boardArray[i].x === newX && memory.opponent.boardArray[i].y === newY) {
                if (!memory.opponent.boardArray[i].hit) {
                    shouldAttackOtherEnd = true; 
            }
            }
        }
    }
    if (shouldAttackOtherEnd) {
        clearNextTarget();
        console.log("Attack the other end: " + newX + "," + newY)
        memory.nextTarget.push({ x: newX, y: newY })
        resetHitCounts();
    }
}*/


const attackTheOtherEnd = (x_coor, y_coor) => {
    //if the attack pattern was horizontal
    var newX = 0;
    var newY = 0;
    var foundConsecutive = false; 
    //horizontal orientation 
    var directionX = 0; 
    var directionY = 0 
    if (memory.previousTarget.y === y_coor && x_coor !== memory.previousTarget.x) {
        if (x_coor > memory.previousTarget.x) {
            directionX = -2; 
            
        }
        else if (x_coor < memory.previousTarget.x) {
            directionX = 2; 
        }
    }
    //if the attack pattern was vertical 
    else if (memory.previousTarget.x === x_coor && y_coor !== memory.previousTarget.y) {
        if (y_coor > memory.previousTarget.y) {
            directionY = -2; 
        }
        else if (x_coor < memory.previousTarget.x) {
            directionY = 2; 
        }
    }
    for (var i = 0; i < memory.confirmedHits.length; i++) {
        if (memory.confirmedHits[i].x === (x_coor + directionX) && memory.confirmedHits[i].y === (y_coor + directionY)){
            newX = x_coor + directionX;
            newY = y_coor + directionY;
            foundConsecutive = true;
            directionX /= 2; 
            directionY /= 2; 
        }
    }
    if (foundConsecutive) {
        var dontEndLoop = true; 
        var foundCons = false; 
        var count = 1; 
        var consecutiveX = 0;
        var consecutiveY = 0;
        while (dontEndLoop) {
            consecutiveX = newX + (directionX * count);
            consecutiveY = newY + (directionY * count);
            for (var i = 0; i < memory.confirmedHits.length; i++){
                if (memory.confirmedHits[i].x === consecutiveX && memory.confirmedHits[i].y === consecutiveY) {
                    count++;    
                    foundCons = true; 
                }
            }
            if (!foundCons) {
                dontEndLoop = false;
            }
            else {
                foundCons = false; 
            }
        }
     //   clearNextTarget(); 
        memory.nextTarget.push({ x: consecutiveX, y: consecutiveY })
        console.log("Attack the other end: " + consecutiveX + "," + consecutiveY)
    }
    else{
        //check to see if the other end is valid 
        console.log("Attack the other end: " + directionX + "," + directionY)
    }


}

const identifyOrientation = (x_coor, y_coor) => {
    for (var i = 0; i < memory.confirmedHits.length; i++) {
        if (memory.confirmedHits[i].x + 1 === x_coor && memory.confirmedHits[i].y === y_coor) {
            memory.nextTarget.push(({x: x_coor + 1, }))
        }
        else if (memory.confirmedHits[i].x - 1 === x_coor && memory.confirmedHits[i].y === y_coor) {
        }
        else if (memory.confirmedHits[i].y + 1 === y_coor && memory.confirmedHits[i].x === x_coor) {
        }
        else if (memory.confirmedHits[i].y + -1 === y_coor && memory.confirmedHits[i].x === x_coor) {
        }
        else {

        }
    }
}

const checkTheOtherEnd = (x_coor, y_coor) => {
    clearNextTarget(); 
    
}

const chooseTargetBasedOnOrientation = (x_coor, y_coor) => {
    //Every time an attack hits an enemy ship,
    //...check to see if it has been hit more than one time.
    //If so, identify the orientation of the ship and focus the attack on that ship
    for (var i = 0; i < enemyShips.length; i++) {
        for (var j = 0; j < enemyShips.posArray.length; j++) {
            if (enemyShips.posArray[j].x === x_coor && enemyShips.posArray[j].y) {
                var hitCount = 0; 
                for (var k = 0; k < enemyShips.posArray.length; k++) {
                    if (enemyShips.posArray[k].hit) {
                        hitCount++; 
                    }
                }

            }
        }
    }
}


const addOtherEnd = (x_coor, y_coor, isHorizontal, isClimbing) => {
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

    for (var i = 0; i < memory.opponent.boardArray.length; i++) {
        if (memory.opponent.boardArray[i].x === x_coor && memory.opponent.boardArray[i].y === y_coor) {
            if (memory.opponent.boardArray[i].hit && memory.opponent.boardArray[i].occupied) {
                console.log("Add Other End Recursion: " + x_coor + moveX + "," + y_coor + moveY)
                addOtherEnd(x_coor + moveX, y_coor + moveY, isHorizontal, isClimbing)
            }
            else if (memory.opponent.boardArray[i].hit && !memory.opponent.boardArray[i].occupied) {
                  //do nothing
            }
            else {
                memory.nextTarget.push({ x: x_coor, y: y_coor, isHoriz: isHorizontal })
                console.log("addOtherEnd: " + x_coor + "," + y_coor)  
            }
        }
    }
}