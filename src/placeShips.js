//import {createShip, createCarrier, createBattleship, createDestroyer, createSubmarine, createPatrol } from './ship.js'; 
import { createShip } from './ship.js'; 
import { genRandom } from './randGen.js'; 
//This should identify which grid to place the ships in
//It should randomize the placement.
//it should recognize the edges of the gird and know not to place ships that goes beyond the edge 
//it should know not to overlap the ships 

//Function
//Determine what ship it will create
//Identify the length of the ship 
//Loop: 
//Generate random numbers for x and y coordinates 
//Determine if the coordinates are right based on the following criteria
//1.) The ship does not go out of bounds of the grid 
//2.) The does not overlap with another ship 
//Break the loop when the ship appropriately placed 

//How does the game identify the ownership of the ship?


export const placeAllShips = (player, gridLength) => {
    placeShip(player, 'carrier', 5, gridLength)
    placeShip(player, 'battleship', 4, gridLength)
    placeShip(player, 'destroyer', 3, gridLength)
    placeShip(player, 'submarine', 3, gridLength)
    placeShip(player, 'patrol boat1', 2, gridLength)
    placeShip(player, 'patrol boat2', 2, gridLength)
}

//places the players ship
//There should be a separate function that places the computer's ship. 
//gridLength is the number of columns on the player's board 
export const placeShip = (player, shipType, length, gridLength) => {
    //positioned will turn true if the app finds a suitable area to place the ship on the board 
    var positioned = false; 

    //create a new ship object 
    const ship = createShip(length, shipType); 

    //Run the the loop until the app finds a suitable position to place the ship on the player's board 
    while (!positioned) {
        var coordinate = generateCoordinates(gridLength);
        
        //If 1, programs tries to see if ship can be placed horizontally first, then vertically
        //If 2, programs tries to see if ship can be placed vertically first, then horizontally
        var orientation = genRandom(2);
     
        if (orientation === 1) {
            console.log("Ship for placement: " + shipType + "; first-attempt: horizontal ")
            positioned = horizThenVert(player, coordinate, ship, length, gridLength) 
        }
        else if (orientation === 2) {
            console.log("Ship for placement: " + shipType + "; first attempt: vertical")
            positioned = vertThenHoriz(player, coordinate, ship, length, gridLength) 
        }
        if (!positioned) {
            console.log('Rerun loop for ' + shipType);
        }
  
    }
} 

const horizThenVert = (player, coordinate, ship, length, gridLength) => {
    //if the ship can be placed horizontally without going out of bounds. 
    var validPlacement = false; 
    if (coordinate.x + length <= gridLength) {
        if (!isItOccuppied(player, coordinate, length, true)) {
            //code for placing ship 
            //function has to keep track of the coordinates of the ship
            //This is to provide information for a function that keeps track of whether a ship is sunk or not 
            for (var i = 0; i < length; i++) {
                player.boardArray.forEach(item => {
                    if (item.x === (coordinate.x + i) && item.y === coordinate.y && item.occupied === false) {
                        placeShipPart(player, item, ship, length)
                    }
                })
            }
            //keep track of the ship once it's placed
            player.shipArray.push(ship)
            validPlacement = true;
        }
        else {
            validPlacement = false;
        }
    }
    //if placing ship horizontally makes it out of bounds, try placing it vertically
    else {
        if (coordinate.y - length >= 0) {
            if (!isItOccuppied(player, coordinate, length, false)) {
                for (var i = 0; i < length; i++) {
                    player.boardArray.forEach(item => {
                        if (item.x === coordinate.x && item.y === (coordinate.y - i) && item.occupied === false) {
                            placeShipPart(player, item, ship, length)
                        }
                    })
                }
                //keep track of the ship once it's placed 
                player.shipArray.push(ship)
                validPlacement = true;
            }
            else {
                validPlacement = false;
            }
        }
        //if the ship can't be place horizontally or vertically, rerun loop; 
        else
            validPlacement = false;
    }
    return validPlacement; 
}

const vertThenHoriz = (player, coordinate, ship, length, gridLength) => {
    var validPlacement = false; 
    if (coordinate.y - length >= 0) {
        if (!isItOccuppied(player, coordinate, length, false)) {
            for (var i = 0; i < length; i++) {
                player.boardArray.forEach(item => {
                    if (item.x === coordinate.x && item.y === (coordinate.y - i) && item.occupied === false) {
                        placeShipPart(player, item, ship, length)
                    }
                })
            }
            //keep track of the ship once it's placed
            player.shipArray.push(ship)
            validPlacement = true;
        }
        else {
            validPlacement = false;
        }
    }
    else {
        if (coordinate.x + length <= gridLength) {
            if (!isItOccuppied(player, coordinate, length, true)) {
                for (var i = 0; i < length; i++) {
                    player.boardArray.forEach(item => {
                        if (item.x === (coordinate.x + i) && item.y === coordinate.y && item.occupied === false) {
                            placeShipPart(player, item, ship, length)
                        }
                    })
                }
                //keep track of the ship once it's placed
                player.shipArray.push(ship)
                validPlacement = true;
            }
        }
        else {
            validPlacement = false;
        }
    }
    return validPlacement; 

}

const placeShipPart = (player, item, ship, length) => {
    const dom_coordinates = player.name + '-' + item.x + ',' + item.y;
    const square = document.getElementById(dom_coordinates)
    document.getElementById(dom_coordinates).classList.remove('emptySquare')
    document.getElementById(dom_coordinates).classList.add('occupiedSquare')
    const ship_type = document.createElement('p')
    ship_type.innerHTML = length; 
    square.append(ship_type);
    item.occupied = true;
    ship.setPos(item.x, item.y);
}

//this can be reused to determine if hit area is occupied or not 
export const isItOccuppied = (player, coordinate, length, horizontal) => {
   // console.log('x = ' + coordinate.x)
   // console.log('y = ' + coordinate.y)
    var isOccupied = false; 
    if (horizontal) {
        for (var i = 0; i < length; i++) {
            player.boardArray.forEach(item => {
                if (item.x === (coordinate.x + i) && item.y === coordinate.y) {
                    /*console.log("player's coordinates (" + item.x + "," + item.y + "): " + item.occupied + "\n" +
                        "tested coordinates (" + (coordinate.x + i) + "," + coordinate.y + ")"
                    )*/
                    if (item.occupied) {
                        // console.log("horizontal: " + item.occupied)
                        isOccupied = true;
                        i = length;

                    }
                    //I had to add the following block of code later as an extra measure to check for occupied areas 
                    else {
                        player.shipArray.forEach(ship => {
                            ship.posArray.forEach(pos => {
                                if (pos.x === (coordinate.x + i) && pos.y === coordinate.y) {
                                    isOccupied = true; 
                                    i = length; 
                                }
                            })
                        })
                    }
                }
            })
        }
    }
    else {
        //if ship were to be placed vertically
        for (var i = 0; i < length; i++) {
            player.boardArray.forEach(item => {
                /*
                console.log("(" + item.x + "," + item.y + "): " + item.occupied + "\n" + 
                    "tested coordinates (" + coordinate.x + "," + (coordinate.y - i) + ")")
                   */
                if (item.x === coordinate.x && item.y === (coordinate.y - i)) {
                    if (item.occupied) {
                      // console.log("vertical: " + item.occupied)
                        isOccupied = true;
                        i = length;  
                    }
                    //I had to add the following block of code later as an extra measure to check for occupied areas 
                    else {
                        player.shipArray.forEach(ship => {
                            ship.posArray.forEach(pos => {
                                if (pos.x === coordinate.x && pos.y === (coordinate.y - i)) {
                                    isOccupied = true;
                                    i = length;
                                }
                            })
                        })
                    }
                }
            })
        }
    }
    const message = '(' + coordinate.x + "," + coordinate.y + ") " + isOccupied + "; horizontal: " + horizontal + "; Length: " + length; 
    player.messages.push(message);
    return isOccupied;
}

export const generateCoordinates = columns => {
    const x = genRandom(columns);
    const y = genRandom(columns); 
    return {x,y}
} 