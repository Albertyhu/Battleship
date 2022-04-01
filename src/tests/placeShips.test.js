import { isItOccuppied } from '../placeShips.js'
import { createPlayer } from '../player.js'; 
//import { generateGrid } from '../grid.js';

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

function placeCarrier(player, coordinate, length, horizontal) {
    const x = coordinate.x;
    const y = coordinate.y; 
    if (horizontal) {
        for (var i = 0; i < length; i++) {
            player.boardArray.forEach(item => {
                if (item.x === x + i && item.y === y) {
                    item.occupied = true;
                 //   console.log("fired: (" + item.x  + "," + item.y + ")")
                }
            })
        }
    }
    else {
        for (var i = 0; i < length; i++) {
            player.boardArray.forEach(item => {
                if (item.x === x && item.y === (y -1)) {
                    item.occupied = true;
                  //  console.log("fired: (" + item.x + "," + item.y + ")")
                }
            })
        }
    }
}

test("Test for empty area", () => {
    const testPlayer = createPlayer('test'); 
    const playerOneArea = fillArray(testPlayer)
    expect(isItOccuppied(testPlayer, { x: 3, y: 4 }, 3, true)).toBe(false); 
})


test.only("Test for occuppied area", () => {
    const testPlayer = createPlayer('test');
    const playerOneArea = fillArray(testPlayer)
    placeCarrier(testPlayer, {x:3,y:4}, 5, true)
    expect(isItOccuppied(testPlayer, { x: 3, y: 4 }, 5, true)).toBe(true);
})