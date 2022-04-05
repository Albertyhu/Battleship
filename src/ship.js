//Grid should keep track of the coordinates of each boat
//Option: Keep track of the coordinates of the ship's front area then determine whether the ship is placed vertically or horizontally
//Option 2: Keep track of the coordinates of all the ships units

/*
export const ship = {
    length: 0,
    isSunk: false, 
    posArray: [], 
    type: '', 
    setPos(x_coor, y_coor) {
        this.posArray.push({x: x_coor, y: y_coor})
    }, 
}
*/
//This method doesn't work because for some reason, each ship was recording every ships positions. 
//A revised version is written below.

export const createShip = (length, type) => {
    const newShip = new Object(); 
    newShip.length = length; 
    newShip.type = type; 
    newShip.isSunk = false;
    newShip.posArray = [];
    newShip.setPos = (x_coor, y_coor) =>{
        newShip.posArray.push({ x: x_coor, y: y_coor, isHit: false })
    }
    return newShip;
}

export const isShipSunk = (player, ship) => {
    var isSunk = true;
    ship.posArray.forEach(pos => {
        //if at least one part of the ship is not hit, isSunk is false; 
        if (!pos.isHit) {
            isSunk = false;
        }
    })
    if (isSunk) {
        const announcement = document.getElementById('announcement');
        const message = player.name + "'s " + ship.type + " has been sunk!"; 
        announcement.innerHTML = message; 
    }
  
    return isSunk;
}