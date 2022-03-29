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

export const grid = {
    element: document.createElement('div'),
    setGrid() {
        this.element.setAttribute('class', 'grid')
    }

}

//Non-hit squares are considered empty 
export const squareUnit = {
    unit: document.createElement('div'), 
    hit: false, 
    isEmpty: true,
   
}

export const generateGrid = (columns) => {
    var newgrid = Object.create(grid); 
    newgrid.setGrid(); 
    if (columns < 10) {
        columns = 10; 
    }
    generateRow(newgrid.element, columns, columns); 
    return newgrid.element; 
}

export const generateRow = (targetGrid, column, count) => {
    if (count > 0) {
        const row = document.createElement('div'); 
        row.setAttribute('class', 'row'); 
        for (var i = 1; i <= column; i++) {
            const newID = i + ',' + count; 
            row.appendChild(generateSquare(newID.toString()));
        }
        row.setAttribute('class', 'row'); 
        targetGrid.appendChild(row);
        generateRow(targetGrid, column, count - 1)
        
    }
   
}

export const generateSquare = (ID) => {
    const square = document.createElement('div'); 
    square.setAttribute('class', 'emptySquare'); 
    square.setAttribute('id', ID); 
    square.addEventListener('click', () => {
        hitEmpty(square); 
    })
    return square; 
}

export const hitEmpty = (square) => {
    square.classList.toggle('hitEmptySquare');
    //square.classList.remove('emptySquare');
    //square.classList.add('hitEmptySquare');
    if (square.childNodes.length === 0) {
        const dot = document.createElement('div');
        dot.setAttribute('class', 'dot')
        square.appendChild(dot);
    } 
}
