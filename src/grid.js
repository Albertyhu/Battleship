//Generate grid for each player
//Grid keeps track of whether the player's ship are all sunk or not. 
//Each square unit is rendered by a div.  
//Each square is identified by a dynamically generated ID
//Use an array to keep track of all the square units? It would be an array of arrays 
//A master array consist of arrays of rows
//Each of the child array represents a row and consists of individual units of a column 
//Each square unit is an object 
//contains x,y coordinates 
//Has a boolean value of whether the area it represents have been hit for not. 

//Non-hit squares are considered empty 

import { isShipSunk } from './ship.js'; 
import { checkShips } from './winCondition.js';
import { isAreaSecure } from './computerAI.js'; 

export const squareUnit = {
    unit: document.createElement('div'), 
    hit: false, 
    isEmpty: true,
   
}

export const generateGrid = (columns, player) => {
    var newgrid = document.createElement('div')
    player.setBoardColumns(columns);
    newgrid.setAttribute('class', 'grid')
    if (columns < 10) {
        columns = 10; 
    }
    generateRow(newgrid, columns, columns, player); 
    return newgrid; 
}

//This function not only generates the rows of the grid, 
//but is also responsible for generating the squares for holding important information such as whether or not a square is empty 
export const generateRow = (targetGrid, column, count, player) => {
    if (count > 0) {
        const row = document.createElement('div'); 
        row.setAttribute('class', 'row');
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
            row.appendChild(generateSquare(player, player.boardArray[player.boardArray.length - 1], coordinate.toString()));
        }
        row.setAttribute('class', 'row'); 
        targetGrid.appendChild(row);
        generateRow(targetGrid, column, count - 1, player)
        
    }
   
}

export const generateSquare = (player, area, ID) => {
    const square = document.createElement('div'); 
    square.setAttribute('class', 'emptySquare'); 
    square.setAttribute('id', player.name + "-" + ID); 

    //to show the coordinates on render
    
    const display = document.createElement('p');
    display.style.margin = 'auto'; 
    display.innerHTML = ID; 
    square.appendChild(display)
    
    square.addEventListener('click', () => {
        //turnTracker keeps track of the player's turn everytime they attempt to hit each other's ships
        //If the player hits one of the opponent's ship, he gets another turn.
        if (!area.hit && player.turnBoolID !== player.turnTracker.getTurnStatus() && !player.gameObject.over && !player.isAI) {
            area.hit = true;
            if (area.occupied) {
                hitOccupied(player, square, area.x, area.y);
            }
            else {
                hitEmpty(square);
                player.turnTracker.toggleTurn(); 
            }
        }
    })
  
    return square; 
}

export const hitEmpty = (square) => {
    square.classList.toggle('hitEmptySquare');
    if (square.childNodes.length === 0) {
        const dot = document.createElement('div');
        dot.setAttribute('class', 'dot')
        square.appendChild(dot);
    } 
}

export const hitOccupied = (player, square, x_coor, y_coor) => {
    square.classList.remove('occupiedSquare');
    square.classList.add('hitOccupiedSquare');
    if (square.childNodes.length === 0) {
        const dot = document.createElement('div');
        dot.setAttribute('class', 'dot')
        square.appendChild(dot);
    }
 
    var targeted_ship = null; 
    player.shipArray.forEach(ship => {
        ship.posArray.forEach(pos => {
            if (pos.x === x_coor && pos.y === y_coor) {
                pos.isHit = true; 
                ship.isSunk = isShipSunk(player, ship); 
                //if the player is playing against the AI, this notifies the AI of important info
                //...about ship and the coordinates of the confirmed damage location 
                if (player.isPlayingAgainstAI && ship.isSunk) {
                    isAreaSecure(ship, x_coor, y_coor)
                }
            }
        })
    })
    checkShips(player)
}

