
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
    return validPlacement;

}