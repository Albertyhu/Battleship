"use strict";
(self["webpackChunkwebpack_template"] = self["webpackChunkwebpack_template"] || []).push([["index"],{

/***/ "./src/gameLoop.js":
/*!*************************!*\
  !*** ./src/gameLoop.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player.js */ "./src/player.js");
/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./grid.js */ "./src/grid.js");
/* harmony import */ var _placeShips_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeShips.js */ "./src/placeShips.js");



var startGame = function startGame() {
  var playerOne = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.createPlayer)('player1');
  var playerOneArea = document.getElementById('player1Area');
  playerOneArea.appendChild((0,_grid_js__WEBPACK_IMPORTED_MODULE_1__.generateGrid)(10, playerOne));
  (0,_placeShips_js__WEBPACK_IMPORTED_MODULE_2__.placeAllShips)(playerOne, 10);
  console.log(playerOne.shipArray);
  var playerTwo = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.createPlayer)('computer');
  var playerTwoArea = document.getElementById('player2Area');
  playerTwoArea.appendChild((0,_grid_js__WEBPACK_IMPORTED_MODULE_1__.generateGrid)(10, playerTwo));
  (0,_placeShips_js__WEBPACK_IMPORTED_MODULE_2__.placeAllShips)(playerTwo, 10);
  console.log(playerTwo.shipArray);
};

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "grid": () => (/* binding */ grid),
/* harmony export */   "squareUnit": () => (/* binding */ squareUnit),
/* harmony export */   "generateGrid": () => (/* binding */ generateGrid),
/* harmony export */   "generateRow": () => (/* binding */ generateRow),
/* harmony export */   "generateSquare": () => (/* binding */ generateSquare),
/* harmony export */   "hitEmpty": () => (/* binding */ hitEmpty),
/* harmony export */   "hitOccupied": () => (/* binding */ hitOccupied)
/* harmony export */ });
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
var grid = {
  element: document.createElement('div'),
  setGrid: function setGrid() {
    this.element.setAttribute('class', 'grid');
  }
}; //Non-hit squares are considered empty 

var squareUnit = {
  unit: document.createElement('div'),
  hit: false,
  isEmpty: true
};
var generateGrid = function generateGrid(columns, player) {
  var newgrid = Object.create(grid);
  newgrid.setGrid();

  if (columns < 10) {
    columns = 10;
  }

  generateRow(newgrid.element, columns, columns, player);
  return newgrid.element;
}; //This function not only generates the rows of the grid, 
//but is also responsible for generating the squares for holding important information such as whether or not a square is empty 

var generateRow = function generateRow(targetGrid, column, count, player) {
  if (count > 0) {
    var row = document.createElement('div');
    row.setAttribute('class', 'row');

    for (var i = 1; i <= column; i++) {
      var coordinate = i + ',' + count;
      var area = {
        coordinate: coordinate,
        x: i,
        y: count,
        hit: false,
        occupied: false
      };
      player.boardArray.push(area);
      row.appendChild(generateSquare(player.boardArray[player.boardArray.length - 1], coordinate.toString()));
    }

    row.setAttribute('class', 'row');
    targetGrid.appendChild(row);
    generateRow(targetGrid, column, count - 1, player);
  }
};
var generateSquare = function generateSquare(area, ID) {
  var square = document.createElement('div');
  square.setAttribute('class', 'emptySquare');
  square.setAttribute('id', ID); //to show the coordinates on render

  var display = document.createElement('p');
  display.style.margin = 'auto';
  display.innerHTML = ID;
  square.appendChild(display);
  square.addEventListener('click', function () {
    if (!area.hit) {
      area.hit = true;
      if (area.occupied) hitOccupied(square);else hitEmpty(square);
    }
  });
  return square;
};
var hitEmpty = function hitEmpty(square) {
  square.classList.toggle('hitEmptySquare');

  if (square.childNodes.length === 0) {
    var dot = document.createElement('div');
    dot.setAttribute('class', 'dot');
    square.appendChild(dot);
  }
};
var hitOccupied = function hitOccupied(square) {
  square.classList.remove('occupiedSquare');
  square.classList.add('hitOccupiedSquare');

  if (square.childNodes.length === 0) {
    var dot = document.createElement('div');
    dot.setAttribute('class', 'dot');
    square.appendChild(dot);
  }
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship.js */ "./src/ship.js");
/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./grid.js */ "./src/grid.js");
/* harmony import */ var _mystyle_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mystyle.css */ "./src/mystyle.css");
/* harmony import */ var _gameLoop_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gameLoop.js */ "./src/gameLoop.js");




 //import { generateCoordinates } from './placeShips.js';
//for watching the html file 

__webpack_require__(/*! ./home.html */ "./src/home.html");

(0,_gameLoop_js__WEBPACK_IMPORTED_MODULE_4__.startGame)(); //const sampleGrid = document.getElementById('player1Area'); 
//sampleGrid.appendChild(generateGrid(10));

/***/ }),

/***/ "./src/placeShips.js":
/*!***************************!*\
  !*** ./src/placeShips.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "placeAllShips": () => (/* binding */ placeAllShips),
/* harmony export */   "placeShip": () => (/* binding */ placeShip),
/* harmony export */   "isItOccuppied": () => (/* binding */ isItOccuppied),
/* harmony export */   "generateCoordinates": () => (/* binding */ generateCoordinates)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/ship.js");
/* harmony import */ var _randGen_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./randGen.js */ "./src/randGen.js");
//import {createShip, createCarrier, createBattleship, createDestroyer, createSubmarine, createPatrol } from './ship.js'; 

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

var placeAllShips = function placeAllShips(player, gridLength) {
  placeShip(player, 'carrier', 5, gridLength);
  placeShip(player, 'battleship', 4, gridLength);
  placeShip(player, 'destroyer', 3, gridLength);
  placeShip(player, 'submarine', 3, gridLength);
  placeShip(player, 'patrol boat', 2, gridLength);
  placeShip(player, 'patrol boat', 2, gridLength);
}; //places the players ship
//There should be a separate function that places the computer's ship. 
//gridLength is the number of columns on the player's board 

var placeShip = function placeShip(player, shipType, length, gridLength) {
  var positioned = false;
  var ship = (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.createShip)(length, shipType);

  while (!positioned) {
    var coordinate = generateCoordinates(gridLength); //If 1, programs tries to see if ship can be placed horizontally first, then vertically
    //If 2, programs tries to see if ship can be placed vertically first, then horizontally

    var orientation = (0,_randGen_js__WEBPACK_IMPORTED_MODULE_1__.genRandom)(2);

    if (orientation === 1) {
      positioned = horizThenVert(player, coordinate, ship, length, gridLength);
    } else if (orientation === 2) {
      positioned = vertThenHoriz(player, coordinate, ship, length, gridLength);
    }
  }
};

var horizThenVert = function horizThenVert(player, coordinate, ship, length, gridLength) {
  //if the ship can be placed horizontally without going out of bounds. 
  if (coordinate.x + length <= gridLength) {
    if (!isItOccuppied(player, coordinate, length, true)) {
      //code for placing ship 
      //function has to keep track of the coordinates of the ship
      //This is to provide information for a function that keeps track of whether a ship is sunk or not 
      for (var i = 0; i < length; i++) {
        player.boardArray.forEach(function (item) {
          if (item.x === coordinate.x + i && item.y === coordinate.y && item.occupied === false) {
            placeShipPart(item, ship);
          }
        });
      } //keep track of the ship once it's placed


      player.shipArray.push(ship);
      return true;
    } else {
      return false;
    }
  } //if placing ship horizontally makes it out of bounds, try placing it vertically
  else {
    if (coordinate.y - length > 0) {
      if (!isItOccuppied(player, coordinate, length, false)) {
        for (var i = 0; i < length; i++) {
          player.boardArray.forEach(function (item) {
            if (item.x === coordinate.x && item.y === coordinate.y - i && item.occupied === false) {
              placeShipPart(item, ship);
            }
          });
        } //keep track of the ship once it's placed 


        player.shipArray.push(ship);
        return true;
      } else {
        return false;
      }
    } //if the ship can't be place horizontally or vertically, rerun loop; 
    else return false;
  }
};

var vertThenHoriz = function vertThenHoriz(player, coordinate, ship, length, gridLength) {
  if (coordinate.y - length > 0) {
    if (!isItOccuppied(player, coordinate, length, false)) {
      for (var i = 0; i < length; i++) {
        player.boardArray.forEach(function (item) {
          if (item.x === coordinate.x && item.y === coordinate.y - i && item.occupied === false) {
            placeShipPart(item, ship);
          }
        });
      } //keep track of the ship once it's placed


      player.shipArray.push(ship);
      return true;
    } else {
      return false;
    }
  } else {
    if (coordinate.x + length <= gridLength) {
      for (var i = 0; i < length; i++) {
        player.boardArray.forEach(function (item) {
          if (item.x === coordinate.x + i && item.y === coordinate.y && item.occupied === false) {
            var dom_coordinates = item.x + ',' + item.y;
            document.getElementById(dom_coordinates).classList.toggle('occupiedSquare');
            item.occupied = true;
            ship.setPos(item.x, item.y);
          }
        });
      } //keep track of the ship once it's placed


      player.shipArray.push(ship);
      return true;
    } else {
      return false;
    }
  }
};

var placeShipPart = function placeShipPart(item, ship) {
  var dom_coordinates = item.x + ',' + item.y;
  document.getElementById(dom_coordinates).classList.remove('emptySquare');
  document.getElementById(dom_coordinates).classList.add('occupiedSquare');
  item.occupied = true;
  ship.setPos(item.x, item.y);
}; //this can be reused to determine if hit area is occupied or not 


var isItOccuppied = function isItOccuppied(player, coordinate, length, horizontal) {
  // console.log('x = ' + coordinate.x)
  // console.log('y = ' + coordinate.y)
  var isOccupied = false;

  if (horizontal) {
    for (var i = 0; i < length; i++) {
      player.boardArray.forEach(function (item) {
        if (item.x === coordinate.x + i && item.y === coordinate.y) {
          /*  console.log("player's coordinates (" + item.x + "," + item.y + "): " + item.occupied + "\n" +
                "tested coordinates (" + (coordinate.x + i) + "," + coordinate.y + ")"
            )*/
          if (item.occupied) {
            // console.log("horizontal: " + item.occupied)
            isOccupied = true;
            i = length;
          }
        }
      });
    }
  } else {
    //if ship were to be placed vertically
    for (var i = 0; i < length; i++) {
      player.boardArray.forEach(function (item) {
        /*
        console.log("(" + item.x + "," + item.y + "): " + item.occupied + "\n" + 
            "tested coordinates (" + coordinate.x + "," + (coordinate.y - i) + ")")
           */
        if (item.x === coordinate.x && item.y === coordinate.y - 1) {
          if (item.occupied) {
            // console.log("vertical: " + item.occupied)
            isOccupied = true;
            i = length;
          }
        }
      });
    }
  }

  return isOccupied;
};
var generateCoordinates = function generateCoordinates(columns) {
  var x = (0,_randGen_js__WEBPACK_IMPORTED_MODULE_1__.genRandom)(columns);
  var y = (0,_randGen_js__WEBPACK_IMPORTED_MODULE_1__.genRandom)(columns);
  return {
    x: x,
    y: y
  };
};

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "player": () => (/* binding */ player),
/* harmony export */   "createPlayer": () => (/* binding */ createPlayer)
/* harmony export */ });
//Have an 2-tier array that contains the ships and the coordinates 
//The ships arrays of 
//The game has to recognize that the ships cannot go out of bounds. 
var player = {
  name: '',
  boardArray: [],
  boardNode: null,
  shipArray: []
}; //const samplearray = ["carrier"= [], "battleship"=[], "destroyer" = [], "submarine" = [], "patrol"=[]]

var createPlayer = function createPlayer(name) {
  var newplayer = new Object();
  newplayer.boardArray = [];
  newplayer.boardNode = null;
  newplayer.shipArray = [];
  newplayer.name = name;
  return newplayer;
};

/***/ }),

/***/ "./src/randGen.js":
/*!************************!*\
  !*** ./src/randGen.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "genRandom": () => (/* binding */ genRandom)
/* harmony export */ });
var genRandom = function genRandom(num) {
  return Math.floor(Math.random() * num) + 1;
};

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ship": () => (/* binding */ ship),
/* harmony export */   "createShip": () => (/* binding */ createShip)
/* harmony export */ });
//Grid should keep track of the coordinates of each boat
//Option: Keep track of the coordinates of the ship's front area then determine whether the ship is placed vertically or horizontally
//Option 2: Keep track of the coordinates of all the ships units
var ship = {
  length: 0,
  isSunk: false,
  posArray: [],
  type: '',
  setPos: function setPos(x_coor, y_coor) {
    this.posArray.push({
      x: x_coor,
      y: y_coor
    });
  }
}; //This method doesn't work because for some reason, each ship was recording every ships positions. 
//A revised version is written below.

/*
export const createShip = (length, type) => {
    const newShip = Object.create(ship);
    newShip.length = length; 
    newShip.type = type; 
    return newShip;
}*/

var createShip = function createShip(length, type) {
  var newShip = new Object();
  newShip.length = length;
  newShip.type = type;
  newShip.isSunk = false;
  newShip.posArray = [];

  newShip.setPos = function (x_coor, y_coor) {
    newShip.posArray.push({
      x: x_coor,
      y: y_coor
    });
  };

  return newShip;
};
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

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/mystyle.css":
/*!***************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/mystyle.css ***!
  \***************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "#container {\r\nwidth: 100%; \r\nheight: 100%; \r\nalign-content: center;\r\n}\r\n#innerContainer {\r\nwidth: 90%; \r\nheight: 100%; \r\nmargin: auto; \r\n}\r\n\r\n#p1Zone, #p2Zone {\r\n    display: inline-block;\r\n}\r\n\r\n#p1Zone {\r\n}\r\n\r\n#p2Zone {\r\n\r\n}\r\n\r\n#player1Area, #player2Area {\r\n}\r\n\r\n#player1Area {\r\n}\r\n\r\n#player2Area {\r\n}\r\n\r\ndiv.emptySquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n}\r\n\r\n.emptySquare:hover {\r\n    background-color: #d9d9d9;\r\n}\r\n\r\n.hitEmptySquare {\r\n    width: 52px;\r\n    height: 52px;\r\n    display: block;\r\n    margin: 0;\r\n    background-color: #7fffd4;\r\n    justify-content: center;\r\n    align-content: center;\r\n\r\n}\r\n\r\n.hitEmptySquare:hover {\r\n    background-color: #7fffd4;\r\n}\r\n\r\n.hitOccupiedSquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #ff0000;\r\n}\r\n\r\n.hitOccupiedSquare:hover {\r\n    background-color: #ff0000;\r\n}\r\n\r\n.occupiedSquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #50aa00; \r\n}\r\n\r\n.occupiedSquare:hover {\r\n    background-color: #50aa00;\r\n}\r\n\r\n.row {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n}\r\n\r\n.grid {\r\nwidth: 100%; \r\nheight: 100%; \r\nmargin-left: auto;\r\nmargin-right: auto;\r\n}\r\n\r\n.dot {\r\nwidth: 5px;\r\nheight: 5px;\r\nborder-radius: 5px; \r\nbackground-color: #000000; \r\nmargin: auto;\r\ntop: 50%;\r\nleft: 50%;\r\nmargin-top: 50%;\r\n}", "",{"version":3,"sources":["webpack://./src/mystyle.css"],"names":[],"mappings":"AAAA;AACA,WAAW;AACX,YAAY;AACZ,qBAAqB;AACrB;AACA;AACA,UAAU;AACV,YAAY;AACZ,YAAY;AACZ;;AAEA;IACI,qBAAqB;AACzB;;AAEA;AACA;;AAEA;;AAEA;;AAEA;AACA;;AAEA;AACA;;AAEA;AACA;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,uBAAuB;IACvB,qBAAqB;;AAEzB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,aAAa;AACjB;;AAEA;AACA,WAAW;AACX,YAAY;AACZ,iBAAiB;AACjB,kBAAkB;AAClB;;AAEA;AACA,UAAU;AACV,WAAW;AACX,kBAAkB;AAClB,yBAAyB;AACzB,YAAY;AACZ,QAAQ;AACR,SAAS;AACT,eAAe;AACf","sourcesContent":["#container {\r\nwidth: 100%; \r\nheight: 100%; \r\nalign-content: center;\r\n}\r\n#innerContainer {\r\nwidth: 90%; \r\nheight: 100%; \r\nmargin: auto; \r\n}\r\n\r\n#p1Zone, #p2Zone {\r\n    display: inline-block;\r\n}\r\n\r\n#p1Zone {\r\n}\r\n\r\n#p2Zone {\r\n\r\n}\r\n\r\n#player1Area, #player2Area {\r\n}\r\n\r\n#player1Area {\r\n}\r\n\r\n#player2Area {\r\n}\r\n\r\ndiv.emptySquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n}\r\n\r\n.emptySquare:hover {\r\n    background-color: #d9d9d9;\r\n}\r\n\r\n.hitEmptySquare {\r\n    width: 52px;\r\n    height: 52px;\r\n    display: block;\r\n    margin: 0;\r\n    background-color: #7fffd4;\r\n    justify-content: center;\r\n    align-content: center;\r\n\r\n}\r\n\r\n.hitEmptySquare:hover {\r\n    background-color: #7fffd4;\r\n}\r\n\r\n.hitOccupiedSquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #ff0000;\r\n}\r\n\r\n.hitOccupiedSquare:hover {\r\n    background-color: #ff0000;\r\n}\r\n\r\n.occupiedSquare {\r\n    width: 50px;\r\n    height: 50px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #50aa00; \r\n}\r\n\r\n.occupiedSquare:hover {\r\n    background-color: #50aa00;\r\n}\r\n\r\n.row {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n}\r\n\r\n.grid {\r\nwidth: 100%; \r\nheight: 100%; \r\nmargin-left: auto;\r\nmargin-right: auto;\r\n}\r\n\r\n.dot {\r\nwidth: 5px;\r\nheight: 5px;\r\nborder-radius: 5px; \r\nbackground-color: #000000; \r\nmargin: auto;\r\ntop: 50%;\r\nleft: 50%;\r\nmargin-top: 50%;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./src/home.html":
/*!***********************!*\
  !*** ./src/home.html ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>New Project</title>\r\n</head>\r\n<body>\r\n    <div id=\"container\">\r\n        <div id=\"innerContainer\">\r\n            <div id=\"p1Zone\">\r\n                <div id=\"player1Area\"></div>\r\n            </div>\r\n            <div id=\"p2Zone\">\r\n                <div id=\"player2Area\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./src/mystyle.css":
/*!*************************!*\
  !*** ./src/mystyle.css ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_mystyle_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./mystyle.css */ "./node_modules/css-loader/dist/cjs.js!./src/mystyle.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_mystyle_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_mystyle_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_mystyle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_mystyle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["shared"], () => (__webpack_exec__("./src/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFHTyxJQUFNRyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxHQUFNO0FBQzNCLE1BQU1DLFNBQVMsR0FBR0osd0RBQVksQ0FBQyxTQUFELENBQTlCO0FBQ0EsTUFBTUssYUFBYSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBdEI7QUFDQUYsRUFBQUEsYUFBYSxDQUFDRyxXQUFkLENBQTBCUCxzREFBWSxDQUFDLEVBQUQsRUFBS0csU0FBTCxDQUF0QztBQUNBRixFQUFBQSw2REFBYSxDQUFDRSxTQUFELEVBQVksRUFBWixDQUFiO0FBQ0FLLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZTixTQUFTLENBQUNPLFNBQXRCO0FBR0EsTUFBTUMsU0FBUyxHQUFHWix3REFBWSxDQUFDLFVBQUQsQ0FBOUI7QUFDQSxNQUFNYSxhQUFhLEdBQUdQLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixhQUF4QixDQUF0QjtBQUNBTSxFQUFBQSxhQUFhLENBQUNMLFdBQWQsQ0FBMEJQLHNEQUFZLENBQUMsRUFBRCxFQUFLVyxTQUFMLENBQXRDO0FBQ0FWLEVBQUFBLDZEQUFhLENBQUNVLFNBQUQsRUFBWSxFQUFaLENBQWI7QUFDQUgsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlFLFNBQVMsQ0FBQ0QsU0FBdEI7QUFDSCxDQWJNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRU8sSUFBTUcsSUFBSSxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUVULFFBQVEsQ0FBQ1UsYUFBVCxDQUF1QixLQUF2QixDQURPO0FBRWhCQyxFQUFBQSxPQUZnQixxQkFFTjtBQUNOLFNBQUtGLE9BQUwsQ0FBYUcsWUFBYixDQUEwQixPQUExQixFQUFtQyxNQUFuQztBQUNIO0FBSmUsQ0FBYixFQVFQOztBQUNPLElBQU1DLFVBQVUsR0FBRztBQUN0QkMsRUFBQUEsSUFBSSxFQUFFZCxRQUFRLENBQUNVLGFBQVQsQ0FBdUIsS0FBdkIsQ0FEZ0I7QUFFdEJLLEVBQUFBLEdBQUcsRUFBRSxLQUZpQjtBQUd0QkMsRUFBQUEsT0FBTyxFQUFFO0FBSGEsQ0FBbkI7QUFPQSxJQUFNckIsWUFBWSxHQUFHLFNBQWZBLFlBQWUsQ0FBQ3NCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QyxNQUFJQyxPQUFPLEdBQUdDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjYixJQUFkLENBQWQ7QUFDQVcsRUFBQUEsT0FBTyxDQUFDUixPQUFSOztBQUNBLE1BQUlNLE9BQU8sR0FBRyxFQUFkLEVBQWtCO0FBQ2RBLElBQUFBLE9BQU8sR0FBRyxFQUFWO0FBQ0g7O0FBQ0RLLEVBQUFBLFdBQVcsQ0FBQ0gsT0FBTyxDQUFDVixPQUFULEVBQWtCUSxPQUFsQixFQUEyQkEsT0FBM0IsRUFBb0NDLE1BQXBDLENBQVg7QUFDQSxTQUFPQyxPQUFPLENBQUNWLE9BQWY7QUFDSCxDQVJNLEVBVVA7QUFDQTs7QUFDTyxJQUFNYSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDQyxVQUFELEVBQWFDLE1BQWIsRUFBcUJDLEtBQXJCLEVBQTRCUCxNQUE1QixFQUF1QztBQUM5RCxNQUFJTyxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ1gsUUFBTUMsR0FBRyxHQUFHMUIsUUFBUSxDQUFDVSxhQUFULENBQXVCLEtBQXZCLENBQVo7QUFDQWdCLElBQUFBLEdBQUcsQ0FBQ2QsWUFBSixDQUFpQixPQUFqQixFQUEwQixLQUExQjs7QUFDQSxTQUFLLElBQUllLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUlILE1BQXJCLEVBQTZCRyxDQUFDLEVBQTlCLEVBQWtDO0FBQzlCLFVBQU1DLFVBQVUsR0FBR0QsQ0FBQyxHQUFHLEdBQUosR0FBVUYsS0FBN0I7QUFDQSxVQUFNSSxJQUFJLEdBQUc7QUFDVEQsUUFBQUEsVUFBVSxFQUFWQSxVQURTO0FBRVRFLFFBQUFBLENBQUMsRUFBRUgsQ0FGTTtBQUdUSSxRQUFBQSxDQUFDLEVBQUVOLEtBSE07QUFJVFYsUUFBQUEsR0FBRyxFQUFFLEtBSkk7QUFLVGlCLFFBQUFBLFFBQVEsRUFBRTtBQUxELE9BQWI7QUFPQWQsTUFBQUEsTUFBTSxDQUFDZSxVQUFQLENBQWtCQyxJQUFsQixDQUF1QkwsSUFBdkI7QUFDQUgsTUFBQUEsR0FBRyxDQUFDeEIsV0FBSixDQUFnQmlDLGNBQWMsQ0FBQ2pCLE1BQU0sQ0FBQ2UsVUFBUCxDQUFrQmYsTUFBTSxDQUFDZSxVQUFQLENBQWtCRyxNQUFsQixHQUEyQixDQUE3QyxDQUFELEVBQWtEUixVQUFVLENBQUNTLFFBQVgsRUFBbEQsQ0FBOUI7QUFDSDs7QUFDRFgsSUFBQUEsR0FBRyxDQUFDZCxZQUFKLENBQWlCLE9BQWpCLEVBQTBCLEtBQTFCO0FBQ0FXLElBQUFBLFVBQVUsQ0FBQ3JCLFdBQVgsQ0FBdUJ3QixHQUF2QjtBQUNBSixJQUFBQSxXQUFXLENBQUNDLFVBQUQsRUFBYUMsTUFBYixFQUFxQkMsS0FBSyxHQUFHLENBQTdCLEVBQWdDUCxNQUFoQyxDQUFYO0FBRUg7QUFFSixDQXRCTTtBQXdCQSxJQUFNaUIsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFDTixJQUFELEVBQU9TLEVBQVAsRUFBYztBQUN4QyxNQUFNQyxNQUFNLEdBQUd2QyxRQUFRLENBQUNVLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZjtBQUNBNkIsRUFBQUEsTUFBTSxDQUFDM0IsWUFBUCxDQUFvQixPQUFwQixFQUE2QixhQUE3QjtBQUNBMkIsRUFBQUEsTUFBTSxDQUFDM0IsWUFBUCxDQUFvQixJQUFwQixFQUEwQjBCLEVBQTFCLEVBSHdDLENBS3hDOztBQUNBLE1BQU1FLE9BQU8sR0FBR3hDLFFBQVEsQ0FBQ1UsYUFBVCxDQUF1QixHQUF2QixDQUFoQjtBQUNBOEIsRUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWNDLE1BQWQsR0FBdUIsTUFBdkI7QUFDQUYsRUFBQUEsT0FBTyxDQUFDRyxTQUFSLEdBQW9CTCxFQUFwQjtBQUNBQyxFQUFBQSxNQUFNLENBQUNyQyxXQUFQLENBQW1Cc0MsT0FBbkI7QUFFQUQsRUFBQUEsTUFBTSxDQUFDSyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxZQUFNO0FBQ25DLFFBQUksQ0FBQ2YsSUFBSSxDQUFDZCxHQUFWLEVBQWU7QUFDWGMsTUFBQUEsSUFBSSxDQUFDZCxHQUFMLEdBQVcsSUFBWDtBQUNBLFVBQUljLElBQUksQ0FBQ0csUUFBVCxFQUNJYSxXQUFXLENBQUNOLE1BQUQsQ0FBWCxDQURKLEtBR0lPLFFBQVEsQ0FBQ1AsTUFBRCxDQUFSO0FBQ1A7QUFDSixHQVJEO0FBVUEsU0FBT0EsTUFBUDtBQUNILENBdEJNO0FBd0JBLElBQU1PLFFBQVEsR0FBRyxTQUFYQSxRQUFXLENBQUNQLE1BQUQsRUFBWTtBQUNoQ0EsRUFBQUEsTUFBTSxDQUFDUSxTQUFQLENBQWlCQyxNQUFqQixDQUF3QixnQkFBeEI7O0FBQ0EsTUFBSVQsTUFBTSxDQUFDVSxVQUFQLENBQWtCYixNQUFsQixLQUE2QixDQUFqQyxFQUFvQztBQUNoQyxRQUFNYyxHQUFHLEdBQUdsRCxRQUFRLENBQUNVLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWjtBQUNBd0MsSUFBQUEsR0FBRyxDQUFDdEMsWUFBSixDQUFpQixPQUFqQixFQUEwQixLQUExQjtBQUNBMkIsSUFBQUEsTUFBTSxDQUFDckMsV0FBUCxDQUFtQmdELEdBQW5CO0FBQ0g7QUFDSixDQVBNO0FBU0EsSUFBTUwsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ04sTUFBRCxFQUFZO0FBQ25DQSxFQUFBQSxNQUFNLENBQUNRLFNBQVAsQ0FBaUJJLE1BQWpCLENBQXdCLGdCQUF4QjtBQUNBWixFQUFBQSxNQUFNLENBQUNRLFNBQVAsQ0FBaUJLLEdBQWpCLENBQXFCLG1CQUFyQjs7QUFDQSxNQUFJYixNQUFNLENBQUNVLFVBQVAsQ0FBa0JiLE1BQWxCLEtBQTZCLENBQWpDLEVBQW9DO0FBQ2hDLFFBQU1jLEdBQUcsR0FBR2xELFFBQVEsQ0FBQ1UsYUFBVCxDQUF1QixLQUF2QixDQUFaO0FBQ0F3QyxJQUFBQSxHQUFHLENBQUN0QyxZQUFKLENBQWlCLE9BQWpCLEVBQTBCLEtBQTFCO0FBQ0EyQixJQUFBQSxNQUFNLENBQUNyQyxXQUFQLENBQW1CZ0QsR0FBbkI7QUFDSDtBQUNKLENBUk07Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEdQO0FBQ0E7QUFDQTtBQUNBO0NBRUE7QUFFQTs7QUFDQUksbUJBQU8sQ0FBQyxvQ0FBRCxDQUFQOztBQUVBekQsdURBQVMsSUFFVDtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtDQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7O0FBRU8sSUFBTUQsYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDc0IsTUFBRCxFQUFTdUMsVUFBVCxFQUF3QjtBQUNqREMsRUFBQUEsU0FBUyxDQUFDeEMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsQ0FBcEIsRUFBdUJ1QyxVQUF2QixDQUFUO0FBQ0FDLEVBQUFBLFNBQVMsQ0FBQ3hDLE1BQUQsRUFBUyxZQUFULEVBQXVCLENBQXZCLEVBQTBCdUMsVUFBMUIsQ0FBVDtBQUNBQyxFQUFBQSxTQUFTLENBQUN4QyxNQUFELEVBQVMsV0FBVCxFQUFzQixDQUF0QixFQUF5QnVDLFVBQXpCLENBQVQ7QUFDQUMsRUFBQUEsU0FBUyxDQUFDeEMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsQ0FBdEIsRUFBeUJ1QyxVQUF6QixDQUFUO0FBQ0FDLEVBQUFBLFNBQVMsQ0FBQ3hDLE1BQUQsRUFBUyxhQUFULEVBQXdCLENBQXhCLEVBQTJCdUMsVUFBM0IsQ0FBVDtBQUNBQyxFQUFBQSxTQUFTLENBQUN4QyxNQUFELEVBQVMsYUFBVCxFQUF3QixDQUF4QixFQUEyQnVDLFVBQTNCLENBQVQ7QUFDSCxDQVBNLEVBU1A7QUFDQTtBQUNBOztBQUNPLElBQU1DLFNBQVMsR0FBRyxTQUFaQSxTQUFZLENBQUN4QyxNQUFELEVBQVN5QyxRQUFULEVBQW1CdkIsTUFBbkIsRUFBMkJxQixVQUEzQixFQUEwQztBQUMvRCxNQUFJRyxVQUFVLEdBQUcsS0FBakI7QUFDQSxNQUFNQyxJQUFJLEdBQUdOLG9EQUFVLENBQUNuQixNQUFELEVBQVN1QixRQUFULENBQXZCOztBQUNBLFNBQU8sQ0FBQ0MsVUFBUixFQUFvQjtBQUNoQixRQUFJaEMsVUFBVSxHQUFHa0MsbUJBQW1CLENBQUNMLFVBQUQsQ0FBcEMsQ0FEZ0IsQ0FHaEI7QUFDQTs7QUFDQSxRQUFJTSxXQUFXLEdBQUdQLHNEQUFTLENBQUMsQ0FBRCxDQUEzQjs7QUFDQSxRQUFJTyxXQUFXLEtBQUssQ0FBcEIsRUFBdUI7QUFDbkJILE1BQUFBLFVBQVUsR0FBR0ksYUFBYSxDQUFDOUMsTUFBRCxFQUFTVSxVQUFULEVBQXFCaUMsSUFBckIsRUFBMkJ6QixNQUEzQixFQUFtQ3FCLFVBQW5DLENBQTFCO0FBQ0gsS0FGRCxNQUdLLElBQUlNLFdBQVcsS0FBSyxDQUFwQixFQUF1QjtBQUN4QkgsTUFBQUEsVUFBVSxHQUFHSyxhQUFhLENBQUMvQyxNQUFELEVBQVNVLFVBQVQsRUFBcUJpQyxJQUFyQixFQUEyQnpCLE1BQTNCLEVBQW1DcUIsVUFBbkMsQ0FBMUI7QUFDSDtBQUVKO0FBQ0osQ0FqQk07O0FBbUJQLElBQU1PLGFBQWEsR0FBRyxTQUFoQkEsYUFBZ0IsQ0FBQzlDLE1BQUQsRUFBU1UsVUFBVCxFQUFxQmlDLElBQXJCLEVBQTJCekIsTUFBM0IsRUFBbUNxQixVQUFuQyxFQUFrRDtBQUNwRTtBQUNBLE1BQUk3QixVQUFVLENBQUNFLENBQVgsR0FBZU0sTUFBZixJQUF5QnFCLFVBQTdCLEVBQXlDO0FBQ3JDLFFBQUksQ0FBQ1MsYUFBYSxDQUFDaEQsTUFBRCxFQUFTVSxVQUFULEVBQXFCUSxNQUFyQixFQUE2QixJQUE3QixDQUFsQixFQUFzRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQSxXQUFLLElBQUlULENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdTLE1BQXBCLEVBQTRCVCxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCVCxRQUFBQSxNQUFNLENBQUNlLFVBQVAsQ0FBa0JrQyxPQUFsQixDQUEwQixVQUFBQyxJQUFJLEVBQUk7QUFDOUIsY0FBSUEsSUFBSSxDQUFDdEMsQ0FBTCxLQUFZRixVQUFVLENBQUNFLENBQVgsR0FBZUgsQ0FBM0IsSUFBaUN5QyxJQUFJLENBQUNyQyxDQUFMLEtBQVdILFVBQVUsQ0FBQ0csQ0FBdkQsSUFBNERxQyxJQUFJLENBQUNwQyxRQUFMLEtBQWtCLEtBQWxGLEVBQXlGO0FBQ3JGcUMsWUFBQUEsYUFBYSxDQUFDRCxJQUFELEVBQU9QLElBQVAsQ0FBYjtBQUNIO0FBQ0osU0FKRDtBQUtILE9BVmlELENBV2xEOzs7QUFDQTNDLE1BQUFBLE1BQU0sQ0FBQ2IsU0FBUCxDQUFpQjZCLElBQWpCLENBQXNCMkIsSUFBdEI7QUFDQSxhQUFPLElBQVA7QUFDSCxLQWRELE1BZUs7QUFDRCxhQUFPLEtBQVA7QUFDSDtBQUNKLEdBbkJELENBb0JBO0FBcEJBLE9BcUJLO0FBQ0QsUUFBSWpDLFVBQVUsQ0FBQ0csQ0FBWCxHQUFlSyxNQUFmLEdBQXdCLENBQTVCLEVBQStCO0FBQzNCLFVBQUksQ0FBQzhCLGFBQWEsQ0FBQ2hELE1BQUQsRUFBU1UsVUFBVCxFQUFxQlEsTUFBckIsRUFBNkIsS0FBN0IsQ0FBbEIsRUFBdUQ7QUFDbkQsYUFBSyxJQUFJVCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHUyxNQUFwQixFQUE0QlQsQ0FBQyxFQUE3QixFQUFpQztBQUM3QlQsVUFBQUEsTUFBTSxDQUFDZSxVQUFQLENBQWtCa0MsT0FBbEIsQ0FBMEIsVUFBQUMsSUFBSSxFQUFJO0FBQzlCLGdCQUFJQSxJQUFJLENBQUN0QyxDQUFMLEtBQVdGLFVBQVUsQ0FBQ0UsQ0FBdEIsSUFBMkJzQyxJQUFJLENBQUNyQyxDQUFMLEtBQVlILFVBQVUsQ0FBQ0csQ0FBWCxHQUFlSixDQUF0RCxJQUE0RHlDLElBQUksQ0FBQ3BDLFFBQUwsS0FBa0IsS0FBbEYsRUFBeUY7QUFDckZxQyxjQUFBQSxhQUFhLENBQUNELElBQUQsRUFBT1AsSUFBUCxDQUFiO0FBQ0g7QUFDSixXQUpEO0FBS0gsU0FQa0QsQ0FRbkQ7OztBQUNBM0MsUUFBQUEsTUFBTSxDQUFDYixTQUFQLENBQWlCNkIsSUFBakIsQ0FBc0IyQixJQUF0QjtBQUNBLGVBQU8sSUFBUDtBQUNILE9BWEQsTUFZSztBQUNELGVBQU8sS0FBUDtBQUNIO0FBQ0osS0FoQkQsQ0FpQkE7QUFqQkEsU0FtQkksT0FBTyxLQUFQO0FBQ1A7QUFDSixDQTdDRDs7QUErQ0EsSUFBTUksYUFBYSxHQUFHLFNBQWhCQSxhQUFnQixDQUFDL0MsTUFBRCxFQUFTVSxVQUFULEVBQXFCaUMsSUFBckIsRUFBMkJ6QixNQUEzQixFQUFtQ3FCLFVBQW5DLEVBQWtEO0FBQ3BFLE1BQUk3QixVQUFVLENBQUNHLENBQVgsR0FBZUssTUFBZixHQUF3QixDQUE1QixFQUErQjtBQUMzQixRQUFJLENBQUM4QixhQUFhLENBQUNoRCxNQUFELEVBQVNVLFVBQVQsRUFBcUJRLE1BQXJCLEVBQTZCLEtBQTdCLENBQWxCLEVBQXVEO0FBQ25ELFdBQUssSUFBSVQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1MsTUFBcEIsRUFBNEJULENBQUMsRUFBN0IsRUFBaUM7QUFDN0JULFFBQUFBLE1BQU0sQ0FBQ2UsVUFBUCxDQUFrQmtDLE9BQWxCLENBQTBCLFVBQUFDLElBQUksRUFBSTtBQUM5QixjQUFJQSxJQUFJLENBQUN0QyxDQUFMLEtBQVdGLFVBQVUsQ0FBQ0UsQ0FBdEIsSUFBMkJzQyxJQUFJLENBQUNyQyxDQUFMLEtBQVlILFVBQVUsQ0FBQ0csQ0FBWCxHQUFlSixDQUF0RCxJQUE0RHlDLElBQUksQ0FBQ3BDLFFBQUwsS0FBa0IsS0FBbEYsRUFBeUY7QUFDckZxQyxZQUFBQSxhQUFhLENBQUNELElBQUQsRUFBT1AsSUFBUCxDQUFiO0FBQ0g7QUFDSixTQUpEO0FBS0gsT0FQa0QsQ0FRbkQ7OztBQUNBM0MsTUFBQUEsTUFBTSxDQUFDYixTQUFQLENBQWlCNkIsSUFBakIsQ0FBc0IyQixJQUF0QjtBQUNBLGFBQU8sSUFBUDtBQUNILEtBWEQsTUFZSztBQUNELGFBQU8sS0FBUDtBQUNIO0FBQ0osR0FoQkQsTUFpQks7QUFDRCxRQUFJakMsVUFBVSxDQUFDRSxDQUFYLEdBQWVNLE1BQWYsSUFBeUJxQixVQUE3QixFQUF5QztBQUNyQyxXQUFLLElBQUk5QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHUyxNQUFwQixFQUE0QlQsQ0FBQyxFQUE3QixFQUFpQztBQUM3QlQsUUFBQUEsTUFBTSxDQUFDZSxVQUFQLENBQWtCa0MsT0FBbEIsQ0FBMEIsVUFBQUMsSUFBSSxFQUFJO0FBQzlCLGNBQUlBLElBQUksQ0FBQ3RDLENBQUwsS0FBWUYsVUFBVSxDQUFDRSxDQUFYLEdBQWVILENBQTNCLElBQWlDeUMsSUFBSSxDQUFDckMsQ0FBTCxLQUFXSCxVQUFVLENBQUNHLENBQXZELElBQTREcUMsSUFBSSxDQUFDcEMsUUFBTCxLQUFrQixLQUFsRixFQUF5RjtBQUNyRixnQkFBTXNDLGVBQWUsR0FBR0YsSUFBSSxDQUFDdEMsQ0FBTCxHQUFTLEdBQVQsR0FBZXNDLElBQUksQ0FBQ3JDLENBQTVDO0FBQ0EvQixZQUFBQSxRQUFRLENBQUNDLGNBQVQsQ0FBd0JxRSxlQUF4QixFQUF5Q3ZCLFNBQXpDLENBQW1EQyxNQUFuRCxDQUEwRCxnQkFBMUQ7QUFDQW9CLFlBQUFBLElBQUksQ0FBQ3BDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQTZCLFlBQUFBLElBQUksQ0FBQ1UsTUFBTCxDQUFZSCxJQUFJLENBQUN0QyxDQUFqQixFQUFvQnNDLElBQUksQ0FBQ3JDLENBQXpCO0FBQ0g7QUFDSixTQVBEO0FBUUgsT0FWb0MsQ0FXckM7OztBQUNBYixNQUFBQSxNQUFNLENBQUNiLFNBQVAsQ0FBaUI2QixJQUFqQixDQUFzQjJCLElBQXRCO0FBQ0EsYUFBTyxJQUFQO0FBQ0gsS0FkRCxNQWVLO0FBQ0QsYUFBTyxLQUFQO0FBQ0g7QUFDSjtBQUNKLENBdENEOztBQXdDQSxJQUFNUSxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNELElBQUQsRUFBT1AsSUFBUCxFQUFnQjtBQUNsQyxNQUFNUyxlQUFlLEdBQUdGLElBQUksQ0FBQ3RDLENBQUwsR0FBUyxHQUFULEdBQWVzQyxJQUFJLENBQUNyQyxDQUE1QztBQUNBL0IsRUFBQUEsUUFBUSxDQUFDQyxjQUFULENBQXdCcUUsZUFBeEIsRUFBeUN2QixTQUF6QyxDQUFtREksTUFBbkQsQ0FBMEQsYUFBMUQ7QUFDQW5ELEVBQUFBLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QnFFLGVBQXhCLEVBQXlDdkIsU0FBekMsQ0FBbURLLEdBQW5ELENBQXVELGdCQUF2RDtBQUNBZ0IsRUFBQUEsSUFBSSxDQUFDcEMsUUFBTCxHQUFnQixJQUFoQjtBQUNBNkIsRUFBQUEsSUFBSSxDQUFDVSxNQUFMLENBQVlILElBQUksQ0FBQ3RDLENBQWpCLEVBQW9Cc0MsSUFBSSxDQUFDckMsQ0FBekI7QUFDSCxDQU5ELEVBUUE7OztBQUNPLElBQU1tQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQUNoRCxNQUFELEVBQVNVLFVBQVQsRUFBcUJRLE1BQXJCLEVBQTZCb0MsVUFBN0IsRUFBNEM7QUFDdEU7QUFDQTtBQUNDLE1BQUlDLFVBQVUsR0FBRyxLQUFqQjs7QUFDQSxNQUFJRCxVQUFKLEVBQWdCO0FBQ1osU0FBSyxJQUFJN0MsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1MsTUFBcEIsRUFBNEJULENBQUMsRUFBN0IsRUFBaUM7QUFDN0JULE1BQUFBLE1BQU0sQ0FBQ2UsVUFBUCxDQUFrQmtDLE9BQWxCLENBQTBCLFVBQUFDLElBQUksRUFBSTtBQUM5QixZQUFJQSxJQUFJLENBQUN0QyxDQUFMLEtBQVlGLFVBQVUsQ0FBQ0UsQ0FBWCxHQUFlSCxDQUEzQixJQUFpQ3lDLElBQUksQ0FBQ3JDLENBQUwsS0FBV0gsVUFBVSxDQUFDRyxDQUEzRCxFQUE4RDtBQUM1RDtBQUNsQjtBQUNBO0FBQ29CLGNBQUlxQyxJQUFJLENBQUNwQyxRQUFULEVBQW1CO0FBQ2hCO0FBQ0N5QyxZQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNBOUMsWUFBQUEsQ0FBQyxHQUFHUyxNQUFKO0FBRUg7QUFDSjtBQUNKLE9BWkQ7QUFhSDtBQUNKLEdBaEJELE1BaUJLO0FBQ0Q7QUFDQSxTQUFLLElBQUlULENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdTLE1BQXBCLEVBQTRCVCxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCVCxNQUFBQSxNQUFNLENBQUNlLFVBQVAsQ0FBa0JrQyxPQUFsQixDQUEwQixVQUFBQyxJQUFJLEVBQUk7QUFDOUI7QUFDaEI7QUFDQTtBQUNBO0FBQ2dCLFlBQUlBLElBQUksQ0FBQ3RDLENBQUwsS0FBV0YsVUFBVSxDQUFDRSxDQUF0QixJQUEyQnNDLElBQUksQ0FBQ3JDLENBQUwsS0FBWUgsVUFBVSxDQUFDRyxDQUFYLEdBQWUsQ0FBMUQsRUFBOEQ7QUFDMUQsY0FBSXFDLElBQUksQ0FBQ3BDLFFBQVQsRUFBbUI7QUFDakI7QUFDRXlDLFlBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0E5QyxZQUFBQSxDQUFDLEdBQUdTLE1BQUo7QUFDSDtBQUNKO0FBQ0osT0FaRDtBQWFIO0FBQ0o7O0FBQ0QsU0FBT3FDLFVBQVA7QUFDSCxDQXhDTTtBQTBDQSxJQUFNWCxtQkFBbUIsR0FBRyxTQUF0QkEsbUJBQXNCLENBQUE3QyxPQUFPLEVBQUk7QUFDMUMsTUFBTWEsQ0FBQyxHQUFHMEIsc0RBQVMsQ0FBQ3ZDLE9BQUQsQ0FBbkI7QUFDQSxNQUFNYyxDQUFDLEdBQUd5QixzREFBUyxDQUFDdkMsT0FBRCxDQUFuQjtBQUNBLFNBQU87QUFBQ2EsSUFBQUEsQ0FBQyxFQUFEQSxDQUFEO0FBQUdDLElBQUFBLENBQUMsRUFBREE7QUFBSCxHQUFQO0FBQ0gsQ0FKTTs7Ozs7Ozs7Ozs7Ozs7O0FDN0xQO0FBQ0E7QUFDQTtBQUNPLElBQU1iLE1BQU0sR0FBRztBQUNsQndELEVBQUFBLElBQUksRUFBRSxFQURZO0FBRWxCekMsRUFBQUEsVUFBVSxFQUFFLEVBRk07QUFHbEIwQyxFQUFBQSxTQUFTLEVBQUUsSUFITztBQUlsQnRFLEVBQUFBLFNBQVMsRUFBRTtBQUpPLENBQWYsRUFPUDs7QUFFTyxJQUFNWCxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFBZ0YsSUFBSSxFQUFJO0FBQ2hDLE1BQU1FLFNBQVMsR0FBRyxJQUFJeEQsTUFBSixFQUFsQjtBQUNBd0QsRUFBQUEsU0FBUyxDQUFDM0MsVUFBVixHQUF1QixFQUF2QjtBQUNBMkMsRUFBQUEsU0FBUyxDQUFDRCxTQUFWLEdBQXNCLElBQXRCO0FBQ0FDLEVBQUFBLFNBQVMsQ0FBQ3ZFLFNBQVYsR0FBc0IsRUFBdEI7QUFDQXVFLEVBQUFBLFNBQVMsQ0FBQ0YsSUFBVixHQUFpQkEsSUFBakI7QUFDQSxTQUFPRSxTQUFQO0FBQ0gsQ0FQTTs7Ozs7Ozs7Ozs7Ozs7QUNaQSxJQUFNcEIsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQXFCLEdBQUcsRUFBSTtBQUM1QixTQUFPQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxNQUFMLEtBQWdCSCxHQUEzQixJQUFrQyxDQUF6QztBQUNILENBRk07Ozs7Ozs7Ozs7Ozs7OztBQ0FQO0FBQ0E7QUFDQTtBQUVPLElBQU1oQixJQUFJLEdBQUc7QUFDaEJ6QixFQUFBQSxNQUFNLEVBQUUsQ0FEUTtBQUVoQjZDLEVBQUFBLE1BQU0sRUFBRSxLQUZRO0FBR2hCQyxFQUFBQSxRQUFRLEVBQUUsRUFITTtBQUloQkMsRUFBQUEsSUFBSSxFQUFFLEVBSlU7QUFLaEJaLEVBQUFBLE1BTGdCLGtCQUtUYSxNQUxTLEVBS0RDLE1BTEMsRUFLTztBQUNuQixTQUFLSCxRQUFMLENBQWNoRCxJQUFkLENBQW1CO0FBQUNKLE1BQUFBLENBQUMsRUFBRXNELE1BQUo7QUFBWXJELE1BQUFBLENBQUMsRUFBRXNEO0FBQWYsS0FBbkI7QUFDSDtBQVBlLENBQWIsRUFVUDtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVPLElBQU05QixVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFDbkIsTUFBRCxFQUFTK0MsSUFBVCxFQUFrQjtBQUN4QyxNQUFNRyxPQUFPLEdBQUcsSUFBSWxFLE1BQUosRUFBaEI7QUFDQWtFLEVBQUFBLE9BQU8sQ0FBQ2xELE1BQVIsR0FBaUJBLE1BQWpCO0FBQ0FrRCxFQUFBQSxPQUFPLENBQUNILElBQVIsR0FBZUEsSUFBZjtBQUNBRyxFQUFBQSxPQUFPLENBQUNMLE1BQVIsR0FBaUIsS0FBakI7QUFDQUssRUFBQUEsT0FBTyxDQUFDSixRQUFSLEdBQW1CLEVBQW5COztBQUNBSSxFQUFBQSxPQUFPLENBQUNmLE1BQVIsR0FBaUIsVUFBQ2EsTUFBRCxFQUFTQyxNQUFULEVBQW1CO0FBQ2hDQyxJQUFBQSxPQUFPLENBQUNKLFFBQVIsQ0FBaUJoRCxJQUFqQixDQUFzQjtBQUFFSixNQUFBQSxDQUFDLEVBQUVzRCxNQUFMO0FBQWFyRCxNQUFBQSxDQUFDLEVBQUVzRDtBQUFoQixLQUF0QjtBQUNILEdBRkQ7O0FBR0EsU0FBT0MsT0FBUDtBQUNILENBVk07QUFZUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hEQTtBQUMwRztBQUNqQjtBQUN6Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0Esc0RBQXNELGlCQUFpQixrQkFBa0IsMEJBQTBCLEtBQUsscUJBQXFCLGdCQUFnQixrQkFBa0Isa0JBQWtCLEtBQUssMEJBQTBCLDhCQUE4QixLQUFLLGlCQUFpQixLQUFLLGlCQUFpQixTQUFTLG9DQUFvQyxLQUFLLHNCQUFzQixLQUFLLHNCQUFzQixLQUFLLHlCQUF5QixvQkFBb0IscUJBQXFCLHVCQUF1QixrQkFBa0Isa0NBQWtDLDhCQUE4QixLQUFLLDRCQUE0QixrQ0FBa0MsS0FBSyx5QkFBeUIsb0JBQW9CLHFCQUFxQix1QkFBdUIsa0JBQWtCLGtDQUFrQyxnQ0FBZ0MsOEJBQThCLFNBQVMsK0JBQStCLGtDQUFrQyxLQUFLLDRCQUE0QixvQkFBb0IscUJBQXFCLHVCQUF1QixrQkFBa0Isa0NBQWtDLDhCQUE4QixrQ0FBa0MsS0FBSyxrQ0FBa0Msa0NBQWtDLEtBQUsseUJBQXlCLG9CQUFvQixxQkFBcUIsdUJBQXVCLGtCQUFrQixrQ0FBa0MsOEJBQThCLG1DQUFtQyxLQUFLLCtCQUErQixrQ0FBa0MsS0FBSyxjQUFjLG9CQUFvQixxQkFBcUIsc0JBQXNCLEtBQUssZUFBZSxpQkFBaUIsa0JBQWtCLHNCQUFzQix1QkFBdUIsS0FBSyxjQUFjLGVBQWUsZ0JBQWdCLHdCQUF3QiwrQkFBK0IsaUJBQWlCLGFBQWEsY0FBYyxvQkFBb0IsS0FBSyxPQUFPLGtGQUFrRixVQUFVLFVBQVUsWUFBWSxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLE1BQU0sTUFBTSxNQUFNLEtBQUssTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGNBQWMsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxVQUFVLFVBQVUsWUFBWSxhQUFhLFdBQVcsVUFBVSxVQUFVLFVBQVUscUNBQXFDLGlCQUFpQixrQkFBa0IsMEJBQTBCLEtBQUsscUJBQXFCLGdCQUFnQixrQkFBa0Isa0JBQWtCLEtBQUssMEJBQTBCLDhCQUE4QixLQUFLLGlCQUFpQixLQUFLLGlCQUFpQixTQUFTLG9DQUFvQyxLQUFLLHNCQUFzQixLQUFLLHNCQUFzQixLQUFLLHlCQUF5QixvQkFBb0IscUJBQXFCLHVCQUF1QixrQkFBa0Isa0NBQWtDLDhCQUE4QixLQUFLLDRCQUE0QixrQ0FBa0MsS0FBSyx5QkFBeUIsb0JBQW9CLHFCQUFxQix1QkFBdUIsa0JBQWtCLGtDQUFrQyxnQ0FBZ0MsOEJBQThCLFNBQVMsK0JBQStCLGtDQUFrQyxLQUFLLDRCQUE0QixvQkFBb0IscUJBQXFCLHVCQUF1QixrQkFBa0Isa0NBQWtDLDhCQUE4QixrQ0FBa0MsS0FBSyxrQ0FBa0Msa0NBQWtDLEtBQUsseUJBQXlCLG9CQUFvQixxQkFBcUIsdUJBQXVCLGtCQUFrQixrQ0FBa0MsOEJBQThCLG1DQUFtQyxLQUFLLCtCQUErQixrQ0FBa0MsS0FBSyxjQUFjLG9CQUFvQixxQkFBcUIsc0JBQXNCLEtBQUssZUFBZSxpQkFBaUIsa0JBQWtCLHNCQUFzQix1QkFBdUIsS0FBSyxjQUFjLGVBQWUsZ0JBQWdCLHdCQUF3QiwrQkFBK0IsaUJBQWlCLGFBQWEsY0FBYyxvQkFBb0IsS0FBSyxtQkFBbUI7QUFDOTlJO0FBQ0EsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7Ozs7O0FDUDFCO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsaUJBQWlCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JHYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsY0FBYztBQUNyRTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZuQixNQUErRjtBQUMvRixNQUFxRjtBQUNyRixNQUE0RjtBQUM1RixNQUErRztBQUMvRyxNQUF3RztBQUN4RyxNQUF3RztBQUN4RyxNQUFxRztBQUNyRztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHdGQUFPOzs7O0FBSStDO0FBQ3ZFLE9BQU8saUVBQWUsd0ZBQU8sSUFBSSwrRkFBYyxHQUFHLCtGQUFjLFlBQVksRUFBQzs7Ozs7Ozs7Ozs7QUMxQmhFO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNkJBQTZCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUN2R2E7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3RDYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLEtBQXdDLEdBQUcsc0JBQWlCLEdBQUcsQ0FBSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1hhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pELElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDckVhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2dhbWVMb29wLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvZ3JpZC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcGxhY2VTaGlwcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3JhbmRHZW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvbXlzdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvaG9tZS5odG1sIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvbXlzdHlsZS5jc3M/ZGQ1MCIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVBsYXllciB9IGZyb20gJy4vcGxheWVyLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlR3JpZCB9IGZyb20gJy4vZ3JpZC5qcyc7IFxyXG5pbXBvcnQgeyBwbGFjZUFsbFNoaXBzIH0gZnJvbSAnLi9wbGFjZVNoaXBzLmpzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcGxheWVyT25lID0gY3JlYXRlUGxheWVyKCdwbGF5ZXIxJyk7XHJcbiAgICBjb25zdCBwbGF5ZXJPbmVBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcjFBcmVhJyk7XHJcbiAgICBwbGF5ZXJPbmVBcmVhLmFwcGVuZENoaWxkKGdlbmVyYXRlR3JpZCgxMCwgcGxheWVyT25lKSk7XHJcbiAgICBwbGFjZUFsbFNoaXBzKHBsYXllck9uZSwgMTApXHJcbiAgICBjb25zb2xlLmxvZyhwbGF5ZXJPbmUuc2hpcEFycmF5KTtcclxuXHJcblxyXG4gICAgY29uc3QgcGxheWVyVHdvID0gY3JlYXRlUGxheWVyKCdjb21wdXRlcicpO1xyXG4gICAgY29uc3QgcGxheWVyVHdvQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXIyQXJlYScpO1xyXG4gICAgcGxheWVyVHdvQXJlYS5hcHBlbmRDaGlsZChnZW5lcmF0ZUdyaWQoMTAsIHBsYXllclR3bykpO1xyXG4gICAgcGxhY2VBbGxTaGlwcyhwbGF5ZXJUd28sIDEwKVxyXG4gICAgY29uc29sZS5sb2cocGxheWVyVHdvLnNoaXBBcnJheSk7XHJcbn0iLCIvL0dlbmVyYXRlIGdyaWQgZm9yIGVhY2ggcGxheWVyXHJcbi8vR3JpZCBrZWVwcyB0cmFjayBvZiB3aGV0aGVyIHRoZSBwbGF5ZXIncyBzaGlwIGFyZSBhbGwgc3VuayBvciBub3QuIFxyXG4vL0VhY2ggc3F1YXJlIHVuaXQgaXMgcmVuZGVyZWQgYnkgYSBkaXYuICBcclxuLy9FYWNoIHNxdWFyZSBpcyBpZGVudGlmaWVkIGJ5IGEgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIElEXHJcbi8vVXNlIGFuIGFycmF5IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBzcXVhcmUgdW5pdHM/IEl0IHdvdWxkIGJlIGFuIGFycmF5IG9mIGFycmF5cyBcclxuLy9BIG1hc3RlciBhcnJheSBjb25zaXN0IG9mIGFycmF5cyBvZiByb3dzXHJcbi8vRWFjaCBvZiB0aGUgY2hpbGQgYXJyYXkgcmVwcmVzZW50cyBhIHJvdyBhbmQgY29uc2lzdHMgb2YgaW5kaXZpZHVhbCB1bml0cyBvZiBhIGNvbHVtbiBcclxuLy9FYWNoIHNxdWFyZSB1bml0IGlzIGFuIG9iamVjdCBcclxuLy9jb250YWlucyB4LHkgY29vcmRpbmF0ZXMgXHJcbi8vSGFzIGEgYm9vbGVhbiB2YWx1ZSBvZiB3aGV0aGVyIHRoZSBhcmVhIGl0IHJlcHJlc2VudHMgaGF2ZSBiZWVuIGhpdCBmb3Igbm90LiBcclxuXHJcbmV4cG9ydCBjb25zdCBncmlkID0ge1xyXG4gICAgZWxlbWVudDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcbiAgICBzZXRHcmlkKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2dyaWQnKVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuLy9Ob24taGl0IHNxdWFyZXMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgXHJcbmV4cG9ydCBjb25zdCBzcXVhcmVVbml0ID0ge1xyXG4gICAgdW5pdDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIFxyXG4gICAgaGl0OiBmYWxzZSwgXHJcbiAgICBpc0VtcHR5OiB0cnVlLFxyXG4gICBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlR3JpZCA9IChjb2x1bW5zLCBwbGF5ZXIpID0+IHtcclxuICAgIHZhciBuZXdncmlkID0gT2JqZWN0LmNyZWF0ZShncmlkKTsgXHJcbiAgICBuZXdncmlkLnNldEdyaWQoKTsgXHJcbiAgICBpZiAoY29sdW1ucyA8IDEwKSB7XHJcbiAgICAgICAgY29sdW1ucyA9IDEwOyBcclxuICAgIH1cclxuICAgIGdlbmVyYXRlUm93KG5ld2dyaWQuZWxlbWVudCwgY29sdW1ucywgY29sdW1ucywgcGxheWVyKTsgXHJcbiAgICByZXR1cm4gbmV3Z3JpZC5lbGVtZW50OyBcclxufVxyXG5cclxuLy9UaGlzIGZ1bmN0aW9uIG5vdCBvbmx5IGdlbmVyYXRlcyB0aGUgcm93cyBvZiB0aGUgZ3JpZCwgXHJcbi8vYnV0IGlzIGFsc28gcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgdGhlIHNxdWFyZXMgZm9yIGhvbGRpbmcgaW1wb3J0YW50IGluZm9ybWF0aW9uIHN1Y2ggYXMgd2hldGhlciBvciBub3QgYSBzcXVhcmUgaXMgZW1wdHkgXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVJvdyA9ICh0YXJnZXRHcmlkLCBjb2x1bW4sIGNvdW50LCBwbGF5ZXIpID0+IHtcclxuICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgXHJcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncm93Jyk7IFxyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbHVtbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBpICsgJywnICsgY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7XHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlLCBcclxuICAgICAgICAgICAgICAgIHg6IGksXHJcbiAgICAgICAgICAgICAgICB5OiBjb3VudCwgXHJcbiAgICAgICAgICAgICAgICBoaXQ6IGZhbHNlLCBcclxuICAgICAgICAgICAgICAgIG9jY3VwaWVkOiBmYWxzZSwgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkucHVzaChhcmVhKTsgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChnZW5lcmF0ZVNxdWFyZShwbGF5ZXIuYm9hcmRBcnJheVtwbGF5ZXIuYm9hcmRBcnJheS5sZW5ndGggLSAxXSwgY29vcmRpbmF0ZS50b1N0cmluZygpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3JvdycpOyBcclxuICAgICAgICB0YXJnZXRHcmlkLmFwcGVuZENoaWxkKHJvdyk7XHJcbiAgICAgICAgZ2VuZXJhdGVSb3codGFyZ2V0R3JpZCwgY29sdW1uLCBjb3VudCAtIDEsIHBsYXllcilcclxuICAgICAgICBcclxuICAgIH1cclxuICAgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVNxdWFyZSA9IChhcmVhLCBJRCkgPT4ge1xyXG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IFxyXG4gICAgc3F1YXJlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZW1wdHlTcXVhcmUnKTsgXHJcbiAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdpZCcsIElEKTsgXHJcblxyXG4gICAgLy90byBzaG93IHRoZSBjb29yZGluYXRlcyBvbiByZW5kZXJcclxuICAgIGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBkaXNwbGF5LnN0eWxlLm1hcmdpbiA9ICdhdXRvJzsgXHJcbiAgICBkaXNwbGF5LmlubmVySFRNTCA9IElEOyBcclxuICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkaXNwbGF5KVxyXG5cclxuICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBpZiAoIWFyZWEuaGl0KSB7XHJcbiAgICAgICAgICAgIGFyZWEuaGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKGFyZWEub2NjdXBpZWQpXHJcbiAgICAgICAgICAgICAgICBoaXRPY2N1cGllZChzcXVhcmUpOyAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGhpdEVtcHR5KHNxdWFyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICBcclxuICAgIHJldHVybiBzcXVhcmU7IFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaGl0RW1wdHkgPSAoc3F1YXJlKSA9PiB7XHJcbiAgICBzcXVhcmUuY2xhc3NMaXN0LnRvZ2dsZSgnaGl0RW1wdHlTcXVhcmUnKTtcclxuICAgIGlmIChzcXVhcmUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdjbGFzcycsICdkb3QnKVxyXG4gICAgICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkb3QpO1xyXG4gICAgfSBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhpdE9jY3VwaWVkID0gKHNxdWFyZSkgPT4ge1xyXG4gICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ29jY3VwaWVkU3F1YXJlJyk7XHJcbiAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnaGl0T2NjdXBpZWRTcXVhcmUnKTtcclxuICAgIGlmIChzcXVhcmUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdjbGFzcycsICdkb3QnKVxyXG4gICAgICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkb3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG4iLCJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgJy4vc2hpcC5qcyc7IFxyXG5pbXBvcnQgeyBnZW5lcmF0ZUdyaWQgfSBmcm9tICcuL2dyaWQuanMnOyBcclxuaW1wb3J0ICcuL215c3R5bGUuY3NzJztcclxuaW1wb3J0IHsgc3RhcnRHYW1lIH0gZnJvbSAnLi9nYW1lTG9vcC5qcyc7XHJcbi8vaW1wb3J0IHsgZ2VuZXJhdGVDb29yZGluYXRlcyB9IGZyb20gJy4vcGxhY2VTaGlwcy5qcyc7XHJcblxyXG4vL2ZvciB3YXRjaGluZyB0aGUgaHRtbCBmaWxlIFxyXG5yZXF1aXJlKCcuL2hvbWUuaHRtbCcpXHJcblxyXG5zdGFydEdhbWUoKTtcclxuXHJcbi8vY29uc3Qgc2FtcGxlR3JpZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXIxQXJlYScpOyBcclxuLy9zYW1wbGVHcmlkLmFwcGVuZENoaWxkKGdlbmVyYXRlR3JpZCgxMCkpO1xyXG5cclxuXHJcblxyXG4iLCIvL2ltcG9ydCB7Y3JlYXRlU2hpcCwgY3JlYXRlQ2FycmllciwgY3JlYXRlQmF0dGxlc2hpcCwgY3JlYXRlRGVzdHJveWVyLCBjcmVhdGVTdWJtYXJpbmUsIGNyZWF0ZVBhdHJvbCB9IGZyb20gJy4vc2hpcC5qcyc7IFxyXG5pbXBvcnQgeyBjcmVhdGVTaGlwIH0gZnJvbSAnLi9zaGlwLmpzJzsgXHJcbmltcG9ydCB7IGdlblJhbmRvbSB9IGZyb20gJy4vcmFuZEdlbi5qcyc7IFxyXG4vL1RoaXMgc2hvdWxkIGlkZW50aWZ5IHdoaWNoIGdyaWQgdG8gcGxhY2UgdGhlIHNoaXBzIGluXHJcbi8vSXQgc2hvdWxkIHJhbmRvbWl6ZSB0aGUgcGxhY2VtZW50LlxyXG4vL2l0IHNob3VsZCByZWNvZ25pemUgdGhlIGVkZ2VzIG9mIHRoZSBnaXJkIGFuZCBrbm93IG5vdCB0byBwbGFjZSBzaGlwcyB0aGF0IGdvZXMgYmV5b25kIHRoZSBlZGdlIFxyXG4vL2l0IHNob3VsZCBrbm93IG5vdCB0byBvdmVybGFwIHRoZSBzaGlwcyBcclxuXHJcbi8vRnVuY3Rpb25cclxuLy9EZXRlcm1pbmUgd2hhdCBzaGlwIGl0IHdpbGwgY3JlYXRlXHJcbi8vSWRlbnRpZnkgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBcclxuLy9Mb29wOiBcclxuLy9HZW5lcmF0ZSByYW5kb20gbnVtYmVycyBmb3IgeCBhbmQgeSBjb29yZGluYXRlcyBcclxuLy9EZXRlcm1pbmUgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSByaWdodCBiYXNlZCBvbiB0aGUgZm9sbG93aW5nIGNyaXRlcmlhXHJcbi8vMS4pIFRoZSBzaGlwIGRvZXMgbm90IGdvIG91dCBvZiBib3VuZHMgb2YgdGhlIGdyaWQgXHJcbi8vMi4pIFRoZSBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW5vdGhlciBzaGlwIFxyXG4vL0JyZWFrIHRoZSBsb29wIHdoZW4gdGhlIHNoaXAgYXBwcm9wcmlhdGVseSBwbGFjZWQgXHJcblxyXG4vL0hvdyBkb2VzIHRoZSBnYW1lIGlkZW50aWZ5IHRoZSBvd25lcnNoaXAgb2YgdGhlIHNoaXA/XHJcblxyXG5leHBvcnQgY29uc3QgcGxhY2VBbGxTaGlwcyA9IChwbGF5ZXIsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdjYXJyaWVyJywgNSwgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdiYXR0bGVzaGlwJywgNCwgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdkZXN0cm95ZXInLCAzLCBncmlkTGVuZ3RoKVxyXG4gICAgcGxhY2VTaGlwKHBsYXllciwgJ3N1Ym1hcmluZScsIDMsIGdyaWRMZW5ndGgpXHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAncGF0cm9sIGJvYXQnLCAyLCBncmlkTGVuZ3RoKVxyXG4gICAgcGxhY2VTaGlwKHBsYXllciwgJ3BhdHJvbCBib2F0JywgMiwgZ3JpZExlbmd0aClcclxufVxyXG5cclxuLy9wbGFjZXMgdGhlIHBsYXllcnMgc2hpcFxyXG4vL1RoZXJlIHNob3VsZCBiZSBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRoYXQgcGxhY2VzIHRoZSBjb21wdXRlcidzIHNoaXAuIFxyXG4vL2dyaWRMZW5ndGggaXMgdGhlIG51bWJlciBvZiBjb2x1bW5zIG9uIHRoZSBwbGF5ZXIncyBib2FyZCBcclxuZXhwb3J0IGNvbnN0IHBsYWNlU2hpcCA9IChwbGF5ZXIsIHNoaXBUeXBlLCBsZW5ndGgsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIHZhciBwb3NpdGlvbmVkID0gZmFsc2U7IFxyXG4gICAgY29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoLCBzaGlwVHlwZSk7IFxyXG4gICAgd2hpbGUgKCFwb3NpdGlvbmVkKSB7XHJcbiAgICAgICAgdmFyIGNvb3JkaW5hdGUgPSBnZW5lcmF0ZUNvb3JkaW5hdGVzKGdyaWRMZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vSWYgMSwgcHJvZ3JhbXMgdHJpZXMgdG8gc2VlIGlmIHNoaXAgY2FuIGJlIHBsYWNlZCBob3Jpem9udGFsbHkgZmlyc3QsIHRoZW4gdmVydGljYWxseVxyXG4gICAgICAgIC8vSWYgMiwgcHJvZ3JhbXMgdHJpZXMgdG8gc2VlIGlmIHNoaXAgY2FuIGJlIHBsYWNlZCB2ZXJ0aWNhbGx5IGZpcnN0LCB0aGVuIGhvcml6b250YWxseVxyXG4gICAgICAgIHZhciBvcmllbnRhdGlvbiA9IGdlblJhbmRvbSgyKTtcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IDEpIHtcclxuICAgICAgICAgICAgcG9zaXRpb25lZCA9IGhvcml6VGhlblZlcnQocGxheWVyLCBjb29yZGluYXRlLCBzaGlwLCBsZW5ndGgsIGdyaWRMZW5ndGgpIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gMikge1xyXG4gICAgICAgICAgICBwb3NpdGlvbmVkID0gdmVydFRoZW5Ib3JpeihwbGF5ZXIsIGNvb3JkaW5hdGUsIHNoaXAsIGxlbmd0aCwgZ3JpZExlbmd0aCkgXHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgfVxyXG59IFxyXG5cclxuY29uc3QgaG9yaXpUaGVuVmVydCA9IChwbGF5ZXIsIGNvb3JkaW5hdGUsIHNoaXAsIGxlbmd0aCwgZ3JpZExlbmd0aCkgPT4ge1xyXG4gICAgLy9pZiB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkIGhvcml6b250YWxseSB3aXRob3V0IGdvaW5nIG91dCBvZiBib3VuZHMuIFxyXG4gICAgaWYgKGNvb3JkaW5hdGUueCArIGxlbmd0aCA8PSBncmlkTGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCFpc0l0T2NjdXBwaWVkKHBsYXllciwgY29vcmRpbmF0ZSwgbGVuZ3RoLCB0cnVlKSkge1xyXG4gICAgICAgICAgICAvL2NvZGUgZm9yIHBsYWNpbmcgc2hpcCBcclxuICAgICAgICAgICAgLy9mdW5jdGlvbiBoYXMgdG8ga2VlcCB0cmFjayBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIHNoaXBcclxuICAgICAgICAgICAgLy9UaGlzIGlzIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gZm9yIGEgZnVuY3Rpb24gdGhhdCBrZWVwcyB0cmFjayBvZiB3aGV0aGVyIGEgc2hpcCBpcyBzdW5rIG9yIG5vdCBcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSAoY29vcmRpbmF0ZS54ICsgaSkgJiYgaXRlbS55ID09PSBjb29yZGluYXRlLnkgJiYgaXRlbS5vY2N1cGllZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VTaGlwUGFydChpdGVtLCBzaGlwKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBzaGlwIG9uY2UgaXQncyBwbGFjZWRcclxuICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vaWYgcGxhY2luZyBzaGlwIGhvcml6b250YWxseSBtYWtlcyBpdCBvdXQgb2YgYm91bmRzLCB0cnkgcGxhY2luZyBpdCB2ZXJ0aWNhbGx5XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoY29vcmRpbmF0ZS55IC0gbGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzSXRPY2N1cHBpZWQocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNvb3JkaW5hdGUueCAmJiBpdGVtLnkgPT09IChjb29yZGluYXRlLnkgLSBpKSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VTaGlwUGFydChpdGVtLCBzaGlwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8va2VlcCB0cmFjayBvZiB0aGUgc2hpcCBvbmNlIGl0J3MgcGxhY2VkIFxyXG4gICAgICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmIHRoZSBzaGlwIGNhbid0IGJlIHBsYWNlIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5LCByZXJ1biBsb29wOyBcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdmVydFRoZW5Ib3JpeiA9IChwbGF5ZXIsIGNvb3JkaW5hdGUsIHNoaXAsIGxlbmd0aCwgZ3JpZExlbmd0aCkgPT4ge1xyXG4gICAgaWYgKGNvb3JkaW5hdGUueSAtIGxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAoIWlzSXRPY2N1cHBpZWQocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNvb3JkaW5hdGUueCAmJiBpdGVtLnkgPT09IChjb29yZGluYXRlLnkgLSBpKSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZVNoaXBQYXJ0KGl0ZW0sIHNoaXApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZFxyXG4gICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LnB1c2goc2hpcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNvb3JkaW5hdGUueCArIGxlbmd0aCA8PSBncmlkTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gKGNvb3JkaW5hdGUueCArIGkpICYmIGl0ZW0ueSA9PT0gY29vcmRpbmF0ZS55ICYmIGl0ZW0ub2NjdXBpZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbV9jb29yZGluYXRlcyA9IGl0ZW0ueCArICcsJyArIGl0ZW0ueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2Nvb3JkaW5hdGVzKS5jbGFzc0xpc3QudG9nZ2xlKCdvY2N1cGllZFNxdWFyZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ub2NjdXBpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlwLnNldFBvcyhpdGVtLngsIGl0ZW0ueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZFxyXG4gICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LnB1c2goc2hpcClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBwbGFjZVNoaXBQYXJ0ID0gKGl0ZW0sIHNoaXApID0+IHtcclxuICAgIGNvbnN0IGRvbV9jb29yZGluYXRlcyA9IGl0ZW0ueCArICcsJyArIGl0ZW0ueTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbV9jb29yZGluYXRlcykuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHlTcXVhcmUnKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2Nvb3JkaW5hdGVzKS5jbGFzc0xpc3QuYWRkKCdvY2N1cGllZFNxdWFyZScpXHJcbiAgICBpdGVtLm9jY3VwaWVkID0gdHJ1ZTtcclxuICAgIHNoaXAuc2V0UG9zKGl0ZW0ueCwgaXRlbS55KTtcclxufVxyXG5cclxuLy90aGlzIGNhbiBiZSByZXVzZWQgdG8gZGV0ZXJtaW5lIGlmIGhpdCBhcmVhIGlzIG9jY3VwaWVkIG9yIG5vdCBcclxuZXhwb3J0IGNvbnN0IGlzSXRPY2N1cHBpZWQgPSAocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIGhvcml6b250YWwpID0+IHtcclxuICAgLy8gY29uc29sZS5sb2coJ3ggPSAnICsgY29vcmRpbmF0ZS54KVxyXG4gICAvLyBjb25zb2xlLmxvZygneSA9ICcgKyBjb29yZGluYXRlLnkpXHJcbiAgICB2YXIgaXNPY2N1cGllZCA9IGZhbHNlOyBcclxuICAgIGlmIChob3Jpem9udGFsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gKGNvb3JkaW5hdGUueCArIGkpICYmIGl0ZW0ueSA9PT0gY29vcmRpbmF0ZS55KSB7XHJcbiAgICAgICAgICAgICAgICAgIC8qICBjb25zb2xlLmxvZyhcInBsYXllcidzIGNvb3JkaW5hdGVzIChcIiArIGl0ZW0ueCArIFwiLFwiICsgaXRlbS55ICsgXCIpOiBcIiArIGl0ZW0ub2NjdXBpZWQgKyBcIlxcblwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXN0ZWQgY29vcmRpbmF0ZXMgKFwiICsgKGNvb3JkaW5hdGUueCArIGkpICsgXCIsXCIgKyBjb29yZGluYXRlLnkgKyBcIilcIlxyXG4gICAgICAgICAgICAgICAgICAgICkqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm9jY3VwaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJob3Jpem9udGFsOiBcIiArIGl0ZW0ub2NjdXBpZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxlbmd0aDsgXHJcbiAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vaWYgc2hpcCB3ZXJlIHRvIGJlIHBsYWNlZCB2ZXJ0aWNhbGx5XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiKFwiICsgaXRlbS54ICsgXCIsXCIgKyBpdGVtLnkgKyBcIik6IFwiICsgaXRlbS5vY2N1cGllZCArIFwiXFxuXCIgKyBcclxuICAgICAgICAgICAgICAgICAgICBcInRlc3RlZCBjb29yZGluYXRlcyAoXCIgKyBjb29yZGluYXRlLnggKyBcIixcIiArIChjb29yZGluYXRlLnkgLSBpKSArIFwiKVwiKVxyXG4gICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNvb3JkaW5hdGUueCAmJiBpdGVtLnkgPT09IChjb29yZGluYXRlLnkgLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLm9jY3VwaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInZlcnRpY2FsOiBcIiArIGl0ZW0ub2NjdXBpZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gbGVuZ3RoOyAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpc09jY3VwaWVkO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVDb29yZGluYXRlcyA9IGNvbHVtbnMgPT4ge1xyXG4gICAgY29uc3QgeCA9IGdlblJhbmRvbShjb2x1bW5zKTtcclxuICAgIGNvbnN0IHkgPSBnZW5SYW5kb20oY29sdW1ucyk7IFxyXG4gICAgcmV0dXJuIHt4LHl9XHJcbn0gIiwiLy9IYXZlIGFuIDItdGllciBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBzaGlwcyBhbmQgdGhlIGNvb3JkaW5hdGVzIFxyXG4vL1RoZSBzaGlwcyBhcnJheXMgb2YgXHJcbi8vVGhlIGdhbWUgaGFzIHRvIHJlY29nbml6ZSB0aGF0IHRoZSBzaGlwcyBjYW5ub3QgZ28gb3V0IG9mIGJvdW5kcy4gXHJcbmV4cG9ydCBjb25zdCBwbGF5ZXIgPSB7XHJcbiAgICBuYW1lOiAnJywgXHJcbiAgICBib2FyZEFycmF5OiBbXSxcclxuICAgIGJvYXJkTm9kZTogbnVsbCwgXHJcbiAgICBzaGlwQXJyYXk6IFtdLCBcclxufVxyXG5cclxuLy9jb25zdCBzYW1wbGVhcnJheSA9IFtcImNhcnJpZXJcIj0gW10sIFwiYmF0dGxlc2hpcFwiPVtdLCBcImRlc3Ryb3llclwiID0gW10sIFwic3VibWFyaW5lXCIgPSBbXSwgXCJwYXRyb2xcIj1bXV1cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVQbGF5ZXIgPSBuYW1lID0+IHtcclxuICAgIGNvbnN0IG5ld3BsYXllciA9IG5ldyBPYmplY3QoKTtcclxuICAgIG5ld3BsYXllci5ib2FyZEFycmF5ID0gW107XHJcbiAgICBuZXdwbGF5ZXIuYm9hcmROb2RlID0gbnVsbDtcclxuICAgIG5ld3BsYXllci5zaGlwQXJyYXkgPSBbXTsgXHJcbiAgICBuZXdwbGF5ZXIubmFtZSA9IG5hbWU7XHJcbiAgICByZXR1cm4gbmV3cGxheWVyOyBcclxufSIsImV4cG9ydCBjb25zdCBnZW5SYW5kb20gPSBudW0gPT4ge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bSkgKyAxOyBcclxufSIsIi8vR3JpZCBzaG91bGQga2VlcCB0cmFjayBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgZWFjaCBib2F0XHJcbi8vT3B0aW9uOiBLZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc2hpcCdzIGZyb250IGFyZWEgdGhlbiBkZXRlcm1pbmUgd2hldGhlciB0aGUgc2hpcCBpcyBwbGFjZWQgdmVydGljYWxseSBvciBob3Jpem9udGFsbHlcclxuLy9PcHRpb24gMjogS2VlcCB0cmFjayBvZiB0aGUgY29vcmRpbmF0ZXMgb2YgYWxsIHRoZSBzaGlwcyB1bml0c1xyXG5cclxuZXhwb3J0IGNvbnN0IHNoaXAgPSB7XHJcbiAgICBsZW5ndGg6IDAsXHJcbiAgICBpc1N1bms6IGZhbHNlLCBcclxuICAgIHBvc0FycmF5OiBbXSwgXHJcbiAgICB0eXBlOiAnJywgXHJcbiAgICBzZXRQb3MoeF9jb29yLCB5X2Nvb3IpIHtcclxuICAgICAgICB0aGlzLnBvc0FycmF5LnB1c2goe3g6IHhfY29vciwgeTogeV9jb29yfSlcclxuICAgIH0sIFxyXG59XHJcblxyXG4vL1RoaXMgbWV0aG9kIGRvZXNuJ3Qgd29yayBiZWNhdXNlIGZvciBzb21lIHJlYXNvbiwgZWFjaCBzaGlwIHdhcyByZWNvcmRpbmcgZXZlcnkgc2hpcHMgcG9zaXRpb25zLiBcclxuLy9BIHJldmlzZWQgdmVyc2lvbiBpcyB3cml0dGVuIGJlbG93LlxyXG4vKlxyXG5leHBvcnQgY29uc3QgY3JlYXRlU2hpcCA9IChsZW5ndGgsIHR5cGUpID0+IHtcclxuICAgIGNvbnN0IG5ld1NoaXAgPSBPYmplY3QuY3JlYXRlKHNoaXApO1xyXG4gICAgbmV3U2hpcC5sZW5ndGggPSBsZW5ndGg7IFxyXG4gICAgbmV3U2hpcC50eXBlID0gdHlwZTsgXHJcbiAgICByZXR1cm4gbmV3U2hpcDtcclxufSovXHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlU2hpcCA9IChsZW5ndGgsIHR5cGUpID0+IHtcclxuICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgT2JqZWN0KCk7IFxyXG4gICAgbmV3U2hpcC5sZW5ndGggPSBsZW5ndGg7IFxyXG4gICAgbmV3U2hpcC50eXBlID0gdHlwZTsgXHJcbiAgICBuZXdTaGlwLmlzU3VuayA9IGZhbHNlO1xyXG4gICAgbmV3U2hpcC5wb3NBcnJheSA9IFtdO1xyXG4gICAgbmV3U2hpcC5zZXRQb3MgPSAoeF9jb29yLCB5X2Nvb3IpID0+e1xyXG4gICAgICAgIG5ld1NoaXAucG9zQXJyYXkucHVzaCh7IHg6IHhfY29vciwgeTogeV9jb29yIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3U2hpcDtcclxufVxyXG5cclxuLypcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNhcnJpZXIgPSAocG9zaXRpb24pID0+IHtcclxuICAgIHJldHVybiBjcmVhdGVTaGlwKDUsIHBvc2l0aW9uKTsgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVCYXR0bGVzaGlwID0gKHBvc2l0aW9uKSA9PiB7XHJcbiAgICByZXR1cm4gY3JlYXRlU2hpcCg0LCBwb3NpdGlvbik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVEZXN0cm95ZXIgPSAocG9zaXRpb24pID0+IHtcclxuICAgIHJldHVybiBjcmVhdGVTaGlwKDMsIHBvc2l0aW9uKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVN1Ym1hcmluZSA9IChwb3NpdGlvbikgPT4ge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVNoaXAoMywgcG9zaXRpb24pOyBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhdHJvbCA9IChwb3NpdGlvbikgPT4ge1xyXG4gICAgcmV0dXJuIGNyZWF0ZVNoaXAoMiwgcG9zaXRpb24pOyBcclxufVxyXG4qLyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiI2NvbnRhaW5lciB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxuYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG4jaW5uZXJDb250YWluZXIge1xcclxcbndpZHRoOiA5MCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxubWFyZ2luOiBhdXRvOyBcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSwgI3AyWm9uZSB7XFxyXFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSB7XFxyXFxufVxcclxcblxcclxcbiNwMlpvbmUge1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMUFyZWEsICNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIxQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbmRpdi5lbXB0eVNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDUycHg7XFxyXFxuICAgIGhlaWdodDogNTJweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdE9jY3VwaWVkU3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGhlaWdodDogNTBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0T2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1MGFhMDA7IFxcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTBhYTAwO1xcclxcbn1cXHJcXG5cXHJcXG4ucm93IHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbm1hcmdpbi1sZWZ0OiBhdXRvO1xcclxcbm1hcmdpbi1yaWdodDogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLmRvdCB7XFxyXFxud2lkdGg6IDVweDtcXHJcXG5oZWlnaHQ6IDVweDtcXHJcXG5ib3JkZXItcmFkaXVzOiA1cHg7IFxcclxcbmJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7IFxcclxcbm1hcmdpbjogYXV0bztcXHJcXG50b3A6IDUwJTtcXHJcXG5sZWZ0OiA1MCU7XFxyXFxubWFyZ2luLXRvcDogNTAlO1xcclxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbXlzdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7QUFDQSxXQUFXO0FBQ1gsWUFBWTtBQUNaLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsVUFBVTtBQUNWLFlBQVk7QUFDWixZQUFZO0FBQ1o7O0FBRUE7SUFDSSxxQkFBcUI7QUFDekI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0FBQ3pCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6Qix1QkFBdUI7SUFDdkIscUJBQXFCOztBQUV6Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osYUFBYTtBQUNqQjs7QUFFQTtBQUNBLFdBQVc7QUFDWCxZQUFZO0FBQ1osaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBLFVBQVU7QUFDVixXQUFXO0FBQ1gsa0JBQWtCO0FBQ2xCLHlCQUF5QjtBQUN6QixZQUFZO0FBQ1osUUFBUTtBQUNSLFNBQVM7QUFDVCxlQUFlO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiI2NvbnRhaW5lciB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxuYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG4jaW5uZXJDb250YWluZXIge1xcclxcbndpZHRoOiA5MCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxubWFyZ2luOiBhdXRvOyBcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSwgI3AyWm9uZSB7XFxyXFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSB7XFxyXFxufVxcclxcblxcclxcbiNwMlpvbmUge1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMUFyZWEsICNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIxQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbmRpdi5lbXB0eVNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA1MHB4O1xcclxcbiAgICBoZWlnaHQ6IDUwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDUycHg7XFxyXFxuICAgIGhlaWdodDogNTJweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdE9jY3VwaWVkU3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDUwcHg7XFxyXFxuICAgIGhlaWdodDogNTBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0T2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNTBweDtcXHJcXG4gICAgaGVpZ2h0OiA1MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1MGFhMDA7IFxcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTBhYTAwO1xcclxcbn1cXHJcXG5cXHJcXG4ucm93IHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbm1hcmdpbi1sZWZ0OiBhdXRvO1xcclxcbm1hcmdpbi1yaWdodDogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLmRvdCB7XFxyXFxud2lkdGg6IDVweDtcXHJcXG5oZWlnaHQ6IDVweDtcXHJcXG5ib3JkZXItcmFkaXVzOiA1cHg7IFxcclxcbmJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7IFxcclxcbm1hcmdpbjogYXV0bztcXHJcXG50b3A6IDUwJTtcXHJcXG5sZWZ0OiA1MCU7XFxyXFxubWFyZ2luLXRvcDogNTAlO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XHJcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cclxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgICBpZiAoaXRlbVs0XSkge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW1bMl0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmVlZExheWVyKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XHJcblxyXG4gICAgICBpZiAobmVlZExheWVyKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW1bMl0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbVs0XSkge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfSkuam9pbihcIlwiKTtcclxuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cclxuXHJcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cclxuICAgIGlmIChkZWR1cGUpIHtcclxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcclxuXHJcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcclxuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcclxuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xyXG5cclxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtZWRpYSkge1xyXG4gICAgICAgIGlmICghaXRlbVsyXSkge1xyXG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzdXBwb3J0cykge1xyXG4gICAgICAgIGlmICghaXRlbVs0XSkge1xyXG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxpc3QucHVzaChpdGVtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdDtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XHJcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xyXG5cclxuICBpZiAoIWNzc01hcHBpbmcpIHtcclxuICAgIHJldHVybiBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcclxuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcclxuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xyXG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xyXG59OyIsIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcclxcbjxodG1sPlxcclxcbjxoZWFkPlxcclxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCIgLz5cXHJcXG4gICAgPHRpdGxlPk5ldyBQcm9qZWN0PC90aXRsZT5cXHJcXG48L2hlYWQ+XFxyXFxuPGJvZHk+XFxyXFxuICAgIDxkaXYgaWQ9XFxcImNvbnRhaW5lclxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJpbm5lckNvbnRhaW5lclxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwicDFab25lXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwicGxheWVyMUFyZWFcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgaWQ9XFxcInAyWm9uZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcInBsYXllcjJBcmVhXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2JvZHk+XFxyXFxuPC9odG1sPlwiO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgY29kZTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbXlzdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL215c3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcclxuICB2YXIgcmVzdWx0ID0gLTE7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XHJcbiAgICAgIHJlc3VsdCA9IGk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcclxuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xyXG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xyXG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcclxuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xyXG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XHJcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgIHZhciBvYmogPSB7XHJcbiAgICAgIGNzczogaXRlbVsxXSxcclxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXHJcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcclxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXHJcbiAgICAgIGxheWVyOiBpdGVtWzVdXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XHJcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XHJcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XHJcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcclxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxyXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpZGVudGlmaWVycztcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcclxuICBhcGkudXBkYXRlKG9iaik7XHJcblxyXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcclxuICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB1cGRhdGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgbGlzdCA9IGxpc3QgfHwgW107XHJcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcclxuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xyXG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xyXG5cclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XHJcblxyXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xyXG5cclxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xyXG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xyXG5cclxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcclxuICB9O1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIG1lbW8gPSB7fTtcclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcblxyXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XHJcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcclxuXHJcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcclxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xyXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxyXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcclxufVxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuXHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcclxuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XHJcblxyXG4gIGlmICghdGFyZ2V0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xyXG4gIH1cclxuXHJcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XHJcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcclxuICByZXR1cm4gZWxlbWVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xyXG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcclxuXHJcbiAgaWYgKG5vbmNlKSB7XHJcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcclxuICB2YXIgY3NzID0gXCJcIjtcclxuXHJcbiAgaWYgKG9iai5zdXBwb3J0cykge1xyXG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcclxuICB9XHJcblxyXG4gIGlmIChvYmoubWVkaWEpIHtcclxuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xyXG4gIH1cclxuXHJcbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gIGlmIChuZWVkTGF5ZXIpIHtcclxuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcclxuICB9XHJcblxyXG4gIGNzcyArPSBvYmouY3NzO1xyXG5cclxuICBpZiAobmVlZExheWVyKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICBpZiAob2JqLm1lZGlhKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICBpZiAob2JqLnN1cHBvcnRzKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XHJcbiAgfSAvLyBGb3Igb2xkIElFXHJcblxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cclxuXHJcblxyXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcclxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcbn1cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcblxyXG5cclxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcclxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xyXG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XHJcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XHJcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyJdLCJuYW1lcyI6WyJjcmVhdGVQbGF5ZXIiLCJnZW5lcmF0ZUdyaWQiLCJwbGFjZUFsbFNoaXBzIiwic3RhcnRHYW1lIiwicGxheWVyT25lIiwicGxheWVyT25lQXJlYSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhcHBlbmRDaGlsZCIsImNvbnNvbGUiLCJsb2ciLCJzaGlwQXJyYXkiLCJwbGF5ZXJUd28iLCJwbGF5ZXJUd29BcmVhIiwiZ3JpZCIsImVsZW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic2V0R3JpZCIsInNldEF0dHJpYnV0ZSIsInNxdWFyZVVuaXQiLCJ1bml0IiwiaGl0IiwiaXNFbXB0eSIsImNvbHVtbnMiLCJwbGF5ZXIiLCJuZXdncmlkIiwiT2JqZWN0IiwiY3JlYXRlIiwiZ2VuZXJhdGVSb3ciLCJ0YXJnZXRHcmlkIiwiY29sdW1uIiwiY291bnQiLCJyb3ciLCJpIiwiY29vcmRpbmF0ZSIsImFyZWEiLCJ4IiwieSIsIm9jY3VwaWVkIiwiYm9hcmRBcnJheSIsInB1c2giLCJnZW5lcmF0ZVNxdWFyZSIsImxlbmd0aCIsInRvU3RyaW5nIiwiSUQiLCJzcXVhcmUiLCJkaXNwbGF5Iiwic3R5bGUiLCJtYXJnaW4iLCJpbm5lckhUTUwiLCJhZGRFdmVudExpc3RlbmVyIiwiaGl0T2NjdXBpZWQiLCJoaXRFbXB0eSIsImNsYXNzTGlzdCIsInRvZ2dsZSIsImNoaWxkTm9kZXMiLCJkb3QiLCJyZW1vdmUiLCJhZGQiLCJfIiwicmVxdWlyZSIsImNyZWF0ZVNoaXAiLCJnZW5SYW5kb20iLCJncmlkTGVuZ3RoIiwicGxhY2VTaGlwIiwic2hpcFR5cGUiLCJwb3NpdGlvbmVkIiwic2hpcCIsImdlbmVyYXRlQ29vcmRpbmF0ZXMiLCJvcmllbnRhdGlvbiIsImhvcml6VGhlblZlcnQiLCJ2ZXJ0VGhlbkhvcml6IiwiaXNJdE9jY3VwcGllZCIsImZvckVhY2giLCJpdGVtIiwicGxhY2VTaGlwUGFydCIsImRvbV9jb29yZGluYXRlcyIsInNldFBvcyIsImhvcml6b250YWwiLCJpc09jY3VwaWVkIiwibmFtZSIsImJvYXJkTm9kZSIsIm5ld3BsYXllciIsIm51bSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImlzU3VuayIsInBvc0FycmF5IiwidHlwZSIsInhfY29vciIsInlfY29vciIsIm5ld1NoaXAiXSwic291cmNlUm9vdCI6IiJ9