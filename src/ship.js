//Grid should keep track of the coordinates of each boat
//Option: Keep track of the coordinates of the ship's front area then determine whether the ship is placed vertically or horizontally
//Option 2: Keep track of the coordinates of all the ships units

export const ship = {
    length: 0,
    isSunk: false, 
    x: 0,
    y: 0,
    getX() {
        return this.x; 
    },
    getY() {
        return this.y; 
    },
    setPos(x, y) {
        this.x = x; 
        this.y = y; 
    }
}

export const createShip = (length, position) => {
    let ship = Object.create(ship);
    ship.length = length; 
    return ship;
}

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