//Grid should keep track of the coordinates of each boat
//Option: Keep track of the coordinates of the ship's front area then determine whether the ship is placed vertically or horizontally
//Option 2: Keep track of the coordinates of all the ships units

export const ship = {
    length: 0,
    isSunk: false, 
    posArray: [], 
    type: '', 
    setPos(x_coor, y_coor) {
        this.posArray.push({x: x_coor, y: y_coor})
    }, 
}

//This method doesn't work because for some reason, each ship was recording every ships positions. 
//A revised version is written below.
/*
export const createShip = (length, type) => {
    const newShip = Object.create(ship);
    newShip.length = length; 
    newShip.type = type; 
    return newShip;
}*/

export const createShip = (length, type) => {
    const newShip = new Object(); 
    newShip.length = length; 
    newShip.type = type; 
    newShip.isSunk = false;
    newShip.posArray = [];
    newShip.setPos = (x_coor, y_coor) =>{
        newShip.posArray.push({ x: x_coor, y: y_coor })
    }
    return newShip;
}

/*
export const createCarrier = (position) => {
    return createShip(5, position); 
}

export const createBattleship = (position) => {
    return createShip(4, position);
}

export const createDestroyer = (position) => {
    return createShip(3, position);
}

export const createSubmarine = (position) => {
    return createShip(3, position); 
}

export const createPatrol = (position) => {
    return createShip(2, position); 
}
*/