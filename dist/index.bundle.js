"use strict";
(self["webpackChunkwebpack_template"] = self["webpackChunkwebpack_template"] || []).push([["index"],{

/***/ "./src/computerAI.js":
/*!***************************!*\
  !*** ./src/computerAI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getOpponent": () => (/* binding */ getOpponent),
/* harmony export */   "getOpponentShips": () => (/* binding */ getOpponentShips),
/* harmony export */   "runAI": () => (/* binding */ runAI),
/* harmony export */   "hitOpponentArea": () => (/* binding */ hitOpponentArea),
/* harmony export */   "getSquare": () => (/* binding */ getSquare),
/* harmony export */   "hasAlreadyBeenAttacked": () => (/* binding */ hasAlreadyBeenAttacked),
/* harmony export */   "isAreaSecure": () => (/* binding */ isAreaSecure)
/* harmony export */ });
/* harmony import */ var _randGen_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./randGen.js */ "./src/randGen.js");
/* harmony import */ var _placeShips__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeShips */ "./src/placeShips.js");
/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./grid.js */ "./src/grid.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _playCannonAudio_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./playCannonAudio.js */ "./src/playCannonAudio.js");




 //It only needs to keep track of the opponent's ships and board 
//randomly picks coordinates. 
//Need to recognize not to pick hit areas
//When it does hit the opponent's ship, it needs to hit the adjacent areas. 
//Needs to know when it's turn comes up
//Needs to know when the game is over. 
//turn is false when it's the AI's turn 

var memory = {
  //After the AI hits a ship, it comes up with targets it will attack in its next turn 
  //nextTarget[] keeps track of those targets. 
  nextTarget: [],
  //keeps track of next targets that have less priority than the ones in nextTarget[].
  //It's only until the AI does not have any targets in nextTarget[] left that it goes after targets in nextSecondaryTarget[]. 
  nextSecondaryTarget: [],
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
  enemyShips: []
};
var getOpponent = function getOpponent(opponent) {
  memory.opponent = opponent;
};
var getOpponentShips = function getOpponentShips() {
  memory.opponent.shipArray.forEach(function (ship) {
    memory.enemyShips.push(ship);
  });
};

var resetHitCounts = function resetHitCounts() {
  memory.hitCounts = 0;
};

var incrementHitCount = function incrementHitCount() {
  memory.hitCounts += 1;
};

var updateHitCount = function updateHitCount() {
  memory.hitCounts = getLeftOverHitCounts();
  console.log("Updated hitcount = " + memory.hitCounts);
};

var runAI = function runAI(player) {
  if (!player.turnTracker.getTurnStatus()) {
    hitOpponentArea(player);
  }
}; //needs to know the player's board 
//needs to avoid hit areas 
//The function needs to pay special attention to when ships are not sunk yet. 

var hitOpponentArea = function hitOpponentArea(player) {
  var attackArea = false;

  while (!attackArea) {
    var coordinates = decideTarget();

    for (var i = 0; i < memory.opponent.boardArray.length; i++) {
      if (coordinates.x === memory.opponent.boardArray[i].x && coordinates.y === memory.opponent.boardArray[i].y) {
        //  console.log("coordinates.x = " + coordinates.x)
        //  console.log("coordinates.y = " + coordinates.y)
        if (!memory.opponent.boardArray[i].hit) {
          //record the coordinate of the current area the AI is attacking 
          memory.currentTarget = {
            x: coordinates.x,
            y: coordinates.y
          }; //if area does contain the enemy ship 

          var square = getSquare(memory.opponent.name, coordinates.x, coordinates.y);

          if (memory.opponent.boardArray[i].occupied) {
            (0,_grid_js__WEBPACK_IMPORTED_MODULE_2__.hitOccupied)(memory.opponent, square, coordinates.x, coordinates.y);
            incrementHitCount();
            attackArea = true;
            console.log("confirmed hit: " + coordinates.x + "," + coordinates.y);
            memory.confirmedHits.push({
              x: coordinates.x,
              y: coordinates.y
            }); //If AI has the next targets based on a location of a confirmed hit

            if (memory.nextTarget.length !== 0 && memory.nextTarget.length !== undefined) {
              horizOrVert(coordinates.x, coordinates.y);
            } //If AI doesn't have any clue as to the locations of the enemy ships, randomly choose a location 
            else {
              //Enter coordinates of adjacent squares into nextTarget[] 
              chooseValidPotentialTarget(coordinates.x, coordinates.y);
            } //this line is placed here for testing


            memory.previousTarget = {
              x: coordinates.x,
              y: coordinates.y
            };
            memory.identifiedOrientation = true;
            memory.consecutiveHit = true;
            player.turnTracker.toggleTurn();
            console.log("NextTarget[]: ");
            console.log(memory.nextTarget);
            console.log("nextSecondaryTarget: ");
            console.log(memory.nextSecondaryTarget);
          } else {
            (0,_grid_js__WEBPACK_IMPORTED_MODULE_2__.hitEmpty)(square); //this part is problematic

            clearItem(coordinates.x, coordinates.y);
            console.log("Missed: " + coordinates.x + "," + coordinates.y);
            console.log(memory.nextTarget);
            memory.identifiedOrientation = false;
            player.turnTracker.toggleTurn();
            attackArea = true;
          }

          memory.opponent.boardArray[i].hit = true;
        } //if the area has already been hit. 
        else {
          clearItem(coordinates.x, coordinates.y);
          attackArea = false;
        }
      }
    }
  }

  (0,_playCannonAudio_js__WEBPACK_IMPORTED_MODULE_4__.playCannonAudio)();
};
var getSquare = function getSquare(player, x, y) {
  var squareID = player + "-" + x + "," + y;
  var square = document.getElementById(squareID);
  return square;
}; //Makes the AI smarter 
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

var decideTarget = function decideTarget() {
  //If the AI has currently identified the general location of the ship and is attacking it
  if (memory.nextTarget.length !== 0) {
    var nextArea = memory.nextTarget[(0,_randGen_js__WEBPACK_IMPORTED_MODULE_0__.genRandom)(memory.nextTarget.length) - 1]; //   console.log("Current target: ");
    //   console.log(nextArea);

    return nextArea;
  } //If AI doesn't have any clues of the location of the opponent's ships 
  else {
    if (memory.nextSecondaryTarget.length != 0) {
      var _nextArea = memory.nextSecondaryTarget[(0,_randGen_js__WEBPACK_IMPORTED_MODULE_0__.genRandom)(memory.nextSecondaryTarget.length) - 1];
      return _nextArea;
    } else return (0,_placeShips__WEBPACK_IMPORTED_MODULE_1__.generateCoordinates)(10);
  }
}; //Function takes a look at the squares adjacent to the attacked square 
//and determines whether or not to put them in the next target list. 


var chooseValidPotentialTarget = function chooseValidPotentialTarget(x_coor, y_coor) {
  console.log("chooseValidPotentialTarget x = " + x_coor + "; y = " + y_coor);

  if (x_coor + 1 <= 10) {
    if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
      var target = {
        x: x_coor + 1,
        y: y_coor,
        isHoriz: true
      };
      memory.nextTarget.push(target);
    }
  }

  if (x_coor - 1 > 0) {
    if (!hasAlreadyBeenAttacked(x_coor - 1, y_coor)) {
      var _target = {
        x: x_coor - 1,
        y: y_coor,
        isHoriz: true
      };
      memory.nextTarget.push(_target);
    }
  }

  if (y_coor + 1 <= 10) {
    if (!hasAlreadyBeenAttacked(x_coor, y_coor + 1)) {
      var _target2 = {
        x: x_coor,
        y: y_coor + 1,
        isHoriz: false
      };
      memory.nextTarget.push(_target2);
    }
  }

  if (y_coor - 1 > 0) {
    if (!hasAlreadyBeenAttacked(x_coor, y_coor - 1)) {
      var _target3 = {
        x: x_coor,
        y: y_coor - 1,
        isHoriz: false
      };
      memory.nextTarget.push(_target3);
    }
  }
};

var addSecondaryPotentialTargets = function addSecondaryPotentialTargets(x_coor, y_coor) {
  console.log("addSecondaryPotentialTargets x = " + x_coor + "; y = " + y_coor);

  if (x_coor + 1 <= 10) {
    if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
      if (memory.currentTarget.x !== x_coor + 1 && memory.currentTarget.y !== y_coor) {
        var notDuplicate = true;

        for (var i = 0; i < memory.nextTarget.length; i++) {
          if (memory.nextTarget[i].x !== x_coor + 1 && memory.nextTarget[i].y == y_coor) {
            notDuplicate = false;
          }
        }

        for (var i = 0; i < memory.nextSecondaryTarget[i].length; i++) {
          if (memory.nextSecondaryTarget[i].x !== x_coor + 1 && memory.nextSecondaryTarget[i].y == y_coor) {
            notDuplicate = false;
          }
        }

        if (notDuplicate) {
          var target = {
            x: x_coor + 1,
            y: y_coor,
            isHoriz: true
          };
          memory.nextSecondaryTarget.push(target);
        }
      }
    }
  }

  if (x_coor - 1 > 0) {
    if (!hasAlreadyBeenAttacked(x_coor - 1, y_coor)) {
      if (memory.currentTarget.x !== x_coor - 1 && memory.currentTarget.y !== y_coor) {
        var notDuplicate = true;

        for (var i = 0; i < memory.nextTarget[i].length; i++) {
          if (memory.nextyTarget[i].x !== x_coor - 1 && memory.nextTarget[i].y == y_coor) {
            notDuplicate = false;
          }
        }

        for (var i = 0; i < memory.nextSecondaryTarget[i].length; i++) {
          if (memory.nextSecondaryTarget[i].x !== x_coor - 1 && memory.nextSecondaryTarget[i].y == y_coor) {
            notDuplicate = false;
          }
        }

        if (notDuplicate) {
          var _target4 = {
            x: x_coor - 1,
            y: y_coor,
            isHoriz: true
          };
          memory.nextSecondaryTarget.push(_target4);
        }
      }
    }
  }

  if (y_coor + 1 <= 10) {
    if (!hasAlreadyBeenAttacked(x_coor, y_coor + 1)) {
      if (memory.currentTarget.x !== x_coor && memory.currentTarget.y !== y_coor + 1) {
        var notDuplicate = true;

        for (var i = 0; i < memory.nextTarget[i].length; i++) {
          if (memory.nextTarget[i].x !== x_coor && memory.nextTarget[i].y == y_coor + 1) {
            notDuplicate = false;
          }
        }

        for (var i = 0; i < memory.nextSecondaryTarget[i].length; i++) {
          if (memory.nextSecondaryTarget[i].x !== x_coor && memory.nextSecondaryTarget[i].y == y_coor + 1) {
            notDuplicate = false;
          }
        }

        if (notDuplicate) {
          var _target5 = {
            x: x_coor,
            y: y_coor + 1,
            isHoriz: false
          };
          memory.nextSecondaryTarget.push(_target5);
        }
      }
    }
  }

  if (y_coor - 1 > 0) {
    if (!hasAlreadyBeenAttacked(x_coor, y_coor - 1)) {
      if (memory.currentTarget.x !== x_coor && memory.currentTarget.y !== y_coor - 1) {
        var notDuplicate = true;

        for (var i = 0; i < memory.nextTarget[i].length; i++) {
          if (memory.nextTarget[i].x !== x_coor && memory.nextTarget[i].y == y_coor - 1) {
            notDuplicate = false;
          }
        }

        for (var i = 0; i < memory.nextSecondaryTarget[i].length; i++) {
          if (memory.nextSecondaryTarget[i].x !== x_coor && memory.nextSecondaryTarget[i].y == y_coor - 1) {
            notDuplicate = false;
          }
        }

        if (notDuplicate) {
          var _target6 = {
            x: x_coor,
            y: y_coor - 1,
            isHoriz: false
          };
          memory.nextSecondaryTarget.push(_target6);
        }
      }
    }
  }
}; //clears the nextTarget array; 


var clearNextTarget = function clearNextTarget() {
  for (var i = 0; i < memory.nextTarget.length; i++) {
    var discard = memory.nextTarget.pop();
  }

  memory.nextTarget = [];
};

var clearNextSecondaryTarget = function clearNextSecondaryTarget() {
  for (var i = 0; i < memory.nextSecondaryTarget.length; i++) {
    var discard = memory.nextSecondaryTarget.pop();
  }

  memory.nextSecondaryTarget = [];
}; //finds out if a coordinate has already been attacked. 


var hasAlreadyBeenAttacked = function hasAlreadyBeenAttacked(x, y) {
  for (var i = 0; i < memory.opponent.boardArray.length; i++) {
    if (memory.opponent.boardArray[i].x === x && memory.opponent.boardArray[i].y === y) {
      if (memory.opponent.boardArray[i].hit) {
        return true;
      } else {
        return false;
      }

      i = memory.opponent.boardArray.length;
    }
  }
}; //After hitting a ship the 2nd, program should know what the orientation of the ship is. 
//Function compares the x and y coordinates in the parameters with the x and y coordinates stored in previousTarget

var horizOrVert = function horizOrVert(x_coor, y_coor) {
  console.log('HorizORVert x = ' + x_coor + "; y = " + y_coor);
  clearItem(x_coor, y_coor);
  transferToSecondary(); //if y coordinates are the same, it's horizontal

  if (memory.previousTarget.y === y_coor) {
    memory.isHoriz = true; //go right 

    if (x_coor > memory.previousTarget.x) {
      //check to see if the next targeted square is valid for an attack 
      if (x_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(x_coor + 1, y_coor)) {
          memory.nextTarget.push({
            x: x_coor + 1,
            y: y_coor,
            isHoriz: true
          }); //Make sure there is no duplicate in nextSecondaryTarget

          memory.nextSecondaryTarget.forEach(function (item, index, object) {
            if (item.x === x_coor + 1 && item.y === y_coor) {
              object.splice(index, 1);
            }
          });
          findTheEnd(memory.previousTarget.x - 1, memory.previousTarget.y, true, false);
        } //The next target is invalid.
        //Howver, if the current attack was not followed up by announcement of a sunk ship 
        //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
        else {
          findTheEnd(memory.previousTarget.x - 1, memory.previousTarget.y, true, false);
        }
      } else {
        findTheEnd(memory.previousTarget.x - 1, memory.previousTarget.y, true, false);
      }
    } //go left
    else if (x_coor < memory.previousTarget.x) {
      if (x_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(x_coor - 1, y_coor)) {
          memory.nextTarget.push({
            x: x_coor - 1,
            y: y_coor,
            isHoriz: true
          });
          memory.nextSecondaryTarget.forEach(function (item, index, object) {
            if (item.x === x_coor - 1 && item.y === y_coor) {
              object.splice(index, 1);
            }
          });
          findTheEnd(memory.previousTarget.x + 1, memory.previousTarget.y, true, true);
        } //The next target is invalid.
        //Howver, if the current attack was not followed up by announcement of a sunk ship 
        //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
        else {
          findTheEnd(memory.previousTarget.x + 1, memory.previousTarget.y, true, true);
        }
      } else {
        findTheEnd(memory.previousTarget.x + 1, memory.previousTarget.y, true, true);
      }
    }
  } //if x coordinates are the same, it's vertical 
  else if (memory.previousTarget.x === x_coor) {
    memory.isHoriz = false; //Go down

    if (y_coor < memory.previousTarget.y) {
      //check to see if the next targeted square is valid for an attack 
      if (y_coor - 1 > 0) {
        if (!hasAlreadyBeenAttacked(x_coor, y_coor - 1)) {
          memory.nextTarget.push({
            x: x_coor,
            y: y_coor - 1,
            isHoriz: false
          });
          memory.nextSecondaryTarget.forEach(function (item, index, object) {
            if (item.x === x_coor && item.y === y_coor - 1) {
              object.splice(index, 1);
            }
          });
          findTheEnd(memory.previousTarget.x, memory.previousTarget.y + 1, false, true);
        } //The next target is invalid.
        //Howver, if the current attack was not followed up by announcement of a sunk ship 
        //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
        else {
          findTheEnd(memory.previousTarget.x, memory.previousTarget.y + 1, false, true);
        }
      } else {
        findTheEnd(memory.previousTarget.x, memory.previousTarget.y + 1, false, true);
      }
    } //go up
    else if (y_coor > memory.previousTarget.y) {
      if (y_coor + 1 <= 10) {
        if (!hasAlreadyBeenAttacked(x_coor, y_coor + 1)) {
          memory.nextTarget.push({
            x: x_coor,
            y: y_coor + 1,
            isHoriz: false
          });
          memory.nextSecondaryTarget.forEach(function (item, index, object) {
            if (item.x === x_coor && item.y === y_coor + 1) {
              object.splice(index, 1);
            }
          });
          findTheEnd(memory.previousTarget.x, memory.previousTarget.y - 1, false, false);
        } //The next target is invalid.
        //Howver, if the current attack was not followed up by announcement of a sunk ship 
        //...add coordinates of the square that is adjacent to the location of the initial attack of the ship to nextTarget
        else {
          findTheEnd(memory.previousTarget.x, memory.previousTarget.y - 1, false, false);
        }
      } else {
        findTheEnd(memory.previousTarget.x, memory.previousTarget.y - 1, false, false);
      }
    }
  }
  /*
  memory.nextTarget.forEach((item, index, object) => {
      if (memory.isHoriz !== item.isHoriz) {
          memory.nextSecondaryTarget.push(object.splice(index, 1));
      }
  })
  */


  addSecondaryPotentialTargets(x_coor, y_coor);
};

var transferToSecondary = function transferToSecondary() {
  memory.nextTarget.forEach(function (target) {
    memory.nextSecondaryTarget.push({
      x: target.x,
      y: target.y,
      isHoriz: target.isHoriz
    });
  });
  clearNextTarget();
};

var clearItem = function clearItem(x, y) {
  if (memory.nextTarget.length !== 0) {
    memory.nextTarget.forEach(function (item, index, object) {
      if (item.x === x && item.y === y) {
        object.splice(index, 1);
      }
    });
  } else {
    memory.nextSecondaryTarget.forEach(function (item, index, object) {
      if (item.x === x && item.y === y) {
        object.splice(index, 1);
      }
    });
  }
};

var clearSecondaryItem = function clearSecondaryItem(x, y) {
  memory.nextSecondaryTarget.forEach(function (item, index, object) {
    if (item.x === x && item.y === y) {
      object.splice(index, 1);
    }
  });
}; //function to determine if there are still any enemy boats around an area after a boat has been sunk
//When a sunken ship has been announced, the function finds out whether or not there is discripancy 
//...between the hitCounts and the sunken ship's hit points.
//If there is, pass the coordinates of the location of the sunken ship that was initially hit
//..to chooseValidPotentialTarget
//This function is responsible for adding any valid coordinates to be the next targets. 


var isAreaSecure = function isAreaSecure(sunkShip, x_coor, y_coor) {
  console.log("hitCounts = " + (memory.hitCounts + 1));
  console.log("ship length = " + sunkShip.length);
  memory.shipLocated = false; //I had to manually increment memory.hitCounts here because isAreaSecure is executed before the AI increments hitCount in hitOpponentArea()

  if (sunkShip.length !== memory.hitCounts + 1) {
    updateHitCount(); //   attackTheOtherEnd(x_coor, y_coor)
    //   console.log('isAreaSecure memory.previousTarget: ' + "(" + memory.previousTarget.x + "," + memory.previousTarget.y + ")"); 
    //Horizontal 

    if (y_coor === memory.previousTarget.y) {
      if (x_coor > memory.previousTarget.x) {
        findNeighborOfEnd(memory.previousTarget.x - 1, memory.previousTarget.y, true, false);
      } else if (x_coor < memory.previousTarget.x) {
        findNeighborOfEnd(memory.previousTarget.x + 1, memory.previousTarget.y, true, true);
      }
    } //Vertical 
    else if (x_coor === memory.previousTarget.x) {
      if (y_coor > memory.previousTarget.y) {
        findNeighborOfEnd(memory.previousTarget.x, memory.previousTarget.y - 1, false, false);
      } else if (y_coor < memory.previousTarget.y) {
        findNeighborOfEnd(memory.previousTarget.x, memory.previousTarget.y + 1, false, true);
      }
    }
  } else {
    console.log("Area is secure. Clear NextTarget[]. Clear nextSecondaryTarget[]. ");
    clearNextTarget();
    clearNextSecondaryTarget(); //  memory.previousTarget = null; 

    resetHitCounts();
  }
};

var attackTheOtherEnd = function attackTheOtherEnd(x_coor, y_coor) {
  //if the attack pattern was horizontal
  var newX = 0;
  var newY = 0;
  var foundConsecutive = false; //horizontal orientation 

  var directionX = 0;
  var directionY = 0;

  if (memory.previousTarget.y === y_coor && x_coor !== memory.previousTarget.x) {
    if (x_coor > memory.previousTarget.x) {
      directionX = -2;
    } else if (x_coor < memory.previousTarget.x) {
      directionX = 2;
    }
  } //if the attack pattern was vertical 
  else if (memory.previousTarget.x === x_coor && y_coor !== memory.previousTarget.y) {
    if (y_coor > memory.previousTarget.y) {
      directionY = -2;
    } else if (x_coor < memory.previousTarget.x) {
      directionY = 2;
    }
  }

  for (var i = 0; i < memory.confirmedHits.length; i++) {
    if (memory.confirmedHits[i].x === x_coor + directionX && memory.confirmedHits[i].y === y_coor + directionY) {
      newX = x_coor + directionX;
      newY = y_coor + directionY;
      foundConsecutive = true;
      Math.floor(directionX /= 2);
      Math.floor(directionY /= 2);
    }
  }

  if (foundConsecutive) {
    var dontEndLoop = true;
    var foundCons = false;
    var count = 1;
    var consecutiveX = 0;
    var consecutiveY = 0;

    while (dontEndLoop) {
      consecutiveX = newX + directionX * count;
      consecutiveY = newY + directionY * count;

      for (var i = 0; i < memory.confirmedHits.length; i++) {
        if (memory.confirmedHits[i].x === consecutiveX && memory.confirmedHits[i].y === consecutiveY) {
          count++;
          foundCons = true;
        }
      }

      if (!foundCons) {
        dontEndLoop = false;
      } else {
        foundCons = false;
      }
    }

    memory.nextTarget.push({
      x: consecutiveX,
      y: consecutiveY
    });
    console.log("Attack the other end: " + consecutiveX + "," + consecutiveY);
  } else {
    //check to see if the other end is valid 
    console.log("Attack the other end: " + directionX + "," + directionY);
  }
};

var identifyOrientation = function identifyOrientation(x_coor, y_coor) {
  for (var i = 0; i < memory.confirmedHits.length; i++) {
    if (memory.confirmedHits[i].x + 1 === x_coor && memory.confirmedHits[i].y === y_coor) {
      memory.nextTarget.push({
        x: x_coor + 1
      });
    } else if (memory.confirmedHits[i].x - 1 === x_coor && memory.confirmedHits[i].y === y_coor) {} else if (memory.confirmedHits[i].y + 1 === y_coor && memory.confirmedHits[i].x === x_coor) {} else if (memory.confirmedHits[i].y + -1 === y_coor && memory.confirmedHits[i].x === x_coor) {} else {}
  }
};

var chooseTargetBasedOnOrientation = function chooseTargetBasedOnOrientation(x_coor, y_coor) {
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
};

var findTheEnd = function findTheEnd(x_coor, y_coor, isHorizontal, isClimbing) {
  //end conditions:
  //It comes upon a square that has not been attacked
  //it comes upon the edge of the map 
  var moveX = 0;
  var moveY = 0;

  if (isHorizontal && isClimbing && x_coor <= 10) {
    moveX = 1;
  } else if (isHorizontal && !isClimbing && x_coor > 0) {
    moveX = -1;
  } else if (!isHorizontal && isClimbing && y_coor <= 10) {
    moveY = 1;
  } else if (!isHorizontal && !isClimbing && y_coor > 0) {
    moveY = -1;
  }

  for (var i = 0; i < memory.opponent.boardArray.length; i++) {
    if (memory.opponent.boardArray[i].x === x_coor && memory.opponent.boardArray[i].y === y_coor) {
      if (memory.opponent.boardArray[i].hit && memory.opponent.boardArray[i].occupied) {
        var transX = x_coor + moveX;
        var transY = y_coor + moveY;
        console.log("Add Other End Recursion: " + transX + "," + transY);
        findTheEnd(x_coor + moveX, y_coor + moveY, isHorizontal, isClimbing);
      } else if (memory.opponent.boardArray[i].hit && !memory.opponent.boardArray[i].occupied) {//do nothing
      } else {
        memory.nextTarget.push({
          x: x_coor,
          y: y_coor,
          isHoriz: isHorizontal
        });
        clearSecondaryItem(x_coor, y_coor);
        console.log("findTheEnd: " + x_coor + "," + y_coor);
      }
    }
  } //clearSecondaryItem()

}; //This function is similar to findTheEnd(), but it finds the neighboring areas of the end of the ship 


var findNeighborOfEnd = function findNeighborOfEnd(x_coor, y_coor, isHorizontal, isClimbing) {
  var moveX = 0;
  var moveY = 0;

  if (isHorizontal && isClimbing && x_coor <= 10) {
    moveX = 1;
  } else if (isHorizontal && !isClimbing && x_coor > 0) {
    moveX = -1;
  } else if (!isHorizontal && isClimbing && y_coor <= 10) {
    moveY = 1;
  } else if (!isHorizontal && !isClimbing && y_coor > 0) {
    moveY = -1;
  }

  for (var i = 0; i < memory.opponent.boardArray.length; i++) {
    if (memory.opponent.boardArray[i].x === x_coor && memory.opponent.boardArray[i].y === y_coor) {
      if (memory.opponent.boardArray[i].hit && memory.opponent.boardArray[i].occupied) {
        var transX = x_coor + moveX;
        var transY = y_coor + moveY;
        console.log("Add Other End Recursion: " + transX + "," + transY);
        findNeighborOfEnd(x_coor + moveX, y_coor + moveY, isHorizontal, isClimbing);
      } else if (memory.opponent.boardArray[i].hit && !memory.opponent.boardArray[i].occupied) {//do nothing
      } else {
        chooseValidPotentialTarget(x_coor, y_coor);
        clearSecondaryItem(x_coor, y_coor);
        console.log("findNeighborOfEnd: " + x_coor + "," + y_coor);
      }
    }
  }
};

var getLeftOverHitCounts = function getLeftOverHitCounts() {
  //Takes the ships that are partially hit and add their total number of parts that have been hit 
  var totalHit = 0;
  memory.enemyShips.forEach(function (ship) {
    if (ship.hasBeenHit && !ship.isSunk) {
      for (var i = 0; i < ship.posArray.length; i++) {
        if (ship.posArray[i].isHit) {
          totalHit += 1;
        }
      }
    }
  });
  return totalHit;
};

/***/ }),

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
/* harmony import */ var _computerAI_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./computerAI.js */ "./src/computerAI.js");
/* harmony import */ var _turnTracking_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./turnTracking.js */ "./src/turnTracking.js");






var playerOneTurn = true;
var turnMessage = document.getElementById('turnMessage');
var startGame = function startGame() {
  var newGame = new Object();
  newGame.over = false;

  newGame.endGame = function () {
    newGame.over = true;
  };

  var playerOne = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.createPlayer)('playerOne', 'playerTwo', 'playerAreaOne', false);
  var playerTwo = (0,_player_js__WEBPACK_IMPORTED_MODULE_0__.createPlayer)('playerTwo', 'playerOne', 'playerAreaTwo', true); //The following two lines is a way to let both player objects know if a winner is announced. 

  playerOne.setGameObject(newGame);
  playerTwo.setGameObject(newGame);
  (0,_turnTracking_js__WEBPACK_IMPORTED_MODULE_4__.trackTurns)(playerOne, playerTwo);

  if (playerTwo.isComputer) {
    playerTwo.setOpponent(playerOne);
    (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_3__.getOpponent)(playerOne);
    playerOne.isPlayingAgainstAI = true;
    (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_3__.getOpponentShips)();
    (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_3__.runAI)(playerTwo);
  }

  document.getElementById('announcement').innerHTML = '';
  document.getElementById('endGameMessage').innerHTML = '';
  return {
    playerOne: playerOne,
    playerTwo: playerTwo
  };
};

/***/ }),

/***/ "./src/grid.js":
/*!*********************!*\
  !*** ./src/grid.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "squareUnit": () => (/* binding */ squareUnit),
/* harmony export */   "generateGrid": () => (/* binding */ generateGrid),
/* harmony export */   "generateRow": () => (/* binding */ generateRow),
/* harmony export */   "generateSquare": () => (/* binding */ generateSquare),
/* harmony export */   "hitEmpty": () => (/* binding */ hitEmpty),
/* harmony export */   "hitOccupied": () => (/* binding */ hitOccupied)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/ship.js");
/* harmony import */ var _winCondition_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./winCondition.js */ "./src/winCondition.js");
/* harmony import */ var _computerAI_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computerAI.js */ "./src/computerAI.js");
/* harmony import */ var _playCannonAudio_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./playCannonAudio.js */ "./src/playCannonAudio.js");
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




var squareUnit = {
  unit: document.createElement('div'),
  hit: false,
  isEmpty: true
};
var generateGrid = function generateGrid(columns, player) {
  var newgrid = document.createElement('div');
  player.setBoardColumns(columns);
  newgrid.setAttribute('class', 'grid');

  if (columns < 10) {
    columns = 10;
  }

  generateRow(newgrid, columns, columns, player);
  return newgrid;
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
      row.appendChild(generateSquare(player, player.boardArray[player.boardArray.length - 1], coordinate.toString()));
    }

    row.setAttribute('class', 'row');
    targetGrid.appendChild(row);
    generateRow(targetGrid, column, count - 1, player);
  }
};
var generateSquare = function generateSquare(player, area, ID) {
  var square = document.createElement('div');
  square.setAttribute('class', 'emptySquare');
  square.setAttribute('id', player.name + "-" + ID); //to show the coordinates on render

  /*
    const display = document.createElement('p');
    display.style.margin = 'auto'; 
    display.innerHTML = ID; 
    square.appendChild(display)*/

  square.addEventListener('click', function () {
    //turnTracker keeps track of the player's turn everytime they attempt to hit each other's ships
    //If the player hits one of the opponent's ship, he gets another turn.
    if (!area.hit && player.turnBoolID !== player.turnTracker.getTurnStatus() && !player.gameObject.over && !player.isAI) {
      area.hit = true;
      (0,_playCannonAudio_js__WEBPACK_IMPORTED_MODULE_3__.playCannonAudio)();

      if (area.occupied) {
        hitOccupied(player, square, area.x, area.y);
      } else {
        hitEmpty(square);
      }

      player.turnTracker.toggleTurn();
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
var hitOccupied = function hitOccupied(player, square, x_coor, y_coor) {
  if (player.isComputer) {
    square.classList.remove('hitEmptySquare');
  } else {
    square.classList.remove('occupiedSquare');
  }

  square.classList.add('hitOccupiedSquare');

  if (square.childNodes.length === 0) {
    var dot = document.createElement('div');
    dot.setAttribute('class', 'dot');
    square.appendChild(dot);
  }

  var targeted_ship = null;
  player.shipArray.forEach(function (ship) {
    ship.hasBeenHit = true;
    ship.posArray.forEach(function (pos) {
      if (pos.x === x_coor && pos.y === y_coor) {
        pos.isHit = true;
        ship.isSunk = (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.isShipSunk)(player, ship); //if the player is playing against the AI, this notifies the AI of important info
        //...about ship and the coordinates of the confirmed damage location 

        if (player.isPlayingAgainstAI && ship.isSunk) {
          (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_2__.isAreaSecure)(ship, x_coor, y_coor);
        }
      }
    });
  });
  (0,_winCondition_js__WEBPACK_IMPORTED_MODULE_1__.checkShips)(player);
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
/* harmony import */ var _reset_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reset.js */ "./src/reset.js");





 //import { generateCoordinates } from './placeShips.js';
//for watching the html file 

__webpack_require__(/*! ./home.html */ "./src/home.html");

var players = (0,_gameLoop_js__WEBPACK_IMPORTED_MODULE_4__.startGame)();
var startOverButton = document.getElementById('startOverButton');
var playerOneArea = document.getElementById('playerAreaOne');
var playerTwoArea = document.getElementById('playerAreaTwo');
startOverButton.addEventListener('click', function () {
  (0,_reset_js__WEBPACK_IMPORTED_MODULE_5__.delBoard)(playerOneArea);
  (0,_reset_js__WEBPACK_IMPORTED_MODULE_5__.delBoard)(playerTwoArea);
  players["playerOne"].reset();
  players["playerTwo"].reset();
  players = (0,_gameLoop_js__WEBPACK_IMPORTED_MODULE_4__.startGame)();
});

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
  placeShip(player, 'patrol boat1', 2, gridLength);
  placeShip(player, 'patrol boat2', 2, gridLength);
}; //places the players ship
//There should be a separate function that places the computer's ship. 
//gridLength is the number of columns on the player's board 

var placeShip = function placeShip(player, shipType, length, gridLength) {
  //positioned will turn true if the app finds a suitable area to place the ship on the board 
  var positioned = false; //create a new ship object 

  var ship = (0,_ship_js__WEBPACK_IMPORTED_MODULE_0__.createShip)(length, shipType); //Run the the loop until the app finds a suitable position to place the ship on the player's board 

  while (!positioned) {
    var coordinate = generateCoordinates(gridLength); //If 1, programs tries to see if ship can be placed horizontally first, then vertically
    //If 2, programs tries to see if ship can be placed vertically first, then horizontally

    var orientation = (0,_randGen_js__WEBPACK_IMPORTED_MODULE_1__.genRandom)(2);

    if (orientation === 1) {
      // console.log("Ship for placement: " + shipType + "; first-attempt: horizontal ")
      positioned = horizThenVert(player, coordinate, ship, length, gridLength);
    } else if (orientation === 2) {
      // console.log("Ship for placement: " + shipType + "; first attempt: vertical")
      positioned = vertThenHoriz(player, coordinate, ship, length, gridLength);
    }
    /* if (!positioned) {
         console.log('Rerun loop for ' + shipType);
     }*/

  }
};

var horizThenVert = function horizThenVert(player, coordinate, ship, length, gridLength) {
  //if the ship can be placed horizontally without going out of bounds. 
  var validPlacement = false;

  if (coordinate.x + length <= gridLength) {
    if (!isItOccuppied(player, coordinate, length, true)) {
      //code for placing ship 
      //function has to keep track of the coordinates of the ship
      //This is to provide information for a function that keeps track of whether a ship is sunk or not 
      for (var i = 0; i < length; i++) {
        player.boardArray.forEach(function (item) {
          if (item.x === coordinate.x + i && item.y === coordinate.y && item.occupied === false) {
            placeShipPart(player, item, ship, length);
          }
        });
      } //keep track of the ship once it's placed


      player.shipArray.push(ship);
      validPlacement = true;
    } else {
      validPlacement = false;
    }
  } //if placing ship horizontally makes it out of bounds, try placing it vertically
  else {
    if (coordinate.y - length >= 0) {
      if (!isItOccuppied(player, coordinate, length, false)) {
        for (var i = 0; i < length; i++) {
          player.boardArray.forEach(function (item) {
            if (item.x === coordinate.x && item.y === coordinate.y - i && item.occupied === false) {
              placeShipPart(player, item, ship, length);
            }
          });
        } //keep track of the ship once it's placed 


        player.shipArray.push(ship);
        validPlacement = true;
      } else {
        validPlacement = false;
      }
    } //if the ship can't be place horizontally or vertically, rerun loop; 
    else validPlacement = false;
  }

  return validPlacement;
};

var vertThenHoriz = function vertThenHoriz(player, coordinate, ship, length, gridLength) {
  var validPlacement = false;

  if (coordinate.y - length >= 0) {
    if (!isItOccuppied(player, coordinate, length, false)) {
      for (var i = 0; i < length; i++) {
        player.boardArray.forEach(function (item) {
          if (item.x === coordinate.x && item.y === coordinate.y - i && item.occupied === false) {
            placeShipPart(player, item, ship, length);
          }
        });
      } //keep track of the ship once it's placed


      player.shipArray.push(ship);
      validPlacement = true;
    } else {
      validPlacement = false;
    }
  } else {
    if (coordinate.x + length <= gridLength) {
      if (!isItOccuppied(player, coordinate, length, true)) {
        for (var i = 0; i < length; i++) {
          player.boardArray.forEach(function (item) {
            if (item.x === coordinate.x + i && item.y === coordinate.y && item.occupied === false) {
              placeShipPart(player, item, ship, length);
            }
          });
        } //keep track of the ship once it's placed


        player.shipArray.push(ship);
        validPlacement = true;
      }
    } else {
      validPlacement = false;
    }
  }

  return validPlacement;
};

var placeShipPart = function placeShipPart(player, item, ship, length) {
  var dom_coordinates = player.name + '-' + item.x + ',' + item.y;
  var square = document.getElementById(dom_coordinates);

  if (!player.isComputer) {
    document.getElementById(dom_coordinates).classList.remove('emptySquare');
    document.getElementById(dom_coordinates).classList.add('occupiedSquare');
  } else {} //displays ship length on squares

  /*
  const ship_type = document.createElement('p')
  ship_type.innerHTML = length; 
  square.append(ship_type);
  */


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
          /*console.log("player's coordinates (" + item.x + "," + item.y + "): " + item.occupied + "\n" +
              "tested coordinates (" + (coordinate.x + i) + "," + coordinate.y + ")"
          )*/
          if (item.occupied) {
            // console.log("horizontal: " + item.occupied)
            isOccupied = true;
            i = length;
          } //I had to add the following block of code later as an extra measure to check for occupied areas 
          else {
            player.shipArray.forEach(function (ship) {
              ship.posArray.forEach(function (pos) {
                if (pos.x === coordinate.x + i && pos.y === coordinate.y) {
                  isOccupied = true;
                  i = length;
                }
              });
            });
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
        if (item.x === coordinate.x && item.y === coordinate.y - i) {
          if (item.occupied) {
            // console.log("vertical: " + item.occupied)
            isOccupied = true;
            i = length;
          } //I had to add the following block of code later as an extra measure to check for occupied areas 
          else {
            player.shipArray.forEach(function (ship) {
              ship.posArray.forEach(function (pos) {
                if (pos.x === coordinate.x && pos.y === coordinate.y - i) {
                  isOccupied = true;
                  i = length;
                }
              });
            });
          }
        }
      });
    }
  } //  const message = '(' + coordinate.x + "," + coordinate.y + ") " + isOccupied + "; horizontal: " + horizontal + "; Length: " + length; 
  // player.messages.push(message);


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

/***/ "./src/playCannonAudio.js":
/*!********************************!*\
  !*** ./src/playCannonAudio.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "playCannonAudio": () => (/* binding */ playCannonAudio)
/* harmony export */ });
/* harmony import */ var _audio_cannon_shot_1_mp3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./audio/cannon-shot-1.mp3 */ "./src/audio/cannon-shot-1.mp3");
/* harmony import */ var _audio_cannon_shot_2_mp3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./audio/cannon-shot-2.mp3 */ "./src/audio/cannon-shot-2.mp3");
/* harmony import */ var _audio_cannon_shot_3_mp3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audio/cannon-shot-3.mp3 */ "./src/audio/cannon-shot-3.mp3");
/* harmony import */ var _randGen_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./randGen.js */ "./src/randGen.js");





function playCannon1() {
  var CannonOne = new Audio(_audio_cannon_shot_1_mp3__WEBPACK_IMPORTED_MODULE_0__["default"]);
  CannonOne.play();
}

function playCannon2() {
  var CannonTwo = new Audio(_audio_cannon_shot_2_mp3__WEBPACK_IMPORTED_MODULE_1__["default"]);
  CannonTwo.play();
}

function playCannon3() {
  var CannonThree = new Audio(_audio_cannon_shot_3_mp3__WEBPACK_IMPORTED_MODULE_2__["default"]);
  CannonThree.play();
}

var audioArray = [playCannon1, playCannon2, playCannon3];
var playCannonAudio = function playCannonAudio() {
  var choose = (0,_randGen_js__WEBPACK_IMPORTED_MODULE_3__.genRandom)(3) - 1;
  audioArray[choose]();
};

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPlayer": () => (/* binding */ createPlayer)
/* harmony export */ });
/* harmony import */ var _grid_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./grid.js */ "./src/grid.js");
/* harmony import */ var _placeShips_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeShips.js */ "./src/placeShips.js");
//Have an 2-tier array that contains the ships and the coordinates 
//The ships arrays of 
//The game has to recognize that the ships cannot go out of bounds. 
//const samplearray = ["carrier"= [], "battleship"=[], "destroyer" = [], "submarine" = [], "patrol"=[]]


var createPlayer = function createPlayer(name, opponent, container, isAI) {
  var newplayer = new Object();
  newplayer.boardArray = [];
  newplayer.boardColumns = 0;
  newplayer.boardNode = null;
  newplayer.gameObject = null;

  newplayer.setGameObject = function (game) {
    newplayer.gameObject = game;
  }; //Array of all the player's ships


  newplayer.shipArray = [];
  newplayer.name = name;
  newplayer.opponentName = opponent;
  newplayer.opponent = null;

  newplayer.setOpponent = function (opponent) {
    newplayer.opponent = opponent;
  };

  newplayer.isComputer = isAI;
  newplayer.isPlayingAgainstAI = false;
  newplayer.messages = []; //turnTracker is an object shared between players that tracks whose turn it is 

  newplayer.turnTracker = null; //turnBoolID helps to track turns 

  newplayer.turnBoolID = false;

  newplayer.setTurnTracker = function (item, turnID) {
    newplayer.turnTracker = item;
    newplayer.turnBoolID = turnID;
  };

  newplayer.setBoardColumns = function (columns) {
    newplayer.boardColumns = columns;
  };

  newplayer.getBoardColumns = function () {
    return newplayer.boardColumns;
  };

  newplayer.reset = function () {
    while (newplayer.boardArray.length !== 0) {
      var item = newplayer.boardArray.pop();
    }

    newplayer.boardArray = [];
    newplayer.boardNode = null;

    while (newplayer.shipArray.length !== 0) {
      var item = newplayer.shipArray.pop();
    }

    newplayer.shipArray = [];
    newplayer.name = name;

    while (newplayer.messages.length !== 0) {
      var item = newplayer.messages.pop();
    }

    newplayer.messages = [];
  };

  var playerArea = document.getElementById(container);
  playerArea.appendChild((0,_grid_js__WEBPACK_IMPORTED_MODULE_0__.generateGrid)(10, newplayer));
  (0,_placeShips_js__WEBPACK_IMPORTED_MODULE_1__.placeAllShips)(newplayer, 10);
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

/***/ "./src/reset.js":
/*!**********************!*\
  !*** ./src/reset.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "delBoard": () => (/* binding */ delBoard)
/* harmony export */ });
//Delete Dom all relevante dom elements
//Reset player's arrays 
//need to delete grid information 
var delBoard = function delBoard(containerNode) {
  var gridNode = containerNode.childNodes[0];
  var rowNodeArray = gridNode.childNodes;
  rowNodeArray.forEach(function (row) {
    while (row.childNodes.length !== 0) {
      row.removeChild(row.lastElementChild);
    }
  });

  while (gridNode.childNodes.length !== 0) {
    gridNode.removeChild(gridNode.lastElementChild);
  }

  containerNode.removeChild(gridNode);
};

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createShip": () => (/* binding */ createShip),
/* harmony export */   "isShipSunk": () => (/* binding */ isShipSunk)
/* harmony export */ });
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
var createShip = function createShip(length, type) {
  var newShip = new Object();
  newShip.length = length;
  newShip.type = type;
  newShip.isSunk = false;
  newShip.hasBeenHit = false;
  newShip.posArray = [];

  newShip.setPos = function (x_coor, y_coor) {
    newShip.posArray.push({
      x: x_coor,
      y: y_coor,
      isHit: false
    });
  };

  return newShip;
};
var isShipSunk = function isShipSunk(player, ship) {
  var isSunk = true;
  ship.posArray.forEach(function (pos) {
    //if at least one part of the ship is not hit, isSunk is false; 
    if (!pos.isHit) {
      isSunk = false;
    }
  });

  if (isSunk) {
    var announcement = document.getElementById('announcement');
    var message = player.name + "'s " + ship.type + " has been sunk!";
    announcement.innerHTML = message;
  }

  return isSunk;
};

/***/ }),

/***/ "./src/turnTracking.js":
/*!*****************************!*\
  !*** ./src/turnTracking.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "trackTurns": () => (/* binding */ trackTurns)
/* harmony export */ });
/* harmony import */ var _computerAI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./computerAI.js */ "./src/computerAI.js");

var trackTurns = function trackTurns(playerOne, playerTwo) {
  var keepTrack = new Object();
  keepTrack.playerOneTurn = true;

  keepTrack.toggleTurn = function () {
    keepTrack.playerOneTurn = !keepTrack.playerOneTurn;
    keepTrack.displayTurn();

    if (playerTwo.isComputer && !keepTrack.playerOneTurn) {
      setTimeout(function () {
        (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_0__.runAI)(playerTwo);
      }, 2000); //  runAI(playerTwo)
    }
  };

  (keepTrack.displayTurn = function () {
    if (keepTrack.playerOneTurn) {
      console.log("Player one's turn");
      turnMessage.innerHTML = "Player One's Turn";
    } else {
      console.log("Player two's turn");
      turnMessage.innerHTML = "Player Two's Turn";
    }
  })();

  keepTrack.getTurnStatus = function () {
    return keepTrack.playerOneTurn;
  };

  playerOne.setTurnTracker(keepTrack, true);
  playerTwo.setTurnTracker(keepTrack, false);
  return keepTrack;
};

/***/ }),

/***/ "./src/winCondition.js":
/*!*****************************!*\
  !*** ./src/winCondition.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkShips": () => (/* binding */ checkShips)
/* harmony export */ });
var checkShips = function checkShips(player) {
  var allSunk = true;
  player.shipArray.forEach(function (ship) {
    if (!ship.isSunk) {
      allSunk = false;
    }
  });

  if (allSunk) {
    announceWinner(player);
  }
};

var announceWinner = function announceWinner(player) {
  console.log(player);
  document.getElementById('endGameMessage').innerHTML = 'The winner is ' + player.opponentName + "!";
  player.gameObject.endGame();
};

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
___CSS_LOADER_EXPORT___.push([module.id, "#container {\r\nwidth: 100%; \r\nheight: 100%; \r\nalign-content: center;\r\n}\r\n#titleContainer {\r\n    width: 100%;\r\n    text-align: center; \r\n}\r\n\r\n#messageContainer {\r\nwidth: 100%; \r\nalign-content: center;\r\ntext-align: center; \r\n}\r\n\r\n#announcementsContainer {\r\n    min-height: 20px; \r\n    width: 100%;\r\n    text-align: center; \r\n}\r\n\r\n#announcement {\r\n    text-align: center; \r\n}\r\n\r\n#endGameMessageArea {\r\n    min-height: 20px;\r\n    text-align: center; \r\n    width: 100%;\r\n}\r\n\r\n#turnMessage, #endGameMessage {\r\n    text-align: center;\r\n}\r\n\r\n#innerContainer {\r\nwidth: 90%; \r\nheight: 100%; \r\nmargin: auto; \r\njustify-content: space-between;\r\ndisplay: flex; \r\n}\r\n\r\n#p1Zone, #p2Zone {\r\n    display: block;\r\n    text-align: center;\r\n}\r\n\r\n#p1Zone {\r\n}\r\n\r\n#p2Zone {\r\n\r\n}\r\n\r\n#player1Area, #player2Area {\r\n}\r\n\r\n#player1Area {\r\n}\r\n\r\n#player2Area {\r\n}\r\n\r\n#buttonContainer {\r\n    margin-top: 20px;\r\ntext-align: center; \r\nalign-content: center; \r\n}\r\n\r\n#startOverButton {\r\n    font-family: Verdana; \r\n    background-color: #cccccc;\r\n    padding: 10px; \r\n    border-radius: 5px;\r\n}\r\n\r\ndiv.emptySquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n}\r\n\r\n.emptySquare:hover {\r\n    background-color: #d9d9d9;\r\n}\r\n\r\n.hitEmptySquare {\r\n    width: 42px;\r\n    height: 42px;\r\n    display: block;\r\n    margin: 0;\r\n    background-color: #6795ff;\r\n    justify-content: center;\r\n    align-content: center;\r\n\r\n}\r\n\r\n.hitEmptySquare:hover {\r\n    background-color: #7fffd4;\r\n}\r\n\r\n.hitOccupiedSquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #ff0000;\r\n}\r\n\r\n.hitOccupiedSquare:hover {\r\n    background-color: #ff0000;\r\n}\r\n\r\n.occupiedSquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #50aa00; \r\n}\r\n\r\n.occupiedSquare:hover {\r\n    background-color: #50aa00;\r\n}\r\n\r\n.row {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n}\r\n\r\n.grid {\r\nwidth: 100%; \r\nheight: 100%; \r\nmargin-left: auto;\r\nmargin-right: auto;\r\n}\r\n\r\n.dot {\r\nwidth: 5px;\r\nheight: 5px;\r\nborder-radius: 5px; \r\nbackground-color: #000000; \r\nmargin: auto;\r\ntop: 50%;\r\nleft: 50%;\r\nmargin-top: 50%;\r\n}", "",{"version":3,"sources":["webpack://./src/mystyle.css"],"names":[],"mappings":"AAAA;AACA,WAAW;AACX,YAAY;AACZ,qBAAqB;AACrB;AACA;IACI,WAAW;IACX,kBAAkB;AACtB;;AAEA;AACA,WAAW;AACX,qBAAqB;AACrB,kBAAkB;AAClB;;AAEA;IACI,gBAAgB;IAChB,WAAW;IACX,kBAAkB;AACtB;;AAEA;IACI,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;IAChB,kBAAkB;IAClB,WAAW;AACf;;AAEA;IACI,kBAAkB;AACtB;;AAEA;AACA,UAAU;AACV,YAAY;AACZ,YAAY;AACZ,8BAA8B;AAC9B,aAAa;AACb;;AAEA;IACI,cAAc;IACd,kBAAkB;AACtB;;AAEA;AACA;;AAEA;;AAEA;;AAEA;AACA;;AAEA;AACA;;AAEA;AACA;;AAEA;IACI,gBAAgB;AACpB,kBAAkB;AAClB,qBAAqB;AACrB;;AAEA;IACI,oBAAoB;IACpB,yBAAyB;IACzB,aAAa;IACb,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,uBAAuB;IACvB,qBAAqB;;AAEzB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,cAAc;IACd,SAAS;IACT,yBAAyB;IACzB,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;IACI,WAAW;IACX,YAAY;IACZ,aAAa;AACjB;;AAEA;AACA,WAAW;AACX,YAAY;AACZ,iBAAiB;AACjB,kBAAkB;AAClB;;AAEA;AACA,UAAU;AACV,WAAW;AACX,kBAAkB;AAClB,yBAAyB;AACzB,YAAY;AACZ,QAAQ;AACR,SAAS;AACT,eAAe;AACf","sourcesContent":["#container {\r\nwidth: 100%; \r\nheight: 100%; \r\nalign-content: center;\r\n}\r\n#titleContainer {\r\n    width: 100%;\r\n    text-align: center; \r\n}\r\n\r\n#messageContainer {\r\nwidth: 100%; \r\nalign-content: center;\r\ntext-align: center; \r\n}\r\n\r\n#announcementsContainer {\r\n    min-height: 20px; \r\n    width: 100%;\r\n    text-align: center; \r\n}\r\n\r\n#announcement {\r\n    text-align: center; \r\n}\r\n\r\n#endGameMessageArea {\r\n    min-height: 20px;\r\n    text-align: center; \r\n    width: 100%;\r\n}\r\n\r\n#turnMessage, #endGameMessage {\r\n    text-align: center;\r\n}\r\n\r\n#innerContainer {\r\nwidth: 90%; \r\nheight: 100%; \r\nmargin: auto; \r\njustify-content: space-between;\r\ndisplay: flex; \r\n}\r\n\r\n#p1Zone, #p2Zone {\r\n    display: block;\r\n    text-align: center;\r\n}\r\n\r\n#p1Zone {\r\n}\r\n\r\n#p2Zone {\r\n\r\n}\r\n\r\n#player1Area, #player2Area {\r\n}\r\n\r\n#player1Area {\r\n}\r\n\r\n#player2Area {\r\n}\r\n\r\n#buttonContainer {\r\n    margin-top: 20px;\r\ntext-align: center; \r\nalign-content: center; \r\n}\r\n\r\n#startOverButton {\r\n    font-family: Verdana; \r\n    background-color: #cccccc;\r\n    padding: 10px; \r\n    border-radius: 5px;\r\n}\r\n\r\ndiv.emptySquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n}\r\n\r\n.emptySquare:hover {\r\n    background-color: #d9d9d9;\r\n}\r\n\r\n.hitEmptySquare {\r\n    width: 42px;\r\n    height: 42px;\r\n    display: block;\r\n    margin: 0;\r\n    background-color: #6795ff;\r\n    justify-content: center;\r\n    align-content: center;\r\n\r\n}\r\n\r\n.hitEmptySquare:hover {\r\n    background-color: #7fffd4;\r\n}\r\n\r\n.hitOccupiedSquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #ff0000;\r\n}\r\n\r\n.hitOccupiedSquare:hover {\r\n    background-color: #ff0000;\r\n}\r\n\r\n.occupiedSquare {\r\n    width: 40px;\r\n    height: 40px;\r\n    display: block;\r\n    margin: 0;\r\n    border: 1px solid #b0b0b0;\r\n    align-content: center;\r\n    background-color: #50aa00; \r\n}\r\n\r\n.occupiedSquare:hover {\r\n    background-color: #50aa00;\r\n}\r\n\r\n.row {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n}\r\n\r\n.grid {\r\nwidth: 100%; \r\nheight: 100%; \r\nmargin-left: auto;\r\nmargin-right: auto;\r\n}\r\n\r\n.dot {\r\nwidth: 5px;\r\nheight: 5px;\r\nborder-radius: 5px; \r\nbackground-color: #000000; \r\nmargin: auto;\r\ntop: 50%;\r\nleft: 50%;\r\nmargin-top: 50%;\r\n}"],"sourceRoot":""}]);
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

/***/ "./src/audio/cannon-shot-1.mp3":
/*!*************************************!*\
  !*** ./src/audio/cannon-shot-1.mp3 ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "2bae923c871cf3e54214313d08de3dfe.mp3");

/***/ }),

/***/ "./src/audio/cannon-shot-2.mp3":
/*!*************************************!*\
  !*** ./src/audio/cannon-shot-2.mp3 ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "c76610245979be15633fbe0519f8023a.mp3");

/***/ }),

/***/ "./src/audio/cannon-shot-3.mp3":
/*!*************************************!*\
  !*** ./src/audio/cannon-shot-3.mp3 ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "b87f590d6ffe243a9de406bfabaf4a15.mp3");

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
/* harmony import */ var _node_modules_html_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/html-loader/dist/runtime/getUrl.js */ "./node_modules/html-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_html_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_html_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___HTML_LOADER_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./asset/explosion.png */ "./src/asset/explosion.png"), __webpack_require__.b);
// Module
var ___HTML_LOADER_REPLACEMENT_0___ = _node_modules_html_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_0___default()(___HTML_LOADER_IMPORT_0___);
var code = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>New Project</title>\r\n    <link rel=\"icon\" type=\"image/png\" href=\"" + ___HTML_LOADER_REPLACEMENT_0___ + "\">\r\n</head>\r\n<body>\r\n    <div id=\"container\">\r\n        <div id=\"titleContainer\"><h1>Battleship</h1></div>\r\n        <div id=\"messageContainer\">\r\n            <div id=\"turnMessageArea\"><h2 id=\"turnMessage\"></h2></div>\r\n            <div id=\"announcementsContainer\"><h3 id=\"announcement\"></h3></div>\r\n            <div id=\"endGameMessageArea\"><h3 id=\"endGameMessage\"></h3></div>\r\n        </div>\r\n        <div id=\"innerContainer\">\r\n            <div id=\"p1Zone\">\r\n                <h2>Player One</h2>\r\n                <div id=\"playerAreaOne\"></div>\r\n            </div>\r\n            <div id=\"p2Zone\">\r\n                <h2>Player Two</h2>\r\n                <div id=\"playerAreaTwo\"></div>\r\n            </div>\r\n        </div>\r\n        <div id=\"infoContainer\"></div>\r\n        <div id=\"buttonContainer\"><button id=\"startOverButton\">Start Over</button></div>\r\n    </div>\r\n</body>\r\n</html>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./node_modules/html-loader/dist/runtime/getUrl.js":
/*!*********************************************************!*\
  !*** ./node_modules/html-loader/dist/runtime/getUrl.js ***!
  \*********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  }

  if (!url) {
    return url;
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = String(url.__esModule ? url.default : url);

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  }

  if (options.maybeNeedQuotes && /[\t\n\f\r "'=<>`]/.test(url)) {
    return "\"".concat(url, "\"");
  }

  return url;
};

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

/***/ }),

/***/ "./src/asset/explosion.png":
/*!*********************************!*\
  !*** ./src/asset/explosion.png ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "951a54a3c0f0a0ed9650.png";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["shared"], () => (__webpack_exec__("./src/index.js")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlGQUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JFYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9jb21wdXRlckFJLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9wbGFjZVNoaXBzLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcGxheUNhbm5vbkF1ZGlvLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcmFuZEdlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3Jlc2V0LmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3R1cm5UcmFja2luZy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3dpbkNvbmRpdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL215c3R5bGUuY3NzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2F1ZGlvL2Nhbm5vbi1zaG90LTEubXAzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvYXVkaW8vY2Fubm9uLXNob3QtMi5tcDMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9hdWRpby9jYW5ub24tc2hvdC0zLm1wMyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2hvbWUuaHRtbCIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2h0bWwtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9teXN0eWxlLmNzcz9kZDUwIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuUmFuZG9tIH0gZnJvbSAnLi9yYW5kR2VuLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlQ29vcmRpbmF0ZXMgfSBmcm9tICcuL3BsYWNlU2hpcHMnOyBcclxuaW1wb3J0IHsgaGl0RW1wdHksIGhpdE9jY3VwaWVkIH0gZnJvbSAnLi9ncmlkLmpzJztcclxuaW1wb3J0IHsgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBwbGF5Q2Fubm9uQXVkaW8gfSBmcm9tICcuL3BsYXlDYW5ub25BdWRpby5qcyc7XHJcblxyXG4vL0l0IG9ubHkgbmVlZHMgdG8ga2VlcCB0cmFjayBvZiB0aGUgb3Bwb25lbnQncyBzaGlwcyBhbmQgYm9hcmQgXHJcbi8vcmFuZG9tbHkgcGlja3MgY29vcmRpbmF0ZXMuIFxyXG4vL05lZWQgdG8gcmVjb2duaXplIG5vdCB0byBwaWNrIGhpdCBhcmVhc1xyXG4vL1doZW4gaXQgZG9lcyBoaXQgdGhlIG9wcG9uZW50J3Mgc2hpcCwgaXQgbmVlZHMgdG8gaGl0IHRoZSBhZGphY2VudCBhcmVhcy4gXHJcbi8vTmVlZHMgdG8ga25vdyB3aGVuIGl0J3MgdHVybiBjb21lcyB1cFxyXG4vL05lZWRzIHRvIGtub3cgd2hlbiB0aGUgZ2FtZSBpcyBvdmVyLiBcclxuXHJcbi8vdHVybiBpcyBmYWxzZSB3aGVuIGl0J3MgdGhlIEFJJ3MgdHVybiBcclxuXHJcbmNvbnN0IG1lbW9yeSA9IHtcclxuICAgIC8vQWZ0ZXIgdGhlIEFJIGhpdHMgYSBzaGlwLCBpdCBjb21lcyB1cCB3aXRoIHRhcmdldHMgaXQgd2lsbCBhdHRhY2sgaW4gaXRzIG5leHQgdHVybiBcclxuICAgIC8vbmV4dFRhcmdldFtdIGtlZXBzIHRyYWNrIG9mIHRob3NlIHRhcmdldHMuIFxyXG4gICAgbmV4dFRhcmdldDogW10sIFxyXG5cclxuICAgIC8va2VlcHMgdHJhY2sgb2YgbmV4dCB0YXJnZXRzIHRoYXQgaGF2ZSBsZXNzIHByaW9yaXR5IHRoYW4gdGhlIG9uZXMgaW4gbmV4dFRhcmdldFtdLlxyXG4gICAgLy9JdCdzIG9ubHkgdW50aWwgdGhlIEFJIGRvZXMgbm90IGhhdmUgYW55IHRhcmdldHMgaW4gbmV4dFRhcmdldFtdIGxlZnQgdGhhdCBpdCBnb2VzIGFmdGVyIHRhcmdldHMgaW4gbmV4dFNlY29uZGFyeVRhcmdldFtdLiBcclxuICAgIG5leHRTZWNvbmRhcnlUYXJnZXQ6W10sXHJcblxyXG4gICAgaGl0VGFyZ2V0OiBbXSxcclxuXHJcbiAgICAvL2tlZXBzIHRyYWNrIG9mIHByZXZpb3VzIHRhcmdldDsgXHJcbiAgICBwcmV2aW91c1RhcmdldDoge30sIFxyXG5cclxuICAgIC8va2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgdGFyZ2V0IFxyXG4gICAgY3VycmVudFRhcmdldDogbnVsbCwgXHJcblxyXG4gICAgLy9LZWVwcyB0cmFjayBvZiB3aGV0aGVyIG9yIG5vdCBlbmVteSBzaGlwcyBvcmllbnRhdGlvbiBoYXZlIGJlZW4gaWRlbnRpZmllZCBcclxuICAgIGlkZW50aWZpZWRPcmllbnRhdGlvbjogZmFsc2UsIFxyXG4gICAgLy9UaGlzIGtlZXBzIHRyYWNrIG9mIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcCBpdCdzIGF0dGFja2luZy4gXHJcbiAgICBpc0hvcml6OiB0cnVlLCBcclxuICAgIGNvbnNlY3V0aXZlSGl0OiBmYWxzZSwgXHJcbiAgICAvL251bWJlciBvZiB0aW1lcyBhbiBhdHRhY2sgaGl0cyBpdHMgdGFyZ2V0XHJcbiAgICAvLyBpdCByZXNldHMgdG8gMCBpZiBhbiBhdHRlbXB0IG1pc3NlZCBpdHMgdGFyZ2V0XHJcbiAgICBoaXRDb3VudHM6IDAsIFxyXG4gICAgb3Bwb25lbnQ6IG51bGwsIFxyXG4gICAgc2hpcExvY2F0ZWQ6IGZhbHNlLCBcclxuICAgIGNvbmZpcm1lZEhpdHM6IFtdLCBcclxuICAgIGVuZW15U2hpcHM6IFtdLCBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldE9wcG9uZW50ID0gb3Bwb25lbnQgPT4ge1xyXG4gICAgbWVtb3J5Lm9wcG9uZW50ID0gb3Bwb25lbnQ7IFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0T3Bwb25lbnRTaGlwcyA9ICgpID0+IHtcclxuICAgIG1lbW9yeS5vcHBvbmVudC5zaGlwQXJyYXkuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICBtZW1vcnkuZW5lbXlTaGlwcy5wdXNoKHNoaXApOyBcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0SGl0Q291bnRzID0gKCkgPT4ge1xyXG4gICAgbWVtb3J5LmhpdENvdW50cyA9IDA7XHJcbn1cclxuXHJcbmNvbnN0IGluY3JlbWVudEhpdENvdW50ID0gKCkgPT4ge1xyXG4gICAgbWVtb3J5LmhpdENvdW50cyArPSAxOyBcclxufVxyXG5cclxuY29uc3QgdXBkYXRlSGl0Q291bnQgPSAoKSA9PiB7XHJcbiAgICBtZW1vcnkuaGl0Q291bnRzID0gZ2V0TGVmdE92ZXJIaXRDb3VudHMoKTsgXHJcbiAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZWQgaGl0Y291bnQgPSBcIiArIG1lbW9yeS5oaXRDb3VudHMpOyBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJ1bkFJID0gKHBsYXllcikgPT4ge1xyXG4gICAgaWYoIXBsYXllci50dXJuVHJhY2tlci5nZXRUdXJuU3RhdHVzKCkpIHtcclxuICAgICAgICBoaXRPcHBvbmVudEFyZWEocGxheWVyKTtcclxuICAgIH1cclxuICBcclxufVxyXG4vL25lZWRzIHRvIGtub3cgdGhlIHBsYXllcidzIGJvYXJkIFxyXG4vL25lZWRzIHRvIGF2b2lkIGhpdCBhcmVhcyBcclxuLy9UaGUgZnVuY3Rpb24gbmVlZHMgdG8gcGF5IHNwZWNpYWwgYXR0ZW50aW9uIHRvIHdoZW4gc2hpcHMgYXJlIG5vdCBzdW5rIHlldC4gXHJcbmV4cG9ydCBjb25zdCBoaXRPcHBvbmVudEFyZWEgPSAocGxheWVyKSA9PiB7XHJcbiAgICB2YXIgYXR0YWNrQXJlYSA9IGZhbHNlO1xyXG4gICAgd2hpbGUgKCFhdHRhY2tBcmVhKSB7XHJcbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gZGVjaWRlVGFyZ2V0KCk7ICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY29vcmRpbmF0ZXMueCA9PT0gbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueCAmJiBjb29yZGluYXRlcy55ID09PSBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS55KSB7XHJcbiAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiY29vcmRpbmF0ZXMueCA9IFwiICsgY29vcmRpbmF0ZXMueClcclxuICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJjb29yZGluYXRlcy55ID0gXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgaWYgKCFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3JlY29yZCB0aGUgY29vcmRpbmF0ZSBvZiB0aGUgY3VycmVudCBhcmVhIHRoZSBBSSBpcyBhdHRhY2tpbmcgXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmN1cnJlbnRUYXJnZXQgPSB7IHg6IGNvb3JkaW5hdGVzLngsIHk6IGNvb3JkaW5hdGVzLnkgfTsgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBhcmVhIGRvZXMgY29udGFpbiB0aGUgZW5lbXkgc2hpcCBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBnZXRTcXVhcmUobWVtb3J5Lm9wcG9uZW50Lm5hbWUsIGNvb3JkaW5hdGVzLngsIGNvb3JkaW5hdGVzLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLm9jY3VwaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdE9jY3VwaWVkKG1lbW9yeS5vcHBvbmVudCwgc3F1YXJlLCBjb29yZGluYXRlcy54LCBjb29yZGluYXRlcy55KTsgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnRIaXRDb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrQXJlYSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29uZmlybWVkIGhpdDogXCIgKyBjb29yZGluYXRlcy54ICsgXCIsXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuY29uZmlybWVkSGl0cy5wdXNoKHt4OiBjb29yZGluYXRlcy54LCB5OiBjb29yZGluYXRlcy55fSlcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIEFJIGhhcyB0aGUgbmV4dCB0YXJnZXRzIGJhc2VkIG9uIGEgbG9jYXRpb24gb2YgYSBjb25maXJtZWQgaGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09MCAmJiBtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpPclZlcnQoY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIEFJIGRvZXNuJ3QgaGF2ZSBhbnkgY2x1ZSBhcyB0byB0aGUgbG9jYXRpb25zIG9mIHRoZSBlbmVteSBzaGlwcywgcmFuZG9tbHkgY2hvb3NlIGEgbG9jYXRpb24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9FbnRlciBjb29yZGluYXRlcyBvZiBhZGphY2VudCBzcXVhcmVzIGludG8gbmV4dFRhcmdldFtdIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQoY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBsaW5lIGlzIHBsYWNlZCBoZXJlIGZvciB0ZXN0aW5nXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkucHJldmlvdXNUYXJnZXQgPSB7IHg6IGNvb3JkaW5hdGVzLngsIHk6IGNvb3JkaW5hdGVzLnkgfTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5pZGVudGlmaWVkT3JpZW50YXRpb24gPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmNvbnNlY3V0aXZlSGl0ID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci50dXJuVHJhY2tlci50b2dnbGVUdXJuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5leHRUYXJnZXRbXTogXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lbW9yeS5uZXh0VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0U2Vjb25kYXJ5VGFyZ2V0OiBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQpOyBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdEVtcHR5KHNxdWFyZSk7IFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIHBhcnQgaXMgcHJvYmxlbWF0aWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJdGVtKGNvb3JkaW5hdGVzLngsIGNvb3JkaW5hdGVzLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1pc3NlZDogXCIgKyBjb29yZGluYXRlcy54ICsgXCIsXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZW1vcnkubmV4dFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5pZGVudGlmaWVkT3JpZW50YXRpb24gPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci50dXJuVHJhY2tlci50b2dnbGVUdXJuKCk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2tBcmVhID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLmhpdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgYXJlYSBoYXMgYWxyZWFkeSBiZWVuIGhpdC4gXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckl0ZW0oY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNrQXJlYSA9IGZhbHNlOyBcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwbGF5Q2Fubm9uQXVkaW8oKTsgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTcXVhcmUgPSAocGxheWVyLCB4LCB5KSA9PiB7XHJcbiAgICBjb25zdCBzcXVhcmVJRCA9IHBsYXllciArIFwiLVwiICsgeCArIFwiLFwiICsgeTtcclxuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNxdWFyZUlEKTtcclxuICAgIHJldHVybiBzcXVhcmU7XHJcbn1cclxuXHJcbi8vTWFrZXMgdGhlIEFJIHNtYXJ0ZXIgXHJcbi8vQ2hlY2sgdG8gc2VlIGlmIG5leHRUYXJnZXRbXSBpcyBlbXB0eS4gXHJcbi8vV2hlbiBBSSBoaXRzIGEgc2hpcCwgaXQgc2hvdWxkIHNlYXJjaCB0aGUgYWRqYWNlbnQgYXJlYXMsIHVudGlsIGl0J3MgY29uZmlybWVkIHRoYXQgYSBzaGlwIGlzIHN1bmsgIFxyXG4vL0l0IGRlY2lkZXMgdG8gYXR0YWNrIHRoZSB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodCBhcmVhcy5cclxuLy9JdCBjYW4ndCBhdHRhY2sgYW4gYXJlYSB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gb2NjdXBpZWQuIFxyXG4vL1RvcCBhcmVhOiB4LCB5ICsgMVxyXG4vL2JvdHRvbSBhcmVhOiB4LCB5IC0xIFxyXG4vL2xlZnQgYXJlYTogeCAtIDEsIHlcclxuLy9yaWdodCBhcmVhOiB4ICsgMSwgeSBcclxuLy8gSXQgaGFzIHRvIGtub3cgaWYgdGhlIGFyZWEgaXMgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ3JpZC4gXHJcbi8vSWYgdGhlIGFyZWEgaXQgZGVjaWRlIHRvIGF0dGFjayBkb2Vzbid0IG1lZXQgdGhlIGFib3ZlIGNvbmRpdGlvbnMsIGluIGl0cyBuZXh0IHR1cm4sIGl0IGNob29zZXMgdGhlIG90aGVyIGVuZCBvZiB0aGUgc2hpcFxyXG4vL1NvbHV0aW9uOiBUcmFjayB0aGUgaGl0IGFyZWFzIGluIGFuIGFycmF5LiBUaGUgcHJvZ3JhbSBtdXN0IGhpdCB0aGUgYXJlYXMgYXJvdW5kIGl0LiBcclxuLy9PbmNlIGV2ZXJ5IHRhcmdldCBhcmVhIGluIHRoYXQgYXJyYXkgaGFzIGJlZW4gaGl0IGFuZC4uLlxyXG4vL0lmIGl0IHJlY2VpdmVzIHRoZSBtZXNzYWdlIHRoYXQgYSBzaGlwIGlzIHN1bmssIGl0IGdvZXMgYmFjayB0byByYW5kb21seSBjaG9vc2luZyB0aWxlcyBvbiB0aGUgb3Bwb25lbnQncyBib2FyZCBcclxuXHJcbi8vVGhlIEFJIG11c3QgZmlndXJlIG91dCB3aGF0IGlzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcC4gXHJcblxyXG4vL0lmIGF0dGFja2VkIHNoaXAgaGFzIGJlZW4gaGl0IG1vcmUgdGhhbiA0IHRpbWVzIGFuZCBpZiB0aGUgYW5ub3VuY2VtZW50IHNheXMgdGhhdCB0aGUgc2hpcCB0aGF0IGhhcyBiZWVuIHN1bmsgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiBhIGNhcnJpZXIsIGl0IG11c3Qgc2VhcmNoICB0aGUgdG9wIGFuZCBib3R0b20gYXJlYXMgb2YgZWl0aGVyIGVuZCBvZiB0aGUgc2hpcC5cclxuLy90aGlzIGZ1bmN0aW9uIGNob29zZXMgYW5kIHJldHVybnMgYSBjb29yZGluYXRlIHRvIGF0dGFjayBcclxuY29uc3QgZGVjaWRlVGFyZ2V0ID0gKCkgPT4ge1xyXG4gICAgLy9JZiB0aGUgQUkgaGFzIGN1cnJlbnRseSBpZGVudGlmaWVkIHRoZSBnZW5lcmFsIGxvY2F0aW9uIG9mIHRoZSBzaGlwIGFuZCBpcyBhdHRhY2tpbmcgaXRcclxuICAgIGlmIChtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBuZXh0QXJlYSA9IG1lbW9yeS5uZXh0VGFyZ2V0W2dlblJhbmRvbShtZW1vcnkubmV4dFRhcmdldC5sZW5ndGgpIC0gMV07IFxyXG4gICAgIC8vICAgY29uc29sZS5sb2coXCJDdXJyZW50IHRhcmdldDogXCIpO1xyXG4gICAgIC8vICAgY29uc29sZS5sb2cobmV4dEFyZWEpO1xyXG4gICAgICAgIHJldHVybiBuZXh0QXJlYTsgXHJcbiAgICB9XHJcblxyXG4gICAgICAgICAgLy9JZiBBSSBkb2Vzbid0IGhhdmUgYW55IGNsdWVzIG9mIHRoZSBsb2NhdGlvbiBvZiB0aGUgb3Bwb25lbnQncyBzaGlwcyBcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0QXJlYSA9IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2dlblJhbmRvbShtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5sZW5ndGgpIC0gMV07IFxyXG4gICAgICAgICAgICByZXR1cm4gbmV4dEFyZWE7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVDb29yZGluYXRlcygxMCk7IFxyXG4gICAgfVxyXG59XHJcblxyXG4vL0Z1bmN0aW9uIHRha2VzIGEgbG9vayBhdCB0aGUgc3F1YXJlcyBhZGphY2VudCB0byB0aGUgYXR0YWNrZWQgc3F1YXJlIFxyXG4vL2FuZCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIHB1dCB0aGVtIGluIHRoZSBuZXh0IHRhcmdldCBsaXN0LiBcclxuY29uc3QgY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQgPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQgeCA9IFwiICsgeF9jb29yICsgXCI7IHkgPSBcIiArIHlfY29vciApXHJcbiAgICBpZiAoeF9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgIGlmICghaGFzQWxyZWFkeUJlZW5BdHRhY2tlZCh4X2Nvb3IgKyAxLCB5X2Nvb3IpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHt4OiB4X2Nvb3IgKyAxLHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSB9XHJcbiAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2godGFyZ2V0KTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHhfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciAtMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciAtIDEsIHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSAgfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHlfY29vciArIDEgPD0gMTApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yLCB5X2Nvb3IgKyAxKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciwgeTogeV9jb29yICsgMSwgaXNIb3JpejogZmFsc2UgfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgaWYgKHlfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciwgeV9jb29yIC0gMSkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiB4X2Nvb3IsIHk6IHlfY29vciAtIDEsIGlzSG9yaXo6IGZhbHNlfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmNvbnN0IGFkZFNlY29uZGFyeVBvdGVudGlhbFRhcmdldHMgPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiYWRkU2Vjb25kYXJ5UG90ZW50aWFsVGFyZ2V0cyB4ID0gXCIgKyB4X2Nvb3IgKyBcIjsgeSA9IFwiICsgeV9jb29yKVxyXG4gICAgaWYgKHhfY29vciArIDEgPD0gMTApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yICsgMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yICsgMSAmJiBtZW1vcnkuY3VycmVudFRhcmdldC55ICE9PSB5X2Nvb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3REdXBsaWNhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldFtpXS54ICE9PSB4X2Nvb3IgKyAxICYmIG1lbW9yeS5uZXh0VGFyZ2V0W2ldLnkgPT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ueCAhPT0geF9jb29yICsgMSAmJiBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS55ID09IHlfY29vcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vdER1cGxpY2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogeF9jb29yICsgMSwgeTogeV9jb29yLCBpc0hvcml6OiB0cnVlIH1cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeF9jb29yIC0gMSA+IDApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yIC0gMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yIC0gMSAmJiBtZW1vcnkuY3VycmVudFRhcmdldC55ICE9PSB5X2Nvb3IpIHsgXHJcbiAgICAgICAgICAgICAgICB2YXIgbm90RHVwbGljYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHR5VGFyZ2V0W2ldLnggIT09IHhfY29vciAtIDEgJiYgbWVtb3J5Lm5leHRUYXJnZXRbaV0ueSA9PSB5X2Nvb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90RHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS54ICE9PSB4X2Nvb3IgLSAxICYmIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnkgPT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChub3REdXBsaWNhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciAtIDEsIHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeV9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgIGlmICghaGFzQWxyZWFkeUJlZW5BdHRhY2tlZCh4X2Nvb3IsIHlfY29vciArIDEpKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkuY3VycmVudFRhcmdldC54ICE9PSB4X2Nvb3IgJiYgbWVtb3J5LmN1cnJlbnRUYXJnZXQueSAhPT0geV9jb29yICsgMSkgeyBcclxuICAgICAgICAgICAgICAgIHZhciBub3REdXBsaWNhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFRhcmdldFtpXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldFtpXS54ICE9PSB4X2Nvb3IgJiYgbWVtb3J5Lm5leHRUYXJnZXRbaV0ueSA9PSB5X2Nvb3IgKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ueCAhPT0geF9jb29yICYmIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnkgPT0geV9jb29yICsgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobm90RHVwbGljYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiB4X2Nvb3IsIHk6IHlfY29vciArIDEsIGlzSG9yaXo6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeV9jb29yIC0gMSA+IDApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yLCB5X2Nvb3IgLSAxKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yICYmIG1lbW9yeS5jdXJyZW50VGFyZ2V0LnkgIT09IHlfY29vciAtIDEpIHsgXHJcbiAgICAgICAgICAgICAgICB2YXIgbm90RHVwbGljYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRUYXJnZXRbaV0ueCAhPT0geF9jb29yICYmIG1lbW9yeS5uZXh0VGFyZ2V0W2ldLnkgPT0geV9jb29yIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnggIT09IHhfY29vciAmJiBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS55ID09IHlfY29vciAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90RHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vdER1cGxpY2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogeF9jb29yLCB5OiB5X2Nvb3IgLSAxLCBpc0hvcml6OiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL2NsZWFycyB0aGUgbmV4dFRhcmdldCBhcnJheTsgXHJcbmNvbnN0IGNsZWFyTmV4dFRhcmdldCA9ICgpID0+IHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGlzY2FyZCA9IG1lbW9yeS5uZXh0VGFyZ2V0LnBvcCgpO1xyXG4gICAgfVxyXG4gICAgbWVtb3J5Lm5leHRUYXJnZXQgPSBbXTsgXHJcbn1cclxuXHJcblxyXG5jb25zdCBjbGVhck5leHRTZWNvbmRhcnlUYXJnZXQgPSAoKSA9PiB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZGlzY2FyZCA9IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LnBvcCgpOyBcclxuICAgIH1cclxuICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0ID0gW107IFxyXG59XHJcblxyXG4vL2ZpbmRzIG91dCBpZiBhIGNvb3JkaW5hdGUgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZC4gXHJcbmV4cG9ydCBjb25zdCBoYXNBbHJlYWR5QmVlbkF0dGFja2VkID0gKHgsIHkpID0+IHtcclxuICAgIGZvcih2YXIgaSA9IDA7IGk8IG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLnggPT09IHggJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5Lmxlbmd0aDsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL0FmdGVyIGhpdHRpbmcgYSBzaGlwIHRoZSAybmQsIHByb2dyYW0gc2hvdWxkIGtub3cgd2hhdCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaXAgaXMuIFxyXG4vL0Z1bmN0aW9uIGNvbXBhcmVzIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGluIHRoZSBwYXJhbWV0ZXJzIHdpdGggdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgc3RvcmVkIGluIHByZXZpb3VzVGFyZ2V0XHJcbmNvbnN0IGhvcml6T3JWZXJ0ID0gKHhfY29vciwgeV9jb29yKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnSG9yaXpPUlZlcnQgeCA9ICcgKyB4X2Nvb3IgKyBcIjsgeSA9IFwiICsgeV9jb29yKVxyXG4gICAgY2xlYXJJdGVtKHhfY29vciwgeV9jb29yKTtcclxuICAgIHRyYW5zZmVyVG9TZWNvbmRhcnkoKVxyXG4gICAgLy9pZiB5IGNvb3JkaW5hdGVzIGFyZSB0aGUgc2FtZSwgaXQncyBob3Jpem9udGFsXHJcbiAgICBpZiAobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgPT09IHlfY29vcikge1xyXG4gICAgICAgIG1lbW9yeS5pc0hvcml6ID0gdHJ1ZTsgXHJcbiAgICAgICAgLy9nbyByaWdodCBcclxuICAgICAgICBpZiAoeF9jb29yID4gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZSBuZXh0IHRhcmdldGVkIHNxdWFyZSBpcyB2YWxpZCBmb3IgYW4gYXR0YWNrIFxyXG4gICAgICAgICAgICBpZiAoeF9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciArIDEsIHlfY29vcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHsgeDogeF9jb29yICsgMSwgeTogeV9jb29yLCBpc0hvcml6OiB0cnVlIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vTWFrZSBzdXJlIHRoZXJlIGlzIG5vIGR1cGxpY2F0ZSBpbiBuZXh0U2Vjb25kYXJ5VGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgKyAxICYmIGl0ZW0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54IC0gMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIGZhbHNlIClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgIC8vSG93dmVyLCBpZiB0aGUgY3VycmVudCBhdHRhY2sgd2FzIG5vdCBmb2xsb3dlZCB1cCBieSBhbm5vdW5jZW1lbnQgb2YgYSBzdW5rIHNoaXAgXHJcbiAgICAgICAgICAgIC8vLi4uYWRkIGNvb3JkaW5hdGVzIG9mIHRoZSBzcXVhcmUgdGhhdCBpcyBhZGphY2VudCB0byB0aGUgbG9jYXRpb24gb2YgdGhlIGluaXRpYWwgYXR0YWNrIG9mIHRoZSBzaGlwIHRvIG5leHRUYXJnZXRcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54IC0gMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggLSAxLCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSwgdHJ1ZSwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9nbyBsZWZ0XHJcbiAgICAgICAgZWxzZSBpZiAoeF9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgaWYgKHhfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yIC0gMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2goeyB4OiB4X2Nvb3IgLSAxLCB5OiB5X2Nvb3IsIGlzSG9yaXo6IHRydWUgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgLSAxICYmIGl0ZW0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCArIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RoZSBuZXh0IHRhcmdldCBpcyBpbnZhbGlkLlxyXG4gICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAvLy4uLmFkZCBjb29yZGluYXRlcyBvZiB0aGUgc3F1YXJlIHRoYXQgaXMgYWRqYWNlbnQgdG8gdGhlIGxvY2F0aW9uIG9mIHRoZSBpbml0aWFsIGF0dGFjayBvZiB0aGUgc2hpcCB0byBuZXh0VGFyZ2V0XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ICsgMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCArIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9pZiB4IGNvb3JkaW5hdGVzIGFyZSB0aGUgc2FtZSwgaXQncyB2ZXJ0aWNhbCBcclxuICAgIGVsc2UgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ID09PSB4X2Nvb3IpIHtcclxuICAgICAgICBtZW1vcnkuaXNIb3JpeiA9IGZhbHNlO1xyXG4gICAgICAgIC8vR28gZG93blxyXG4gICAgICAgIGlmICh5X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSApIHtcclxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlIG5leHQgdGFyZ2V0ZWQgc3F1YXJlIGlzIHZhbGlkIGZvciBhbiBhdHRhY2sgXHJcbiAgICAgICAgICAgIGlmICh5X2Nvb3IgLSAxID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKCB4X2Nvb3IsIHlfY29vciAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRUYXJnZXQucHVzaCh7IHg6IHhfY29vciwgeTogeV9jb29yIC0gMSwgaXNIb3JpejogZmFsc2UgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgJiYgaXRlbS55ID09PSB5X2Nvb3IgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKyAxLCBmYWxzZSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAgICAgLy8uLi5hZGQgY29vcmRpbmF0ZXMgb2YgdGhlIHNxdWFyZSB0aGF0IGlzIGFkamFjZW50IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgaW5pdGlhbCBhdHRhY2sgb2YgdGhlIHNoaXAgdG8gbmV4dFRhcmdldFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55ICsgMSwgZmFsc2UsIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKyAxLCBmYWxzZSwgdHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2dvIHVwXHJcbiAgICAgICAgZWxzZSBpZiAoeV9jb29yID4gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKSB7XHJcbiAgICAgICAgICAgIGlmICh5X2Nvb3IgKyAxIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoIHhfY29vciwgeV9jb29yICsgMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHsgeDogeF9jb29yLCB5OiB5X2Nvb3IgKyAxLCBpc0hvcml6OiBmYWxzZSB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5mb3JFYWNoKChpdGVtLCBpbmRleCwgb2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IHhfY29vciAmJiBpdGVtLnkgPT09IHlfY29vciArIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54LCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSAtIDEsIGZhbHNlLCBmYWxzZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAgICAgLy8uLi5hZGQgY29vcmRpbmF0ZXMgb2YgdGhlIHNxdWFyZSB0aGF0IGlzIGFkamFjZW50IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgaW5pdGlhbCBhdHRhY2sgb2YgdGhlIHNoaXAgdG8gbmV4dFRhcmdldFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55IC0gMSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55IC0gMSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLypcclxuICAgIG1lbW9yeS5uZXh0VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICBpZiAobWVtb3J5LmlzSG9yaXogIT09IGl0ZW0uaXNIb3Jpeikge1xyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgKi9cclxuICAgIGFkZFNlY29uZGFyeVBvdGVudGlhbFRhcmdldHMoeF9jb29yLCB5X2Nvb3IpXHJcbn1cclxuXHJcbmNvbnN0IHRyYW5zZmVyVG9TZWNvbmRhcnkgPSAoKSA9PiB7XHJcbiAgICBtZW1vcnkubmV4dFRhcmdldC5mb3JFYWNoKHRhcmdldCA9PiB7XHJcbiAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh7eDogdGFyZ2V0LngsIHk6IHRhcmdldC55LCBpc0hvcml6OiB0YXJnZXQuaXNIb3Jpen0pXHJcbiAgICB9KVxyXG4gICAgY2xlYXJOZXh0VGFyZ2V0KCk7IFxyXG59XHJcblxyXG5jb25zdCBjbGVhckl0ZW0gPSAoeCwgeSkgPT4ge1xyXG4gICAgaWYgKG1lbW9yeS5uZXh0VGFyZ2V0Lmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0geCAmJiBpdGVtLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0geCAmJiBpdGVtLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY2xlYXJTZWNvbmRhcnlJdGVtID0gKHgsIHkpID0+IHtcclxuICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICBpZiAoaXRlbS54ID09PSB4ICYmIGl0ZW0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vL2Z1bmN0aW9uIHRvIGRldGVybWluZSBpZiB0aGVyZSBhcmUgc3RpbGwgYW55IGVuZW15IGJvYXRzIGFyb3VuZCBhbiBhcmVhIGFmdGVyIGEgYm9hdCBoYXMgYmVlbiBzdW5rXHJcbi8vV2hlbiBhIHN1bmtlbiBzaGlwIGhhcyBiZWVuIGFubm91bmNlZCwgdGhlIGZ1bmN0aW9uIGZpbmRzIG91dCB3aGV0aGVyIG9yIG5vdCB0aGVyZSBpcyBkaXNjcmlwYW5jeSBcclxuLy8uLi5iZXR3ZWVuIHRoZSBoaXRDb3VudHMgYW5kIHRoZSBzdW5rZW4gc2hpcCdzIGhpdCBwb2ludHMuXHJcbi8vSWYgdGhlcmUgaXMsIHBhc3MgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3Vua2VuIHNoaXAgdGhhdCB3YXMgaW5pdGlhbGx5IGhpdFxyXG4vLy4udG8gY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXRcclxuLy9UaGlzIGZ1bmN0aW9uIGlzIHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgYW55IHZhbGlkIGNvb3JkaW5hdGVzIHRvIGJlIHRoZSBuZXh0IHRhcmdldHMuIFxyXG5leHBvcnQgY29uc3QgaXNBcmVhU2VjdXJlID0gKHN1bmtTaGlwLCB4X2Nvb3IsIHlfY29vcikgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJoaXRDb3VudHMgPSBcIiArIChtZW1vcnkuaGl0Q291bnRzICsgMSkpXHJcbiAgICBjb25zb2xlLmxvZyhcInNoaXAgbGVuZ3RoID0gXCIgKyBzdW5rU2hpcC5sZW5ndGggKVxyXG4gICAgbWVtb3J5LnNoaXBMb2NhdGVkID0gZmFsc2U7IFxyXG4gICAgLy9JIGhhZCB0byBtYW51YWxseSBpbmNyZW1lbnQgbWVtb3J5LmhpdENvdW50cyBoZXJlIGJlY2F1c2UgaXNBcmVhU2VjdXJlIGlzIGV4ZWN1dGVkIGJlZm9yZSB0aGUgQUkgaW5jcmVtZW50cyBoaXRDb3VudCBpbiBoaXRPcHBvbmVudEFyZWEoKVxyXG4gICAgaWYgKHN1bmtTaGlwLmxlbmd0aCAhPT0gKG1lbW9yeS5oaXRDb3VudHMgKyAxKSkge1xyXG4gICAgICAgIHVwZGF0ZUhpdENvdW50KCk7IFxyXG4gICAgICAgIC8vICAgYXR0YWNrVGhlT3RoZXJFbmQoeF9jb29yLCB5X2Nvb3IpXHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygnaXNBcmVhU2VjdXJlIG1lbW9yeS5wcmV2aW91c1RhcmdldDogJyArIFwiKFwiICsgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKyBcIixcIiArIG1lbW9yeS5wcmV2aW91c1RhcmdldC55ICsgXCIpXCIpOyBcclxuICAgICAgICAvL0hvcml6b250YWwgXHJcbiAgICAgICAgaWYgKHlfY29vciA9PT0gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkpIHtcclxuICAgICAgICAgICAgaWYgKHhfY29vciA+IG1lbW9yeS5wcmV2aW91c1RhcmdldC54KSB7XHJcbiAgICAgICAgICAgICAgICBmaW5kTmVpZ2hib3JPZkVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCAtIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh4X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICAgICAgZmluZE5laWdoYm9yT2ZFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKyAxLCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1ZlcnRpY2FsIFxyXG4gICAgICAgIGVsc2UgaWYgKHhfY29vciA9PT0gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgaWYgKHlfY29vciA+IG1lbW9yeS5wcmV2aW91c1RhcmdldC55KSB7XHJcbiAgICAgICAgICAgICAgICBmaW5kTmVpZ2hib3JPZkVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgLSAxLCBmYWxzZSwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoeV9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkpIHtcclxuICAgICAgICAgICAgICAgIGZpbmROZWlnaGJvck9mRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54LCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSArIDEsIGZhbHNlLCB0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBcmVhIGlzIHNlY3VyZS4gQ2xlYXIgTmV4dFRhcmdldFtdLiBDbGVhciBuZXh0U2Vjb25kYXJ5VGFyZ2V0W10uIFwiKVxyXG4gICAgICAgIGNsZWFyTmV4dFRhcmdldCgpOyBcclxuICAgICAgICBjbGVhck5leHRTZWNvbmRhcnlUYXJnZXQoKTsgXHJcbiAgICAgIC8vICBtZW1vcnkucHJldmlvdXNUYXJnZXQgPSBudWxsOyBcclxuICAgICAgICByZXNldEhpdENvdW50cygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGF0dGFja1RoZU90aGVyRW5kID0gKHhfY29vciwgeV9jb29yKSA9PiB7XHJcbiAgICAvL2lmIHRoZSBhdHRhY2sgcGF0dGVybiB3YXMgaG9yaXpvbnRhbFxyXG4gICAgdmFyIG5ld1ggPSAwO1xyXG4gICAgdmFyIG5ld1kgPSAwO1xyXG4gICAgdmFyIGZvdW5kQ29uc2VjdXRpdmUgPSBmYWxzZTsgXHJcbiAgICAvL2hvcml6b250YWwgb3JpZW50YXRpb24gXHJcbiAgICB2YXIgZGlyZWN0aW9uWCA9IDA7IFxyXG4gICAgdmFyIGRpcmVjdGlvblkgPSAwIFxyXG4gICAgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC55ID09PSB5X2Nvb3IgJiYgeF9jb29yICE9PSBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgIGlmICh4X2Nvb3IgPiBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25YID0gLTI7IFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoeF9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uWCA9IDI7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vaWYgdGhlIGF0dGFjayBwYXR0ZXJuIHdhcyB2ZXJ0aWNhbCBcclxuICAgIGVsc2UgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ID09PSB4X2Nvb3IgJiYgeV9jb29yICE9PSBtZW1vcnkucHJldmlvdXNUYXJnZXQueSkge1xyXG4gICAgICAgIGlmICh5X2Nvb3IgPiBtZW1vcnkucHJldmlvdXNUYXJnZXQueSkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25ZID0gLTI7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh4X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25ZID0gMjsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkuY29uZmlybWVkSGl0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ID09PSAoeF9jb29yICsgZGlyZWN0aW9uWCkgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0gKHlfY29vciArIGRpcmVjdGlvblkpKXtcclxuICAgICAgICAgICAgbmV3WCA9IHhfY29vciArIGRpcmVjdGlvblg7XHJcbiAgICAgICAgICAgIG5ld1kgPSB5X2Nvb3IgKyBkaXJlY3Rpb25ZO1xyXG4gICAgICAgICAgICBmb3VuZENvbnNlY3V0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJlY3Rpb25YIC89IDIpOyBcclxuICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJlY3Rpb25ZIC89IDIpOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZm91bmRDb25zZWN1dGl2ZSkge1xyXG4gICAgICAgIHZhciBkb250RW5kTG9vcCA9IHRydWU7IFxyXG4gICAgICAgIHZhciBmb3VuZENvbnMgPSBmYWxzZTsgXHJcbiAgICAgICAgdmFyIGNvdW50ID0gMTsgXHJcbiAgICAgICAgdmFyIGNvbnNlY3V0aXZlWCA9IDA7XHJcbiAgICAgICAgdmFyIGNvbnNlY3V0aXZlWSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGRvbnRFbmRMb29wKSB7XHJcbiAgICAgICAgICAgIGNvbnNlY3V0aXZlWCA9IG5ld1ggKyAoZGlyZWN0aW9uWCAqIGNvdW50KTtcclxuICAgICAgICAgICAgY29uc2VjdXRpdmVZID0gbmV3WSArIChkaXJlY3Rpb25ZICogY291bnQpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5jb25maXJtZWRIaXRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ID09PSBjb25zZWN1dGl2ZVggJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0gY29uc2VjdXRpdmVZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKzsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRDb25zID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFmb3VuZENvbnMpIHtcclxuICAgICAgICAgICAgICAgIGRvbnRFbmRMb29wID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZENvbnMgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWVtb3J5Lm5leHRUYXJnZXQucHVzaCh7IHg6IGNvbnNlY3V0aXZlWCwgeTogY29uc2VjdXRpdmVZIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBdHRhY2sgdGhlIG90aGVyIGVuZDogXCIgKyBjb25zZWN1dGl2ZVggKyBcIixcIiArIGNvbnNlY3V0aXZlWSlcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlIG90aGVyIGVuZCBpcyB2YWxpZCBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkF0dGFjayB0aGUgb3RoZXIgZW5kOiBcIiArIGRpcmVjdGlvblggKyBcIixcIiArIGRpcmVjdGlvblkpXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY29uc3QgaWRlbnRpZnlPcmllbnRhdGlvbiA9ICh4X2Nvb3IsIHlfY29vcikgPT4ge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkuY29uZmlybWVkSGl0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ICsgMSA9PT0geF9jb29yICYmIG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgPT09IHlfY29vcikge1xyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKCh7eDogeF9jb29yICsgMSwgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnggLSAxID09PSB4X2Nvb3IgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgKyAxID09PSB5X2Nvb3IgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueCA9PT0geF9jb29yKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgKyAtMSA9PT0geV9jb29yICYmIG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnggPT09IHhfY29vcikge1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjaG9vc2VUYXJnZXRCYXNlZE9uT3JpZW50YXRpb24gPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIC8vRXZlcnkgdGltZSBhbiBhdHRhY2sgaGl0cyBhbiBlbmVteSBzaGlwLFxyXG4gICAgLy8uLi5jaGVjayB0byBzZWUgaWYgaXQgaGFzIGJlZW4gaGl0IG1vcmUgdGhhbiBvbmUgdGltZS5cclxuICAgIC8vSWYgc28sIGlkZW50aWZ5IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcCBhbmQgZm9jdXMgdGhlIGF0dGFjayBvbiB0aGF0IHNoaXBcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5lbXlTaGlwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZW5lbXlTaGlwcy5wb3NBcnJheS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZW5lbXlTaGlwcy5wb3NBcnJheVtqXS54ID09PSB4X2Nvb3IgJiYgZW5lbXlTaGlwcy5wb3NBcnJheVtqXS55KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGl0Q291bnQgPSAwOyBcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZW5lbXlTaGlwcy5wb3NBcnJheS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmVteVNoaXBzLnBvc0FycmF5W2tdLmhpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRDb3VudCsrOyBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBmaW5kVGhlRW5kID0gKHhfY29vciwgeV9jb29yLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpID0+IHtcclxuICAgIC8vZW5kIGNvbmRpdGlvbnM6XHJcbiAgICAvL0l0IGNvbWVzIHVwb24gYSBzcXVhcmUgdGhhdCBoYXMgbm90IGJlZW4gYXR0YWNrZWRcclxuICAgIC8vaXQgY29tZXMgdXBvbiB0aGUgZWRnZSBvZiB0aGUgbWFwIFxyXG4gICAgdmFyIG1vdmVYID0gMDtcclxuICAgIHZhciBtb3ZlWSA9IDA7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsICYmIGlzQ2xpbWJpbmcgJiYgeF9jb29yIDw9IDEwKSB7XHJcbiAgICAgICAgbW92ZVggPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNIb3Jpem9udGFsICYmICFpc0NsaW1iaW5nICYmIHhfY29vciA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIWlzSG9yaXpvbnRhbCAmJiBpc0NsaW1iaW5nICYmIHlfY29vciA8PSAxMCkge1xyXG4gICAgICAgIG1vdmVZID0gMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgIWlzQ2xpbWJpbmcgJiYgeV9jb29yID4gMCkge1xyXG4gICAgICAgIG1vdmVZID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS54ID09PSB4X2Nvb3IgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWCA9IHhfY29vciArIG1vdmVYOyBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWSA9IHlfY29vciArIG1vdmVZO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGQgT3RoZXIgRW5kIFJlY3Vyc2lvbjogXCIgKyB0cmFuc1ggKyBcIixcIiArIHRyYW5zWSlcclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQoeF9jb29yICsgbW92ZVgsIHlfY29vciArIG1vdmVZLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0ICYmICFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgICAvL2RvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2goeyB4OiB4X2Nvb3IsIHk6IHlfY29vciwgaXNIb3JpejogaXNIb3Jpem9udGFsIH0pXHJcbiAgICAgICAgICAgICAgICBjbGVhclNlY29uZGFyeUl0ZW0oeF9jb29yLCB5X2Nvb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaW5kVGhlRW5kOiBcIiArIHhfY29vciArIFwiLFwiICsgeV9jb29yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9jbGVhclNlY29uZGFyeUl0ZW0oKVxyXG59XHJcblxyXG4vL1RoaXMgZnVuY3Rpb24gaXMgc2ltaWxhciB0byBmaW5kVGhlRW5kKCksIGJ1dCBpdCBmaW5kcyB0aGUgbmVpZ2hib3JpbmcgYXJlYXMgb2YgdGhlIGVuZCBvZiB0aGUgc2hpcCBcclxuY29uc3QgZmluZE5laWdoYm9yT2ZFbmQgPSAoeF9jb29yLCB5X2Nvb3IsIGlzSG9yaXpvbnRhbCwgaXNDbGltYmluZykgPT4ge1xyXG4gICAgdmFyIG1vdmVYID0gMDtcclxuICAgIHZhciBtb3ZlWSA9IDA7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsICYmIGlzQ2xpbWJpbmcgJiYgeF9jb29yIDw9IDEwKSB7XHJcbiAgICAgICAgbW92ZVggPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNIb3Jpem9udGFsICYmICFpc0NsaW1iaW5nICYmIHhfY29vciA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIWlzSG9yaXpvbnRhbCAmJiBpc0NsaW1iaW5nICYmIHlfY29vciA8PSAxMCkge1xyXG4gICAgICAgIG1vdmVZID0gMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgIWlzQ2xpbWJpbmcgJiYgeV9jb29yID4gMCkge1xyXG4gICAgICAgIG1vdmVZID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS54ID09PSB4X2Nvb3IgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWCA9IHhfY29vciArIG1vdmVYO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNZID0geV9jb29yICsgbW92ZVk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZCBPdGhlciBFbmQgUmVjdXJzaW9uOiBcIiArIHRyYW5zWCArIFwiLFwiICsgdHJhbnNZKVxyXG4gICAgICAgICAgICAgICAgZmluZE5laWdoYm9yT2ZFbmQoeF9jb29yICsgbW92ZVgsIHlfY29vciArIG1vdmVZLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0ICYmICFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgLy9kbyBub3RoaW5nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaG9vc2VWYWxpZFBvdGVudGlhbFRhcmdldCh4X2Nvb3IsIHlfY29vcilcclxuICAgICAgICAgICAgICAgIGNsZWFyU2Vjb25kYXJ5SXRlbSh4X2Nvb3IsIHlfY29vcik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbmROZWlnaGJvck9mRW5kOiBcIiArIHhfY29vciArIFwiLFwiICsgeV9jb29yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgZ2V0TGVmdE92ZXJIaXRDb3VudHMgPSAoKSA9PiB7XHJcbiAgICAvL1Rha2VzIHRoZSBzaGlwcyB0aGF0IGFyZSBwYXJ0aWFsbHkgaGl0IGFuZCBhZGQgdGhlaXIgdG90YWwgbnVtYmVyIG9mIHBhcnRzIHRoYXQgaGF2ZSBiZWVuIGhpdCBcclxuICAgIHZhciB0b3RhbEhpdCA9IDA7IFxyXG5cclxuICAgIG1lbW9yeS5lbmVteVNoaXBzLmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgaWYgKHNoaXAuaGFzQmVlbkhpdCAmJiAhc2hpcC5pc1N1bmspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGlwLnBvc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcC5wb3NBcnJheVtpXS5pc0hpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSGl0ICs9IDE7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHRvdGFsSGl0OyBcclxufSIsImltcG9ydCB7IGNyZWF0ZVBsYXllciB9IGZyb20gJy4vcGxheWVyLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlR3JpZCB9IGZyb20gJy4vZ3JpZC5qcyc7IFxyXG5pbXBvcnQgeyBwbGFjZUFsbFNoaXBzIH0gZnJvbSAnLi9wbGFjZVNoaXBzLmpzJztcclxuaW1wb3J0IHsgc2V0U2VsZiwgc2V0T3Bwb25lbnQsIGdldE9wcG9uZW50U2hpcHMgfSBmcm9tICcuL2NvbXB1dGVyQUkuanMnO1xyXG5pbXBvcnQgeyB0cmFja1R1cm5zIH0gZnJvbSAnLi90dXJuVHJhY2tpbmcuanMnO1xyXG5pbXBvcnQgeyBydW5BSSwgZ2V0T3Bwb25lbnQgfSBmcm9tICcuL2NvbXB1dGVyQUkuanMnOyBcclxuXHJcbnZhciBwbGF5ZXJPbmVUdXJuID0gdHJ1ZTsgXHJcbmNvbnN0IHR1cm5NZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R1cm5NZXNzYWdlJylcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbmV3R2FtZSA9IG5ldyBPYmplY3QoKTtcclxuICAgIG5ld0dhbWUub3ZlciA9IGZhbHNlO1xyXG4gICAgbmV3R2FtZS5lbmRHYW1lID0gKCkgPT4ge1xyXG4gICAgICAgIG5ld0dhbWUub3ZlciA9IHRydWU7IFxyXG4gICAgfVxyXG4gICAgY29uc3QgcGxheWVyT25lID0gY3JlYXRlUGxheWVyKCdwbGF5ZXJPbmUnLCAncGxheWVyVHdvJywgJ3BsYXllckFyZWFPbmUnLCBmYWxzZSk7XHJcbiAgICBjb25zdCBwbGF5ZXJUd28gPSBjcmVhdGVQbGF5ZXIoJ3BsYXllclR3bycsICdwbGF5ZXJPbmUnLCAncGxheWVyQXJlYVR3bycsIHRydWUpO1xyXG5cclxuXHJcbiAgICAvL1RoZSBmb2xsb3dpbmcgdHdvIGxpbmVzIGlzIGEgd2F5IHRvIGxldCBib3RoIHBsYXllciBvYmplY3RzIGtub3cgaWYgYSB3aW5uZXIgaXMgYW5ub3VuY2VkLiBcclxuICAgIHBsYXllck9uZS5zZXRHYW1lT2JqZWN0KG5ld0dhbWUpO1xyXG4gICAgcGxheWVyVHdvLnNldEdhbWVPYmplY3QobmV3R2FtZSk7XHJcblxyXG4gICAgdHJhY2tUdXJucyhwbGF5ZXJPbmUsIHBsYXllclR3byk7XHJcbiAgICBpZiAocGxheWVyVHdvLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICBwbGF5ZXJUd28uc2V0T3Bwb25lbnQocGxheWVyT25lKTtcclxuICAgICAgICBnZXRPcHBvbmVudChwbGF5ZXJPbmUpXHJcbiAgICAgICAgcGxheWVyT25lLmlzUGxheWluZ0FnYWluc3RBSSA9IHRydWU7IFxyXG4gICAgICAgIGdldE9wcG9uZW50U2hpcHMoKTsgXHJcbiAgICAgICAgcnVuQUkocGxheWVyVHdvKTtcclxuICAgIH1cclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5ub3VuY2VtZW50JykuaW5uZXJIVE1MID0gJyc7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5kR2FtZU1lc3NhZ2UnKS5pbm5lckhUTUwgPSAnJztcclxuXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwbGF5ZXJPbmUsIFxyXG4gICAgICAgIHBsYXllclR3byxcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbiIsIi8vR2VuZXJhdGUgZ3JpZCBmb3IgZWFjaCBwbGF5ZXJcclxuLy9HcmlkIGtlZXBzIHRyYWNrIG9mIHdoZXRoZXIgdGhlIHBsYXllcidzIHNoaXAgYXJlIGFsbCBzdW5rIG9yIG5vdC4gXHJcbi8vRWFjaCBzcXVhcmUgdW5pdCBpcyByZW5kZXJlZCBieSBhIGRpdi4gIFxyXG4vL0VhY2ggc3F1YXJlIGlzIGlkZW50aWZpZWQgYnkgYSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgSURcclxuLy9Vc2UgYW4gYXJyYXkgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIHNxdWFyZSB1bml0cz8gSXQgd291bGQgYmUgYW4gYXJyYXkgb2YgYXJyYXlzIFxyXG4vL0EgbWFzdGVyIGFycmF5IGNvbnNpc3Qgb2YgYXJyYXlzIG9mIHJvd3NcclxuLy9FYWNoIG9mIHRoZSBjaGlsZCBhcnJheSByZXByZXNlbnRzIGEgcm93IGFuZCBjb25zaXN0cyBvZiBpbmRpdmlkdWFsIHVuaXRzIG9mIGEgY29sdW1uIFxyXG4vL0VhY2ggc3F1YXJlIHVuaXQgaXMgYW4gb2JqZWN0IFxyXG4vL2NvbnRhaW5zIHgseSBjb29yZGluYXRlcyBcclxuLy9IYXMgYSBib29sZWFuIHZhbHVlIG9mIHdoZXRoZXIgdGhlIGFyZWEgaXQgcmVwcmVzZW50cyBoYXZlIGJlZW4gaGl0IGZvciBub3QuIFxyXG5cclxuLy9Ob24taGl0IHNxdWFyZXMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgXHJcblxyXG5pbXBvcnQgeyBpc1NoaXBTdW5rIH0gZnJvbSAnLi9zaGlwLmpzJzsgXHJcbmltcG9ydCB7IGNoZWNrU2hpcHMgfSBmcm9tICcuL3dpbkNvbmRpdGlvbi5qcyc7XHJcbmltcG9ydCB7IGlzQXJlYVNlY3VyZSB9IGZyb20gJy4vY29tcHV0ZXJBSS5qcyc7IFxyXG5pbXBvcnQgeyBwbGF5Q2Fubm9uQXVkaW8gfSBmcm9tICcuL3BsYXlDYW5ub25BdWRpby5qcyc7XHJcblxyXG5leHBvcnQgY29uc3Qgc3F1YXJlVW5pdCA9IHtcclxuICAgIHVuaXQ6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCBcclxuICAgIGhpdDogZmFsc2UsIFxyXG4gICAgaXNFbXB0eTogdHJ1ZSxcclxuICAgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUdyaWQgPSAoY29sdW1ucywgcGxheWVyKSA9PiB7XHJcbiAgICB2YXIgbmV3Z3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBwbGF5ZXIuc2V0Qm9hcmRDb2x1bW5zKGNvbHVtbnMpO1xyXG4gICAgbmV3Z3JpZC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2dyaWQnKVxyXG4gICAgaWYgKGNvbHVtbnMgPCAxMCkge1xyXG4gICAgICAgIGNvbHVtbnMgPSAxMDsgXHJcbiAgICB9XHJcbiAgICBnZW5lcmF0ZVJvdyhuZXdncmlkLCBjb2x1bW5zLCBjb2x1bW5zLCBwbGF5ZXIpOyBcclxuICAgIHJldHVybiBuZXdncmlkOyBcclxufVxyXG5cclxuLy9UaGlzIGZ1bmN0aW9uIG5vdCBvbmx5IGdlbmVyYXRlcyB0aGUgcm93cyBvZiB0aGUgZ3JpZCwgXHJcbi8vYnV0IGlzIGFsc28gcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgdGhlIHNxdWFyZXMgZm9yIGhvbGRpbmcgaW1wb3J0YW50IGluZm9ybWF0aW9uIHN1Y2ggYXMgd2hldGhlciBvciBub3QgYSBzcXVhcmUgaXMgZW1wdHkgXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVJvdyA9ICh0YXJnZXRHcmlkLCBjb2x1bW4sIGNvdW50LCBwbGF5ZXIpID0+IHtcclxuICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgXHJcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncm93Jyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gY29sdW1uOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZSA9IGkgKyAnLCcgKyBjb3VudDtcclxuICAgICAgICAgICAgY29uc3QgYXJlYSA9IHtcclxuICAgICAgICAgICAgICAgIGNvb3JkaW5hdGUsIFxyXG4gICAgICAgICAgICAgICAgeDogaSxcclxuICAgICAgICAgICAgICAgIHk6IGNvdW50LCBcclxuICAgICAgICAgICAgICAgIGhpdDogZmFsc2UsIFxyXG4gICAgICAgICAgICAgICAgb2NjdXBpZWQ6IGZhbHNlLCBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5wdXNoKGFyZWEpOyBcclxuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKGdlbmVyYXRlU3F1YXJlKHBsYXllciwgcGxheWVyLmJvYXJkQXJyYXlbcGxheWVyLmJvYXJkQXJyYXkubGVuZ3RoIC0gMV0sIGNvb3JkaW5hdGUudG9TdHJpbmcoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByb3cuc2V0QXR0cmlidXRlKCdjbGFzcycsICdyb3cnKTsgXHJcbiAgICAgICAgdGFyZ2V0R3JpZC5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgIGdlbmVyYXRlUm93KHRhcmdldEdyaWQsIGNvbHVtbiwgY291bnQgLSAxLCBwbGF5ZXIpICAgXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZVNxdWFyZSA9IChwbGF5ZXIsIGFyZWEsIElEKSA9PiB7XHJcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTsgXHJcbiAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdjbGFzcycsICdlbXB0eVNxdWFyZScpOyBcclxuICAgIHNxdWFyZS5zZXRBdHRyaWJ1dGUoJ2lkJywgcGxheWVyLm5hbWUgKyBcIi1cIiArIElEKTsgXHJcblxyXG4gICAgLy90byBzaG93IHRoZSBjb29yZGluYXRlcyBvbiByZW5kZXJcclxuICAvKlxyXG4gICAgY29uc3QgZGlzcGxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICAgIGRpc3BsYXkuc3R5bGUubWFyZ2luID0gJ2F1dG8nOyBcclxuICAgIGRpc3BsYXkuaW5uZXJIVE1MID0gSUQ7IFxyXG4gICAgc3F1YXJlLmFwcGVuZENoaWxkKGRpc3BsYXkpKi9cclxuICAgIFxyXG4gICAgc3F1YXJlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIC8vdHVyblRyYWNrZXIga2VlcHMgdHJhY2sgb2YgdGhlIHBsYXllcidzIHR1cm4gZXZlcnl0aW1lIHRoZXkgYXR0ZW1wdCB0byBoaXQgZWFjaCBvdGhlcidzIHNoaXBzXHJcbiAgICAgICAgLy9JZiB0aGUgcGxheWVyIGhpdHMgb25lIG9mIHRoZSBvcHBvbmVudCdzIHNoaXAsIGhlIGdldHMgYW5vdGhlciB0dXJuLlxyXG4gICAgICAgIGlmICghYXJlYS5oaXQgJiYgcGxheWVyLnR1cm5Cb29sSUQgIT09IHBsYXllci50dXJuVHJhY2tlci5nZXRUdXJuU3RhdHVzKCkgJiYgIXBsYXllci5nYW1lT2JqZWN0Lm92ZXIgJiYgIXBsYXllci5pc0FJKSB7XHJcbiAgICAgICAgICAgIGFyZWEuaGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgcGxheUNhbm5vbkF1ZGlvKCk7IFxyXG4gICAgICAgICAgICBpZiAoYXJlYS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgaGl0T2NjdXBpZWQocGxheWVyLCBzcXVhcmUsIGFyZWEueCwgYXJlYS55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhpdEVtcHR5KHNxdWFyZSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHBsYXllci50dXJuVHJhY2tlci50b2dnbGVUdXJuKCk7IFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gc3F1YXJlOyBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhpdEVtcHR5ID0gKHNxdWFyZSkgPT4ge1xyXG4gICAgc3F1YXJlLmNsYXNzTGlzdC50b2dnbGUoJ2hpdEVtcHR5U3F1YXJlJyk7XHJcbiAgICBpZiAoc3F1YXJlLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgY29uc3QgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZG90LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZG90JylcclxuICAgICAgICBzcXVhcmUuYXBwZW5kQ2hpbGQoZG90KTtcclxuICAgIH0gXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBoaXRPY2N1cGllZCA9IChwbGF5ZXIsIHNxdWFyZSwgeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIGlmIChwbGF5ZXIuaXNDb21wdXRlcikge1xyXG4gICAgICAgIHNxdWFyZS5jbGFzc0xpc3QucmVtb3ZlKCdoaXRFbXB0eVNxdWFyZScpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ29jY3VwaWVkU3F1YXJlJyk7XHJcbiAgICB9XHJcbiAgICBzcXVhcmUuY2xhc3NMaXN0LmFkZCgnaGl0T2NjdXBpZWRTcXVhcmUnKTtcclxuICAgIGlmIChzcXVhcmUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdjbGFzcycsICdkb3QnKVxyXG4gICAgICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkb3QpO1xyXG4gICAgfVxyXG4gXHJcbiAgICB2YXIgdGFyZ2V0ZWRfc2hpcCA9IG51bGw7IFxyXG4gICAgcGxheWVyLnNoaXBBcnJheS5mb3JFYWNoKHNoaXAgPT4ge1xyXG4gICAgICAgIHNoaXAuaGFzQmVlbkhpdCA9IHRydWU7IFxyXG4gICAgICAgIHNoaXAucG9zQXJyYXkuZm9yRWFjaChwb3MgPT4ge1xyXG4gICAgICAgICAgICBpZiAocG9zLnggPT09IHhfY29vciAmJiBwb3MueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MuaXNIaXQgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgIHNoaXAuaXNTdW5rID0gaXNTaGlwU3VuayhwbGF5ZXIsIHNoaXApOyBcclxuICAgICAgICAgICAgICAgIC8vaWYgdGhlIHBsYXllciBpcyBwbGF5aW5nIGFnYWluc3QgdGhlIEFJLCB0aGlzIG5vdGlmaWVzIHRoZSBBSSBvZiBpbXBvcnRhbnQgaW5mb1xyXG4gICAgICAgICAgICAgICAgLy8uLi5hYm91dCBzaGlwIGFuZCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhlIGNvbmZpcm1lZCBkYW1hZ2UgbG9jYXRpb24gXHJcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyLmlzUGxheWluZ0FnYWluc3RBSSAmJiBzaGlwLmlzU3Vuaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzQXJlYVNlY3VyZShzaGlwLCB4X2Nvb3IsIHlfY29vcilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG4gICAgY2hlY2tTaGlwcyhwbGF5ZXIpXHJcbn1cclxuXHJcbiIsImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCAnLi9zaGlwLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlR3JpZCB9IGZyb20gJy4vZ3JpZC5qcyc7IFxyXG5pbXBvcnQgJy4vbXlzdHlsZS5jc3MnO1xyXG5pbXBvcnQgeyBzdGFydEdhbWUsIHRyYWNrVHVybnMgfSBmcm9tICcuL2dhbWVMb29wLmpzJztcclxuaW1wb3J0IHsgZGVsQm9hcmQgfSBmcm9tICcuL3Jlc2V0LmpzJztcclxuLy9pbXBvcnQgeyBnZW5lcmF0ZUNvb3JkaW5hdGVzIH0gZnJvbSAnLi9wbGFjZVNoaXBzLmpzJztcclxuXHJcblxyXG4vL2ZvciB3YXRjaGluZyB0aGUgaHRtbCBmaWxlIFxyXG5yZXF1aXJlKCcuL2hvbWUuaHRtbCcpXHJcblxyXG52YXIgcGxheWVycyA9IHN0YXJ0R2FtZSgpO1xyXG5jb25zdCBzdGFydE92ZXJCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhcnRPdmVyQnV0dG9uJyk7XHJcbmNvbnN0IHBsYXllck9uZUFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyQXJlYU9uZScpO1xyXG5jb25zdCBwbGF5ZXJUd29BcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllckFyZWFUd28nKTtcclxuXHJcbnN0YXJ0T3ZlckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgIGRlbEJvYXJkKHBsYXllck9uZUFyZWEpO1xyXG4gICAgZGVsQm9hcmQocGxheWVyVHdvQXJlYSk7XHJcbiAgICBwbGF5ZXJzW1wicGxheWVyT25lXCJdLnJlc2V0KCk7IFxyXG4gICAgcGxheWVyc1tcInBsYXllclR3b1wiXS5yZXNldCgpOyBcclxuICAgIHBsYXllcnMgPSBzdGFydEdhbWUoKTsgXHJcbn0pO1xyXG5cclxuXHJcblxyXG4iLCIvL2ltcG9ydCB7Y3JlYXRlU2hpcCwgY3JlYXRlQ2FycmllciwgY3JlYXRlQmF0dGxlc2hpcCwgY3JlYXRlRGVzdHJveWVyLCBjcmVhdGVTdWJtYXJpbmUsIGNyZWF0ZVBhdHJvbCB9IGZyb20gJy4vc2hpcC5qcyc7IFxyXG5pbXBvcnQgeyBjcmVhdGVTaGlwIH0gZnJvbSAnLi9zaGlwLmpzJzsgXHJcbmltcG9ydCB7IGdlblJhbmRvbSB9IGZyb20gJy4vcmFuZEdlbi5qcyc7IFxyXG4vL1RoaXMgc2hvdWxkIGlkZW50aWZ5IHdoaWNoIGdyaWQgdG8gcGxhY2UgdGhlIHNoaXBzIGluXHJcbi8vSXQgc2hvdWxkIHJhbmRvbWl6ZSB0aGUgcGxhY2VtZW50LlxyXG4vL2l0IHNob3VsZCByZWNvZ25pemUgdGhlIGVkZ2VzIG9mIHRoZSBnaXJkIGFuZCBrbm93IG5vdCB0byBwbGFjZSBzaGlwcyB0aGF0IGdvZXMgYmV5b25kIHRoZSBlZGdlIFxyXG4vL2l0IHNob3VsZCBrbm93IG5vdCB0byBvdmVybGFwIHRoZSBzaGlwcyBcclxuXHJcbi8vRnVuY3Rpb25cclxuLy9EZXRlcm1pbmUgd2hhdCBzaGlwIGl0IHdpbGwgY3JlYXRlXHJcbi8vSWRlbnRpZnkgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCBcclxuLy9Mb29wOiBcclxuLy9HZW5lcmF0ZSByYW5kb20gbnVtYmVycyBmb3IgeCBhbmQgeSBjb29yZGluYXRlcyBcclxuLy9EZXRlcm1pbmUgaWYgdGhlIGNvb3JkaW5hdGVzIGFyZSByaWdodCBiYXNlZCBvbiB0aGUgZm9sbG93aW5nIGNyaXRlcmlhXHJcbi8vMS4pIFRoZSBzaGlwIGRvZXMgbm90IGdvIG91dCBvZiBib3VuZHMgb2YgdGhlIGdyaWQgXHJcbi8vMi4pIFRoZSBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW5vdGhlciBzaGlwIFxyXG4vL0JyZWFrIHRoZSBsb29wIHdoZW4gdGhlIHNoaXAgYXBwcm9wcmlhdGVseSBwbGFjZWQgXHJcblxyXG4vL0hvdyBkb2VzIHRoZSBnYW1lIGlkZW50aWZ5IHRoZSBvd25lcnNoaXAgb2YgdGhlIHNoaXA/XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHBsYWNlQWxsU2hpcHMgPSAocGxheWVyLCBncmlkTGVuZ3RoKSA9PiB7XHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAnY2FycmllcicsIDUsIGdyaWRMZW5ndGgpXHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAnYmF0dGxlc2hpcCcsIDQsIGdyaWRMZW5ndGgpXHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAnZGVzdHJveWVyJywgMywgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdzdWJtYXJpbmUnLCAzLCBncmlkTGVuZ3RoKVxyXG4gICAgcGxhY2VTaGlwKHBsYXllciwgJ3BhdHJvbCBib2F0MScsIDIsIGdyaWRMZW5ndGgpXHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAncGF0cm9sIGJvYXQyJywgMiwgZ3JpZExlbmd0aClcclxufVxyXG5cclxuLy9wbGFjZXMgdGhlIHBsYXllcnMgc2hpcFxyXG4vL1RoZXJlIHNob3VsZCBiZSBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRoYXQgcGxhY2VzIHRoZSBjb21wdXRlcidzIHNoaXAuIFxyXG4vL2dyaWRMZW5ndGggaXMgdGhlIG51bWJlciBvZiBjb2x1bW5zIG9uIHRoZSBwbGF5ZXIncyBib2FyZCBcclxuZXhwb3J0IGNvbnN0IHBsYWNlU2hpcCA9IChwbGF5ZXIsIHNoaXBUeXBlLCBsZW5ndGgsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIC8vcG9zaXRpb25lZCB3aWxsIHR1cm4gdHJ1ZSBpZiB0aGUgYXBwIGZpbmRzIGEgc3VpdGFibGUgYXJlYSB0byBwbGFjZSB0aGUgc2hpcCBvbiB0aGUgYm9hcmQgXHJcbiAgICB2YXIgcG9zaXRpb25lZCA9IGZhbHNlOyBcclxuXHJcbiAgICAvL2NyZWF0ZSBhIG5ldyBzaGlwIG9iamVjdCBcclxuICAgIGNvbnN0IHNoaXAgPSBjcmVhdGVTaGlwKGxlbmd0aCwgc2hpcFR5cGUpOyBcclxuXHJcbiAgICAvL1J1biB0aGUgdGhlIGxvb3AgdW50aWwgdGhlIGFwcCBmaW5kcyBhIHN1aXRhYmxlIHBvc2l0aW9uIHRvIHBsYWNlIHRoZSBzaGlwIG9uIHRoZSBwbGF5ZXIncyBib2FyZCBcclxuICAgIHdoaWxlICghcG9zaXRpb25lZCkge1xyXG4gICAgICAgIHZhciBjb29yZGluYXRlID0gZ2VuZXJhdGVDb29yZGluYXRlcyhncmlkTGVuZ3RoKTtcclxuICAgICAgICBcclxuICAgICAgICAvL0lmIDEsIHByb2dyYW1zIHRyaWVzIHRvIHNlZSBpZiBzaGlwIGNhbiBiZSBwbGFjZWQgaG9yaXpvbnRhbGx5IGZpcnN0LCB0aGVuIHZlcnRpY2FsbHlcclxuICAgICAgICAvL0lmIDIsIHByb2dyYW1zIHRyaWVzIHRvIHNlZSBpZiBzaGlwIGNhbiBiZSBwbGFjZWQgdmVydGljYWxseSBmaXJzdCwgdGhlbiBob3Jpem9udGFsbHlcclxuICAgICAgICB2YXIgb3JpZW50YXRpb24gPSBnZW5SYW5kb20oMik7XHJcbiAgICAgXHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSAxKSB7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaGlwIGZvciBwbGFjZW1lbnQ6IFwiICsgc2hpcFR5cGUgKyBcIjsgZmlyc3QtYXR0ZW1wdDogaG9yaXpvbnRhbCBcIilcclxuICAgICAgICAgICAgcG9zaXRpb25lZCA9IGhvcml6VGhlblZlcnQocGxheWVyLCBjb29yZGluYXRlLCBzaGlwLCBsZW5ndGgsIGdyaWRMZW5ndGgpIFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gMikge1xyXG4gICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiU2hpcCBmb3IgcGxhY2VtZW50OiBcIiArIHNoaXBUeXBlICsgXCI7IGZpcnN0IGF0dGVtcHQ6IHZlcnRpY2FsXCIpXHJcbiAgICAgICAgICAgIHBvc2l0aW9uZWQgPSB2ZXJ0VGhlbkhvcml6KHBsYXllciwgY29vcmRpbmF0ZSwgc2hpcCwgbGVuZ3RoLCBncmlkTGVuZ3RoKSBcclxuICAgICAgICB9XHJcbiAgICAgICAvKiBpZiAoIXBvc2l0aW9uZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1JlcnVuIGxvb3AgZm9yICcgKyBzaGlwVHlwZSk7XHJcbiAgICAgICAgfSovXHJcbiAgXHJcbiAgICB9XHJcbn0gXHJcblxyXG5jb25zdCBob3JpelRoZW5WZXJ0ID0gKHBsYXllciwgY29vcmRpbmF0ZSwgc2hpcCwgbGVuZ3RoLCBncmlkTGVuZ3RoKSA9PiB7XHJcbiAgICAvL2lmIHRoZSBzaGlwIGNhbiBiZSBwbGFjZWQgaG9yaXpvbnRhbGx5IHdpdGhvdXQgZ29pbmcgb3V0IG9mIGJvdW5kcy4gXHJcbiAgICB2YXIgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTsgXHJcbiAgICBpZiAoY29vcmRpbmF0ZS54ICsgbGVuZ3RoIDw9IGdyaWRMZW5ndGgpIHtcclxuICAgICAgICBpZiAoIWlzSXRPY2N1cHBpZWQocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIHRydWUpKSB7XHJcbiAgICAgICAgICAgIC8vY29kZSBmb3IgcGxhY2luZyBzaGlwIFxyXG4gICAgICAgICAgICAvL2Z1bmN0aW9uIGhhcyB0byBrZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgc2hpcFxyXG4gICAgICAgICAgICAvL1RoaXMgaXMgdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBmb3IgYSBmdW5jdGlvbiB0aGF0IGtlZXBzIHRyYWNrIG9mIHdoZXRoZXIgYSBzaGlwIGlzIHN1bmsgb3Igbm90IFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IChjb29yZGluYXRlLnggKyBpKSAmJiBpdGVtLnkgPT09IGNvb3JkaW5hdGUueSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZVNoaXBQYXJ0KHBsYXllciwgaXRlbSwgc2hpcCwgbGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBzaGlwIG9uY2UgaXQncyBwbGFjZWRcclxuICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9pZiBwbGFjaW5nIHNoaXAgaG9yaXpvbnRhbGx5IG1ha2VzIGl0IG91dCBvZiBib3VuZHMsIHRyeSBwbGFjaW5nIGl0IHZlcnRpY2FsbHlcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChjb29yZGluYXRlLnkgLSBsZW5ndGggPj0gMCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzSXRPY2N1cHBpZWQocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNvb3JkaW5hdGUueCAmJiBpdGVtLnkgPT09IChjb29yZGluYXRlLnkgLSBpKSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VTaGlwUGFydChwbGF5ZXIsIGl0ZW0sIHNoaXAsIGxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZCBcclxuICAgICAgICAgICAgICAgIHBsYXllci5zaGlwQXJyYXkucHVzaChzaGlwKVxyXG4gICAgICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2lmIHRoZSBzaGlwIGNhbid0IGJlIHBsYWNlIGhvcml6b250YWxseSBvciB2ZXJ0aWNhbGx5LCByZXJ1biBsb29wOyBcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsaWRQbGFjZW1lbnQ7IFxyXG59XHJcblxyXG5jb25zdCB2ZXJ0VGhlbkhvcml6ID0gKHBsYXllciwgY29vcmRpbmF0ZSwgc2hpcCwgbGVuZ3RoLCBncmlkTGVuZ3RoKSA9PiB7XHJcbiAgICB2YXIgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTsgXHJcbiAgICBpZiAoY29vcmRpbmF0ZS55IC0gbGVuZ3RoID49IDApIHtcclxuICAgICAgICBpZiAoIWlzSXRPY2N1cHBpZWQocGxheWVyLCBjb29yZGluYXRlLCBsZW5ndGgsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IGNvb3JkaW5hdGUueCAmJiBpdGVtLnkgPT09IChjb29yZGluYXRlLnkgLSBpKSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZVNoaXBQYXJ0KHBsYXllciwgaXRlbSwgc2hpcCwgbGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBzaGlwIG9uY2UgaXQncyBwbGFjZWRcclxuICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNvb3JkaW5hdGUueCArIGxlbmd0aCA8PSBncmlkTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNJdE9jY3VwcGllZChwbGF5ZXIsIGNvb3JkaW5hdGUsIGxlbmd0aCwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuYm9hcmRBcnJheS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSAoY29vcmRpbmF0ZS54ICsgaSkgJiYgaXRlbS55ID09PSBjb29yZGluYXRlLnkgJiYgaXRlbS5vY2N1cGllZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlU2hpcFBhcnQocGxheWVyLCBpdGVtLCBzaGlwLCBsZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBzaGlwIG9uY2UgaXQncyBwbGFjZWRcclxuICAgICAgICAgICAgICAgIHBsYXllci5zaGlwQXJyYXkucHVzaChzaGlwKVxyXG4gICAgICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YWxpZFBsYWNlbWVudCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB2YWxpZFBsYWNlbWVudDsgXHJcblxyXG59XHJcblxyXG5jb25zdCBwbGFjZVNoaXBQYXJ0ID0gKHBsYXllciwgaXRlbSwgc2hpcCwgbGVuZ3RoKSA9PiB7XHJcbiAgICBjb25zdCBkb21fY29vcmRpbmF0ZXMgPSBwbGF5ZXIubmFtZSArICctJyArIGl0ZW0ueCArICcsJyArIGl0ZW0ueTtcclxuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbV9jb29yZGluYXRlcylcclxuXHJcblxyXG4gICAgaWYgKCFwbGF5ZXIuaXNDb21wdXRlcikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbV9jb29yZGluYXRlcykuY2xhc3NMaXN0LnJlbW92ZSgnZW1wdHlTcXVhcmUnKVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRvbV9jb29yZGluYXRlcykuY2xhc3NMaXN0LmFkZCgnb2NjdXBpZWRTcXVhcmUnKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcblxyXG4gICAgfVxyXG4gICAgLy9kaXNwbGF5cyBzaGlwIGxlbmd0aCBvbiBzcXVhcmVzXHJcbiAgICAvKlxyXG4gICAgY29uc3Qgc2hpcF90eXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXHJcbiAgICBzaGlwX3R5cGUuaW5uZXJIVE1MID0gbGVuZ3RoOyBcclxuICAgIHNxdWFyZS5hcHBlbmQoc2hpcF90eXBlKTtcclxuICAgICovXHJcblxyXG5cclxuICAgIGl0ZW0ub2NjdXBpZWQgPSB0cnVlO1xyXG4gICAgc2hpcC5zZXRQb3MoaXRlbS54LCBpdGVtLnkpO1xyXG59XHJcblxyXG4vL3RoaXMgY2FuIGJlIHJldXNlZCB0byBkZXRlcm1pbmUgaWYgaGl0IGFyZWEgaXMgb2NjdXBpZWQgb3Igbm90IFxyXG5leHBvcnQgY29uc3QgaXNJdE9jY3VwcGllZCA9IChwbGF5ZXIsIGNvb3JkaW5hdGUsIGxlbmd0aCwgaG9yaXpvbnRhbCkgPT4ge1xyXG4gICAvLyBjb25zb2xlLmxvZygneCA9ICcgKyBjb29yZGluYXRlLngpXHJcbiAgIC8vIGNvbnNvbGUubG9nKCd5ID0gJyArIGNvb3JkaW5hdGUueSlcclxuICAgIHZhciBpc09jY3VwaWVkID0gZmFsc2U7IFxyXG4gICAgaWYgKGhvcml6b250YWwpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSAoY29vcmRpbmF0ZS54ICsgaSkgJiYgaXRlbS55ID09PSBjb29yZGluYXRlLnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKmNvbnNvbGUubG9nKFwicGxheWVyJ3MgY29vcmRpbmF0ZXMgKFwiICsgaXRlbS54ICsgXCIsXCIgKyBpdGVtLnkgKyBcIik6IFwiICsgaXRlbS5vY2N1cGllZCArIFwiXFxuXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRlc3RlZCBjb29yZGluYXRlcyAoXCIgKyAoY29vcmRpbmF0ZS54ICsgaSkgKyBcIixcIiArIGNvb3JkaW5hdGUueSArIFwiKVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJob3Jpem9udGFsOiBcIiArIGl0ZW0ub2NjdXBpZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gbGVuZ3RoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9JIGhhZCB0byBhZGQgdGhlIGZvbGxvd2luZyBibG9jayBvZiBjb2RlIGxhdGVyIGFzIGFuIGV4dHJhIG1lYXN1cmUgdG8gY2hlY2sgZm9yIG9jY3VwaWVkIGFyZWFzIFxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwLnBvc0FycmF5LmZvckVhY2gocG9zID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zLnggPT09IChjb29yZGluYXRlLnggKyBpKSAmJiBwb3MueSA9PT0gY29vcmRpbmF0ZS55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxlbmd0aDsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy9pZiBzaGlwIHdlcmUgdG8gYmUgcGxhY2VkIHZlcnRpY2FsbHlcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIoXCIgKyBpdGVtLnggKyBcIixcIiArIGl0ZW0ueSArIFwiKTogXCIgKyBpdGVtLm9jY3VwaWVkICsgXCJcXG5cIiArIFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVzdGVkIGNvb3JkaW5hdGVzIChcIiArIGNvb3JkaW5hdGUueCArIFwiLFwiICsgKGNvb3JkaW5hdGUueSAtIGkpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY29vcmRpbmF0ZS54ICYmIGl0ZW0ueSA9PT0gKGNvb3JkaW5hdGUueSAtIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwidmVydGljYWw6IFwiICsgaXRlbS5vY2N1cGllZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGg7ICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9JIGhhZCB0byBhZGQgdGhlIGZvbGxvd2luZyBibG9jayBvZiBjb2RlIGxhdGVyIGFzIGFuIGV4dHJhIG1lYXN1cmUgdG8gY2hlY2sgZm9yIG9jY3VwaWVkIGFyZWFzIFxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlwLnBvc0FycmF5LmZvckVhY2gocG9zID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zLnggPT09IGNvb3JkaW5hdGUueCAmJiBwb3MueSA9PT0gKGNvb3JkaW5hdGUueSAtIGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT2NjdXBpZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAvLyAgY29uc3QgbWVzc2FnZSA9ICcoJyArIGNvb3JkaW5hdGUueCArIFwiLFwiICsgY29vcmRpbmF0ZS55ICsgXCIpIFwiICsgaXNPY2N1cGllZCArIFwiOyBob3Jpem9udGFsOiBcIiArIGhvcml6b250YWwgKyBcIjsgTGVuZ3RoOiBcIiArIGxlbmd0aDsgXHJcbiAgIC8vIHBsYXllci5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIGlzT2NjdXBpZWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZW5lcmF0ZUNvb3JkaW5hdGVzID0gY29sdW1ucyA9PiB7XHJcbiAgICBjb25zdCB4ID0gZ2VuUmFuZG9tKGNvbHVtbnMpO1xyXG4gICAgY29uc3QgeSA9IGdlblJhbmRvbShjb2x1bW5zKTsgXHJcbiAgICByZXR1cm4ge3gseX1cclxufSAiLCJpbXBvcnQgQ2Fubm9uMSBmcm9tICcuL2F1ZGlvL2Nhbm5vbi1zaG90LTEubXAzJztcclxuaW1wb3J0IENhbm5vbjIgZnJvbSAnLi9hdWRpby9jYW5ub24tc2hvdC0yLm1wMyc7XHJcbmltcG9ydCBDYW5ub24zIGZyb20gJy4vYXVkaW8vY2Fubm9uLXNob3QtMy5tcDMnO1xyXG5pbXBvcnQgeyBnZW5SYW5kb20gfSBmcm9tICcuL3JhbmRHZW4uanMnO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBwbGF5Q2Fubm9uMSgpIHtcclxuICAgIGNvbnN0IENhbm5vbk9uZSA9IG5ldyBBdWRpbyhDYW5ub24xKTtcclxuICAgIENhbm5vbk9uZS5wbGF5KCk7IFxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5Q2Fubm9uMigpIHtcclxuICAgIGNvbnN0IENhbm5vblR3byA9IG5ldyBBdWRpbyhDYW5ub24yKTtcclxuICAgIENhbm5vblR3by5wbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXlDYW5ub24zKCkge1xyXG4gICAgY29uc3QgQ2Fubm9uVGhyZWUgPSBuZXcgQXVkaW8oQ2Fubm9uMyk7XHJcbiAgICBDYW5ub25UaHJlZS5wbGF5KCk7XHJcbn1cclxuXHJcbmNvbnN0IGF1ZGlvQXJyYXkgPSBbcGxheUNhbm5vbjEsIHBsYXlDYW5ub24yLCBwbGF5Q2Fubm9uM11cclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5Q2Fubm9uQXVkaW8gPSAoKSA9PiB7XHJcbiAgICB2YXIgY2hvb3NlID0gZ2VuUmFuZG9tKDMpIC0gMTtcclxuICAgIGF1ZGlvQXJyYXlbY2hvb3NlXSgpO1xyXG59IiwiLy9IYXZlIGFuIDItdGllciBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBzaGlwcyBhbmQgdGhlIGNvb3JkaW5hdGVzIFxyXG4vL1RoZSBzaGlwcyBhcnJheXMgb2YgXHJcbi8vVGhlIGdhbWUgaGFzIHRvIHJlY29nbml6ZSB0aGF0IHRoZSBzaGlwcyBjYW5ub3QgZ28gb3V0IG9mIGJvdW5kcy4gXHJcblxyXG4vL2NvbnN0IHNhbXBsZWFycmF5ID0gW1wiY2FycmllclwiPSBbXSwgXCJiYXR0bGVzaGlwXCI9W10sIFwiZGVzdHJveWVyXCIgPSBbXSwgXCJzdWJtYXJpbmVcIiA9IFtdLCBcInBhdHJvbFwiPVtdXVxyXG5cclxuaW1wb3J0IHsgZ2VuZXJhdGVHcmlkIH0gZnJvbSAnLi9ncmlkLmpzJztcclxuaW1wb3J0IHsgcGxhY2VBbGxTaGlwcyB9IGZyb20gJy4vcGxhY2VTaGlwcy5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBsYXllciA9IChuYW1lLCBvcHBvbmVudCwgY29udGFpbmVyLCBpc0FJKSA9PiB7XHJcbiAgICBjb25zdCBuZXdwbGF5ZXIgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICBuZXdwbGF5ZXIuYm9hcmRBcnJheSA9IFtdO1xyXG4gICAgbmV3cGxheWVyLmJvYXJkQ29sdW1ucyA9IDA7IFxyXG4gICAgbmV3cGxheWVyLmJvYXJkTm9kZSA9IG51bGw7XHJcbiAgICBcclxuICAgIG5ld3BsYXllci5nYW1lT2JqZWN0ID0gbnVsbDsgXHJcbiAgICBuZXdwbGF5ZXIuc2V0R2FtZU9iamVjdCA9IGdhbWUgPT4ge1xyXG4gICAgICAgIG5ld3BsYXllci5nYW1lT2JqZWN0ID0gZ2FtZTsgXHJcbiAgICB9XHJcblxyXG4gICAgLy9BcnJheSBvZiBhbGwgdGhlIHBsYXllcidzIHNoaXBzXHJcbiAgICBuZXdwbGF5ZXIuc2hpcEFycmF5ID0gW107IFxyXG4gICAgbmV3cGxheWVyLm5hbWUgPSBuYW1lO1xyXG4gICAgbmV3cGxheWVyLm9wcG9uZW50TmFtZSA9IG9wcG9uZW50OyBcclxuICAgIG5ld3BsYXllci5vcHBvbmVudCA9IG51bGw7IFxyXG4gICAgbmV3cGxheWVyLnNldE9wcG9uZW50ID0gb3Bwb25lbnQgPT4ge1xyXG4gICAgICAgIG5ld3BsYXllci5vcHBvbmVudCA9IG9wcG9uZW50OyBcclxuICAgIH1cclxuICAgIG5ld3BsYXllci5pc0NvbXB1dGVyID0gaXNBSTsgXHJcbiAgICBuZXdwbGF5ZXIuaXNQbGF5aW5nQWdhaW5zdEFJID0gZmFsc2U7IFxyXG4gICAgbmV3cGxheWVyLm1lc3NhZ2VzID0gW107XHJcblxyXG4gICAgLy90dXJuVHJhY2tlciBpcyBhbiBvYmplY3Qgc2hhcmVkIGJldHdlZW4gcGxheWVycyB0aGF0IHRyYWNrcyB3aG9zZSB0dXJuIGl0IGlzIFxyXG4gICAgbmV3cGxheWVyLnR1cm5UcmFja2VyID0gbnVsbDsgXHJcbiAgICAvL3R1cm5Cb29sSUQgaGVscHMgdG8gdHJhY2sgdHVybnMgXHJcbiAgICBuZXdwbGF5ZXIudHVybkJvb2xJRCA9IGZhbHNlOyBcclxuICAgIG5ld3BsYXllci5zZXRUdXJuVHJhY2tlciA9IChpdGVtLCB0dXJuSUQpID0+IHtcclxuICAgICAgICBuZXdwbGF5ZXIudHVyblRyYWNrZXIgPSBpdGVtOyBcclxuICAgICAgICBuZXdwbGF5ZXIudHVybkJvb2xJRCA9IHR1cm5JRDsgXHJcbiAgICB9XHJcbiAgICBuZXdwbGF5ZXIuc2V0Qm9hcmRDb2x1bW5zID0gKGNvbHVtbnMpID0+IHtcclxuICAgICAgICBuZXdwbGF5ZXIuYm9hcmRDb2x1bW5zID0gY29sdW1uczsgXHJcbiAgICB9XHJcbiAgICBuZXdwbGF5ZXIuZ2V0Qm9hcmRDb2x1bW5zID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXdwbGF5ZXIuYm9hcmRDb2x1bW5zOyBcclxuICAgIH1cclxuICAgIG5ld3BsYXllci5yZXNldCA9ICgpID0+IHtcclxuICAgICAgICB3aGlsZSAobmV3cGxheWVyLmJvYXJkQXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3cGxheWVyLmJvYXJkQXJyYXkucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld3BsYXllci5ib2FyZEFycmF5ID0gW107XHJcbiAgICAgICAgbmV3cGxheWVyLmJvYXJkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgd2hpbGUgKG5ld3BsYXllci5zaGlwQXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3cGxheWVyLnNoaXBBcnJheS5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3cGxheWVyLnNoaXBBcnJheSA9IFtdO1xyXG4gICAgICAgIG5ld3BsYXllci5uYW1lID0gbmFtZTtcclxuICAgICAgICB3aGlsZSAobmV3cGxheWVyLm1lc3NhZ2VzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ld3BsYXllci5tZXNzYWdlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3cGxheWVyLm1lc3NhZ2VzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGxheWVyQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcik7XHJcbiAgICBwbGF5ZXJBcmVhLmFwcGVuZENoaWxkKGdlbmVyYXRlR3JpZCgxMCwgbmV3cGxheWVyKSk7XHJcbiAgICBwbGFjZUFsbFNoaXBzKG5ld3BsYXllciwgMTApXHJcblxyXG5cclxuXHJcbiAgICByZXR1cm4gbmV3cGxheWVyOyBcclxufVxyXG4iLCJleHBvcnQgY29uc3QgZ2VuUmFuZG9tID0gbnVtID0+IHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pICsgMTsgXHJcbn1cclxuXHJcblxyXG4iLCIvL0RlbGV0ZSBEb20gYWxsIHJlbGV2YW50ZSBkb20gZWxlbWVudHNcclxuLy9SZXNldCBwbGF5ZXIncyBhcnJheXMgXHJcblxyXG4vL25lZWQgdG8gZGVsZXRlIGdyaWQgaW5mb3JtYXRpb24gXHJcblxyXG5leHBvcnQgY29uc3QgZGVsQm9hcmQgPSAoY29udGFpbmVyTm9kZSkgPT4ge1xyXG4gICAgY29uc3QgZ3JpZE5vZGUgPSBjb250YWluZXJOb2RlLmNoaWxkTm9kZXNbMF07IFxyXG4gICAgY29uc3Qgcm93Tm9kZUFycmF5ID0gZ3JpZE5vZGUuY2hpbGROb2RlczsgXHJcbiAgICByb3dOb2RlQXJyYXkuZm9yRWFjaChyb3cgPT4ge1xyXG4gICAgICAgIHdoaWxlIChyb3cuY2hpbGROb2Rlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgcm93LnJlbW92ZUNoaWxkKHJvdy5sYXN0RWxlbWVudENoaWxkKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHdoaWxlIChncmlkTm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGdyaWROb2RlLnJlbW92ZUNoaWxkKGdyaWROb2RlLmxhc3RFbGVtZW50Q2hpbGQpOyBcclxuICAgIH1cclxuICAgIGNvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQoZ3JpZE5vZGUpOyBcclxufVxyXG5cclxuIiwiLy9HcmlkIHNob3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiBlYWNoIGJvYXRcclxuLy9PcHRpb246IEtlZXAgdHJhY2sgb2YgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGlwJ3MgZnJvbnQgYXJlYSB0aGVuIGRldGVybWluZSB3aGV0aGVyIHRoZSBzaGlwIGlzIHBsYWNlZCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseVxyXG4vL09wdGlvbiAyOiBLZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiBhbGwgdGhlIHNoaXBzIHVuaXRzXHJcblxyXG4vKlxyXG5leHBvcnQgY29uc3Qgc2hpcCA9IHtcclxuICAgIGxlbmd0aDogMCxcclxuICAgIGlzU3VuazogZmFsc2UsIFxyXG4gICAgcG9zQXJyYXk6IFtdLCBcclxuICAgIHR5cGU6ICcnLCBcclxuICAgIHNldFBvcyh4X2Nvb3IsIHlfY29vcikge1xyXG4gICAgICAgIHRoaXMucG9zQXJyYXkucHVzaCh7eDogeF9jb29yLCB5OiB5X2Nvb3J9KVxyXG4gICAgfSwgXHJcbn1cclxuKi9cclxuLy9UaGlzIG1ldGhvZCBkb2Vzbid0IHdvcmsgYmVjYXVzZSBmb3Igc29tZSByZWFzb24sIGVhY2ggc2hpcCB3YXMgcmVjb3JkaW5nIGV2ZXJ5IHNoaXBzIHBvc2l0aW9ucy4gXHJcbi8vQSByZXZpc2VkIHZlcnNpb24gaXMgd3JpdHRlbiBiZWxvdy5cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVTaGlwID0gKGxlbmd0aCwgdHlwZSkgPT4ge1xyXG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBPYmplY3QoKTsgXHJcbiAgICBuZXdTaGlwLmxlbmd0aCA9IGxlbmd0aDsgXHJcbiAgICBuZXdTaGlwLnR5cGUgPSB0eXBlOyBcclxuICAgIG5ld1NoaXAuaXNTdW5rID0gZmFsc2U7XHJcbiAgICBuZXdTaGlwLmhhc0JlZW5IaXQgPSBmYWxzZTsgXHJcbiAgICBuZXdTaGlwLnBvc0FycmF5ID0gW107XHJcbiAgICBuZXdTaGlwLnNldFBvcyA9ICh4X2Nvb3IsIHlfY29vcikgPT57XHJcbiAgICAgICAgbmV3U2hpcC5wb3NBcnJheS5wdXNoKHsgeDogeF9jb29yLCB5OiB5X2Nvb3IsIGlzSGl0OiBmYWxzZSB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1NoaXA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpc1NoaXBTdW5rID0gKHBsYXllciwgc2hpcCkgPT4ge1xyXG4gICAgdmFyIGlzU3VuayA9IHRydWU7XHJcbiAgICBzaGlwLnBvc0FycmF5LmZvckVhY2gocG9zID0+IHtcclxuICAgICAgICAvL2lmIGF0IGxlYXN0IG9uZSBwYXJ0IG9mIHRoZSBzaGlwIGlzIG5vdCBoaXQsIGlzU3VuayBpcyBmYWxzZTsgXHJcbiAgICAgICAgaWYgKCFwb3MuaXNIaXQpIHtcclxuICAgICAgICAgICAgaXNTdW5rID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGlmIChpc1N1bmspIHtcclxuICAgICAgICBjb25zdCBhbm5vdW5jZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5ub3VuY2VtZW50Jyk7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHBsYXllci5uYW1lICsgXCIncyBcIiArIHNoaXAudHlwZSArIFwiIGhhcyBiZWVuIHN1bmshXCI7IFxyXG4gICAgICAgIGFubm91bmNlbWVudC5pbm5lckhUTUwgPSBtZXNzYWdlOyBcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiBpc1N1bms7XHJcbn0iLCJpbXBvcnQgeyBydW5BSSB9IGZyb20gJy4vY29tcHV0ZXJBSS5qcyc7IFxyXG5cclxuZXhwb3J0IGNvbnN0IHRyYWNrVHVybnMgPSAocGxheWVyT25lLCBwbGF5ZXJUd28pID0+IHtcclxuICAgIGNvbnN0IGtlZXBUcmFjayA9IG5ldyBPYmplY3QoKTtcclxuICAgIGtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuID0gdHJ1ZTtcclxuICAgIGtlZXBUcmFjay50b2dnbGVUdXJuID0gKCkgPT4ge1xyXG4gICAgICAgIGtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuID0gIWtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuO1xyXG4gICAgICAgIGtlZXBUcmFjay5kaXNwbGF5VHVybigpO1xyXG4gICAgICAgIGlmIChwbGF5ZXJUd28uaXNDb21wdXRlciAmJiAha2VlcFRyYWNrLnBsYXllck9uZVR1cm4pIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHJ1bkFJKHBsYXllclR3bykgfSwgMjAwMCk7IFxyXG4gICAgICAgICAgLy8gIHJ1bkFJKHBsYXllclR3bylcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAoa2VlcFRyYWNrLmRpc3BsYXlUdXJuID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChrZWVwVHJhY2sucGxheWVyT25lVHVybikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXllciBvbmUncyB0dXJuXCIpXHJcbiAgICAgICAgICAgIHR1cm5NZXNzYWdlLmlubmVySFRNTCA9IFwiUGxheWVyIE9uZSdzIFR1cm5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGxheWVyIHR3bydzIHR1cm5cIilcclxuICAgICAgICAgICAgdHVybk1lc3NhZ2UuaW5uZXJIVE1MID0gXCJQbGF5ZXIgVHdvJ3MgVHVyblwiO1xyXG4gICAgICAgIH1cclxuICAgIH0pKClcclxuICAgIGtlZXBUcmFjay5nZXRUdXJuU3RhdHVzID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBrZWVwVHJhY2sucGxheWVyT25lVHVybjtcclxuICAgIH1cclxuICAgIHBsYXllck9uZS5zZXRUdXJuVHJhY2tlcihrZWVwVHJhY2ssIHRydWUpO1xyXG4gICAgcGxheWVyVHdvLnNldFR1cm5UcmFja2VyKGtlZXBUcmFjaywgZmFsc2UpO1xyXG4gICAgcmV0dXJuIGtlZXBUcmFjaztcclxufSIsIlxyXG5leHBvcnQgY29uc3QgY2hlY2tTaGlwcyA9IChwbGF5ZXIpID0+IHtcclxuICAgIHZhciBhbGxTdW5rID0gdHJ1ZTsgXHJcbiAgICBwbGF5ZXIuc2hpcEFycmF5LmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgaWYgKCFzaGlwLmlzU3Vuaykge1xyXG4gICAgICAgICAgICBhbGxTdW5rID0gZmFsc2U7IFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICBpZiAoYWxsU3Vuaykge1xyXG4gICAgICAgIGFubm91bmNlV2lubmVyKHBsYXllcilcclxuICAgIH0gXHJcbn1cclxuXHJcbmNvbnN0IGFubm91bmNlV2lubmVyID0gKHBsYXllcikgPT4ge1xyXG4gICAgY29uc29sZS5sb2cocGxheWVyKVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZEdhbWVNZXNzYWdlJykuaW5uZXJIVE1MID0gJ1RoZSB3aW5uZXIgaXMgJyArIHBsYXllci5vcHBvbmVudE5hbWUgKyBcIiFcIjsgXHJcbiAgICBwbGF5ZXIuZ2FtZU9iamVjdC5lbmRHYW1lKCk7IFxyXG59IiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIjY29udGFpbmVyIHtcXHJcXG53aWR0aDogMTAwJTsgXFxyXFxuaGVpZ2h0OiAxMDAlOyBcXHJcXG5hbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxufVxcclxcbiN0aXRsZUNvbnRhaW5lciB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jbWVzc2FnZUNvbnRhaW5lciB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG50ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jYW5ub3VuY2VtZW50c0NvbnRhaW5lciB7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDIwcHg7IFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI2Fubm91bmNlbWVudCB7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNlbmRHYW1lTWVzc2FnZUFyZWEge1xcclxcbiAgICBtaW4taGVpZ2h0OiAyMHB4O1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuI3R1cm5NZXNzYWdlLCAjZW5kR2FtZU1lc3NhZ2Uge1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbiNpbm5lckNvbnRhaW5lciB7XFxyXFxud2lkdGg6IDkwJTsgXFxyXFxuaGVpZ2h0OiAxMDAlOyBcXHJcXG5tYXJnaW46IGF1dG87IFxcclxcbmp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG5kaXNwbGF5OiBmbGV4OyBcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSwgI3AyWm9uZSB7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbiNwMVpvbmUge1xcclxcbn1cXHJcXG5cXHJcXG4jcDJab25lIHtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuI3BsYXllcjFBcmVhLCAjcGxheWVyMkFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMUFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMkFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jYnV0dG9uQ29udGFpbmVyIHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG50ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbmFsaWduLWNvbnRlbnQ6IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNzdGFydE92ZXJCdXR0b24ge1xcclxcbiAgICBmb250LWZhbWlseTogVmVyZGFuYTsgXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XFxyXFxuICAgIHBhZGRpbmc6IDEwcHg7IFxcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxufVxcclxcblxcclxcbmRpdi5lbXB0eVNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQycHg7XFxyXFxuICAgIGhlaWdodDogNDJweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzY3OTVmZjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdE9jY3VwaWVkU3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQwcHg7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0T2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNDBweDtcXHJcXG4gICAgaGVpZ2h0OiA0MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1MGFhMDA7IFxcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTBhYTAwO1xcclxcbn1cXHJcXG5cXHJcXG4ucm93IHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbm1hcmdpbi1sZWZ0OiBhdXRvO1xcclxcbm1hcmdpbi1yaWdodDogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLmRvdCB7XFxyXFxud2lkdGg6IDVweDtcXHJcXG5oZWlnaHQ6IDVweDtcXHJcXG5ib3JkZXItcmFkaXVzOiA1cHg7IFxcclxcbmJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7IFxcclxcbm1hcmdpbjogYXV0bztcXHJcXG50b3A6IDUwJTtcXHJcXG5sZWZ0OiA1MCU7XFxyXFxubWFyZ2luLXRvcDogNTAlO1xcclxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbXlzdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7QUFDQSxXQUFXO0FBQ1gsWUFBWTtBQUNaLHFCQUFxQjtBQUNyQjtBQUNBO0lBQ0ksV0FBVztJQUNYLGtCQUFrQjtBQUN0Qjs7QUFFQTtBQUNBLFdBQVc7QUFDWCxxQkFBcUI7QUFDckIsa0JBQWtCO0FBQ2xCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsa0JBQWtCO0lBQ2xCLFdBQVc7QUFDZjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtBQUNBLFVBQVU7QUFDVixZQUFZO0FBQ1osWUFBWTtBQUNaLDhCQUE4QjtBQUM5QixhQUFhO0FBQ2I7O0FBRUE7SUFDSSxjQUFjO0lBQ2Qsa0JBQWtCO0FBQ3RCOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEIsa0JBQWtCO0FBQ2xCLHFCQUFxQjtBQUNyQjs7QUFFQTtJQUNJLG9CQUFvQjtJQUNwQix5QkFBeUI7SUFDekIsYUFBYTtJQUNiLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0FBQ3pCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6Qix1QkFBdUI7SUFDdkIscUJBQXFCOztBQUV6Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osY0FBYztJQUNkLFNBQVM7SUFDVCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLFdBQVc7SUFDWCxZQUFZO0lBQ1osYUFBYTtBQUNqQjs7QUFFQTtBQUNBLFdBQVc7QUFDWCxZQUFZO0FBQ1osaUJBQWlCO0FBQ2pCLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBLFVBQVU7QUFDVixXQUFXO0FBQ1gsa0JBQWtCO0FBQ2xCLHlCQUF5QjtBQUN6QixZQUFZO0FBQ1osUUFBUTtBQUNSLFNBQVM7QUFDVCxlQUFlO0FBQ2ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiI2NvbnRhaW5lciB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxuYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG4jdGl0bGVDb250YWluZXIge1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI21lc3NhZ2VDb250YWluZXIge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5hbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxudGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI2Fubm91bmNlbWVudHNDb250YWluZXIge1xcclxcbiAgICBtaW4taGVpZ2h0OiAyMHB4OyBcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNhbm5vdW5jZW1lbnQge1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jZW5kR2FtZU1lc3NhZ2VBcmVhIHtcXHJcXG4gICAgbWluLWhlaWdodDogMjBweDtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbiN0dXJuTWVzc2FnZSwgI2VuZEdhbWVNZXNzYWdlIHtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4jaW5uZXJDb250YWluZXIge1xcclxcbndpZHRoOiA5MCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxubWFyZ2luOiBhdXRvOyBcXHJcXG5qdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxyXFxuZGlzcGxheTogZmxleDsgXFxyXFxufVxcclxcblxcclxcbiNwMVpvbmUsICNwMlpvbmUge1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4jcDFab25lIHtcXHJcXG59XFxyXFxuXFxyXFxuI3AyWm9uZSB7XFxyXFxuXFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIxQXJlYSwgI3BsYXllcjJBcmVhIHtcXHJcXG59XFxyXFxuXFxyXFxuI3BsYXllcjFBcmVhIHtcXHJcXG59XFxyXFxuXFxyXFxuI3BsYXllcjJBcmVhIHtcXHJcXG59XFxyXFxuXFxyXFxuI2J1dHRvbkNvbnRhaW5lciB7XFxyXFxuICAgIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxudGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG5hbGlnbi1jb250ZW50OiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jc3RhcnRPdmVyQnV0dG9uIHtcXHJcXG4gICAgZm9udC1mYW1pbHk6IFZlcmRhbmE7IFxcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjY2NjO1xcclxcbiAgICBwYWRkaW5nOiAxMHB4OyBcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcbn1cXHJcXG5cXHJcXG5kaXYuZW1wdHlTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNDBweDtcXHJcXG4gICAgaGVpZ2h0OiA0MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbi5lbXB0eVNxdWFyZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkOWQ5ZDk7XFxyXFxufVxcclxcblxcclxcbi5oaXRFbXB0eVNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA0MnB4O1xcclxcbiAgICBoZWlnaHQ6IDQycHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM2Nzk1ZmY7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuXFxyXFxufVxcclxcblxcclxcbi5oaXRFbXB0eVNxdWFyZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM3ZmZmZDQ7XFxyXFxufVxcclxcblxcclxcbi5oaXRPY2N1cGllZFNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdE9jY3VwaWVkU3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmMDAwMDtcXHJcXG59XFxyXFxuXFxyXFxuLm9jY3VwaWVkU3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQwcHg7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTBhYTAwOyBcXHJcXG59XFxyXFxuXFxyXFxuLm9jY3VwaWVkU3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzUwYWEwMDtcXHJcXG59XFxyXFxuXFxyXFxuLnJvdyB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxufVxcclxcblxcclxcbi5ncmlkIHtcXHJcXG53aWR0aDogMTAwJTsgXFxyXFxuaGVpZ2h0OiAxMDAlOyBcXHJcXG5tYXJnaW4tbGVmdDogYXV0bztcXHJcXG5tYXJnaW4tcmlnaHQ6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi5kb3Qge1xcclxcbndpZHRoOiA1cHg7XFxyXFxuaGVpZ2h0OiA1cHg7XFxyXFxuYm9yZGVyLXJhZGl1czogNXB4OyBcXHJcXG5iYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwOyBcXHJcXG5tYXJnaW46IGF1dG87XFxyXFxudG9wOiA1MCU7XFxyXFxubGVmdDogNTAlO1xcclxcbm1hcmdpbi10b3A6IDUwJTtcXHJcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxyXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xyXG4gIHZhciBsaXN0ID0gW107IC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHJcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcclxuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xyXG5cclxuICAgICAgaWYgKGl0ZW1bNF0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtWzJdKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG5lZWRMYXllcikge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xyXG5cclxuICAgICAgaWYgKG5lZWRMYXllcikge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpdGVtWzJdKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW1bNF0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29udGVudDtcclxuICAgIH0pLmpvaW4oXCJcIik7XHJcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcclxuXHJcblxyXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XHJcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcclxuXHJcbiAgICBpZiAoZGVkdXBlKSB7XHJcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XHJcblxyXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XHJcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XHJcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcclxuXHJcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XHJcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobWVkaWEpIHtcclxuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcclxuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XHJcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3VwcG9ydHMpIHtcclxuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcclxuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XHJcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsaXN0LnB1c2goaXRlbSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGxpc3Q7XHJcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xyXG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcclxuXHJcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XHJcbiAgICByZXR1cm4gY29udGVudDtcclxuICB9XHJcblxyXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XHJcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XHJcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcclxuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XHJcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcclxufTsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiMmJhZTkyM2M4NzFjZjNlNTQyMTQzMTNkMDhkZTNkZmUubXAzXCI7IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImM3NjYxMDI0NTk3OWJlMTU2MzNmYmUwNTE5ZjgwMjNhLm1wM1wiOyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJiODdmNTkwZDZmZmUyNDNhOWRlNDA2YmZhYmFmNGExNS5tcDNcIjsiLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fSFRNTF9MT0FERVJfR0VUX1NPVVJDRV9GUk9NX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2h0bWwtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19IVE1MX0xPQURFUl9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL2Fzc2V0L2V4cGxvc2lvbi5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbi8vIE1vZHVsZVxudmFyIF9fX0hUTUxfTE9BREVSX1JFUExBQ0VNRU5UXzBfX18gPSBfX19IVE1MX0xPQURFUl9HRVRfU09VUkNFX0ZST01fSU1QT1JUX19fKF9fX0hUTUxfTE9BREVSX0lNUE9SVF8wX19fKTtcbnZhciBjb2RlID0gXCI8IURPQ1RZUEUgaHRtbD5cXHJcXG48aHRtbD5cXHJcXG48aGVhZD5cXHJcXG4gICAgPG1ldGEgY2hhcnNldD1cXFwidXRmLThcXFwiIC8+XFxyXFxuICAgIDx0aXRsZT5OZXcgUHJvamVjdDwvdGl0bGU+XFxyXFxuICAgIDxsaW5rIHJlbD1cXFwiaWNvblxcXCIgdHlwZT1cXFwiaW1hZ2UvcG5nXFxcIiBocmVmPVxcXCJcIiArIF9fX0hUTUxfTE9BREVSX1JFUExBQ0VNRU5UXzBfX18gKyBcIlxcXCI+XFxyXFxuPC9oZWFkPlxcclxcbjxib2R5PlxcclxcbiAgICA8ZGl2IGlkPVxcXCJjb250YWluZXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBpZD1cXFwidGl0bGVDb250YWluZXJcXFwiPjxoMT5CYXR0bGVzaGlwPC9oMT48L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcIm1lc3NhZ2VDb250YWluZXJcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgaWQ9XFxcInR1cm5NZXNzYWdlQXJlYVxcXCI+PGgyIGlkPVxcXCJ0dXJuTWVzc2FnZVxcXCI+PC9oMj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGlkPVxcXCJhbm5vdW5jZW1lbnRzQ29udGFpbmVyXFxcIj48aDMgaWQ9XFxcImFubm91bmNlbWVudFxcXCI+PC9oMz48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGlkPVxcXCJlbmRHYW1lTWVzc2FnZUFyZWFcXFwiPjxoMyBpZD1cXFwiZW5kR2FtZU1lc3NhZ2VcXFwiPjwvaDM+PC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcImlubmVyQ29udGFpbmVyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGlkPVxcXCJwMVpvbmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8aDI+UGxheWVyIE9uZTwvaDI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcInBsYXllckFyZWFPbmVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgaWQ9XFxcInAyWm9uZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxoMj5QbGF5ZXIgVHdvPC9oMj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwicGxheWVyQXJlYVR3b1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcImluZm9Db250YWluZXJcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBpZD1cXFwiYnV0dG9uQ29udGFpbmVyXFxcIj48YnV0dG9uIGlkPVxcXCJzdGFydE92ZXJCdXR0b25cXFwiPlN0YXJ0IE92ZXI8L2J1dHRvbj48L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9ib2R5PlxcclxcbjwvaHRtbD5cIjtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IGNvZGU7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcclxuICBpZiAoIW9wdGlvbnMpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgb3B0aW9ucyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgaWYgKCF1cmwpIHtcclxuICAgIHJldHVybiB1cmw7XHJcbiAgfSAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZXJzY29yZS1kYW5nbGUsIG5vLXBhcmFtLXJlYXNzaWduXHJcblxyXG5cclxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XHJcblxyXG4gIGlmIChvcHRpb25zLmhhc2gpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxyXG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcclxuICB9XHJcblxyXG4gIGlmIChvcHRpb25zLm1heWJlTmVlZFF1b3RlcyAmJiAvW1xcdFxcblxcZlxcciBcIic9PD5gXS8udGVzdCh1cmwpKSB7XHJcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybCwgXCJcXFwiXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHVybDtcclxufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbXlzdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL215c3R5bGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcclxuICB2YXIgcmVzdWx0ID0gLTE7XHJcblxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XHJcbiAgICAgIHJlc3VsdCA9IGk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcclxuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xyXG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcclxuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xyXG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcclxuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xyXG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XHJcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgIHZhciBvYmogPSB7XHJcbiAgICAgIGNzczogaXRlbVsxXSxcclxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXHJcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcclxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXHJcbiAgICAgIGxheWVyOiBpdGVtWzVdXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XHJcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XHJcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XHJcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcclxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxyXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcclxuICB9XHJcblxyXG4gIHJldHVybiBpZGVudGlmaWVycztcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcclxuICBhcGkudXBkYXRlKG9iaik7XHJcblxyXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcclxuICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiB1cGRhdGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgbGlzdCA9IGxpc3QgfHwgW107XHJcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcclxuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcclxuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xyXG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xyXG5cclxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XHJcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XHJcblxyXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xyXG5cclxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xyXG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xyXG5cclxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcclxuICB9O1xyXG59OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIG1lbW8gPSB7fTtcclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcblxyXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XHJcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcclxuXHJcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcclxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xyXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxyXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcclxufVxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuXHJcblxyXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcclxuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XHJcblxyXG4gIGlmICghdGFyZ2V0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xyXG4gIH1cclxuXHJcbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XHJcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcclxuICByZXR1cm4gZWxlbWVudDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xyXG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcclxuXHJcbiAgaWYgKG5vbmNlKSB7XHJcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cclxuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcclxuICB2YXIgY3NzID0gXCJcIjtcclxuXHJcbiAgaWYgKG9iai5zdXBwb3J0cykge1xyXG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcclxuICB9XHJcblxyXG4gIGlmIChvYmoubWVkaWEpIHtcclxuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xyXG4gIH1cclxuXHJcbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gIGlmIChuZWVkTGF5ZXIpIHtcclxuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcclxuICB9XHJcblxyXG4gIGNzcyArPSBvYmouY3NzO1xyXG5cclxuICBpZiAobmVlZExheWVyKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICBpZiAob2JqLm1lZGlhKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICBpZiAob2JqLnN1cHBvcnRzKSB7XHJcbiAgICBjc3MgKz0gXCJ9XCI7XHJcbiAgfVxyXG5cclxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcclxuXHJcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XHJcbiAgfSAvLyBGb3Igb2xkIElFXHJcblxyXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cclxuXHJcblxyXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcclxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcclxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XHJcbn1cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcblxyXG5cclxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcclxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XHJcbiAgcmV0dXJuIHtcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xyXG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XHJcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XHJcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XHJcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyJdLCJuYW1lcyI6WyJnZW5SYW5kb20iLCJnZW5lcmF0ZUNvb3JkaW5hdGVzIiwiaGl0RW1wdHkiLCJoaXRPY2N1cGllZCIsImlzVW5kZWZpbmVkIiwicGxheUNhbm5vbkF1ZGlvIiwibWVtb3J5IiwibmV4dFRhcmdldCIsIm5leHRTZWNvbmRhcnlUYXJnZXQiLCJoaXRUYXJnZXQiLCJwcmV2aW91c1RhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJpZGVudGlmaWVkT3JpZW50YXRpb24iLCJpc0hvcml6IiwiY29uc2VjdXRpdmVIaXQiLCJoaXRDb3VudHMiLCJvcHBvbmVudCIsInNoaXBMb2NhdGVkIiwiY29uZmlybWVkSGl0cyIsImVuZW15U2hpcHMiLCJnZXRPcHBvbmVudCIsImdldE9wcG9uZW50U2hpcHMiLCJzaGlwQXJyYXkiLCJmb3JFYWNoIiwic2hpcCIsInB1c2giLCJyZXNldEhpdENvdW50cyIsImluY3JlbWVudEhpdENvdW50IiwidXBkYXRlSGl0Q291bnQiLCJnZXRMZWZ0T3ZlckhpdENvdW50cyIsImNvbnNvbGUiLCJsb2ciLCJydW5BSSIsInBsYXllciIsInR1cm5UcmFja2VyIiwiZ2V0VHVyblN0YXR1cyIsImhpdE9wcG9uZW50QXJlYSIsImF0dGFja0FyZWEiLCJjb29yZGluYXRlcyIsImRlY2lkZVRhcmdldCIsImkiLCJib2FyZEFycmF5IiwibGVuZ3RoIiwieCIsInkiLCJoaXQiLCJzcXVhcmUiLCJnZXRTcXVhcmUiLCJuYW1lIiwib2NjdXBpZWQiLCJ1bmRlZmluZWQiLCJob3Jpek9yVmVydCIsImNob29zZVZhbGlkUG90ZW50aWFsVGFyZ2V0IiwidG9nZ2xlVHVybiIsImNsZWFySXRlbSIsInNxdWFyZUlEIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIm5leHRBcmVhIiwieF9jb29yIiwieV9jb29yIiwiaGFzQWxyZWFkeUJlZW5BdHRhY2tlZCIsInRhcmdldCIsImFkZFNlY29uZGFyeVBvdGVudGlhbFRhcmdldHMiLCJub3REdXBsaWNhdGUiLCJuZXh0eVRhcmdldCIsImNsZWFyTmV4dFRhcmdldCIsImRpc2NhcmQiLCJwb3AiLCJjbGVhck5leHRTZWNvbmRhcnlUYXJnZXQiLCJ0cmFuc2ZlclRvU2Vjb25kYXJ5IiwiaXRlbSIsImluZGV4Iiwib2JqZWN0Iiwic3BsaWNlIiwiZmluZFRoZUVuZCIsImNsZWFyU2Vjb25kYXJ5SXRlbSIsImlzQXJlYVNlY3VyZSIsInN1bmtTaGlwIiwiZmluZE5laWdoYm9yT2ZFbmQiLCJhdHRhY2tUaGVPdGhlckVuZCIsIm5ld1giLCJuZXdZIiwiZm91bmRDb25zZWN1dGl2ZSIsImRpcmVjdGlvblgiLCJkaXJlY3Rpb25ZIiwiTWF0aCIsImZsb29yIiwiZG9udEVuZExvb3AiLCJmb3VuZENvbnMiLCJjb3VudCIsImNvbnNlY3V0aXZlWCIsImNvbnNlY3V0aXZlWSIsImlkZW50aWZ5T3JpZW50YXRpb24iLCJjaG9vc2VUYXJnZXRCYXNlZE9uT3JpZW50YXRpb24iLCJqIiwicG9zQXJyYXkiLCJoaXRDb3VudCIsImsiLCJpc0hvcml6b250YWwiLCJpc0NsaW1iaW5nIiwibW92ZVgiLCJtb3ZlWSIsInRyYW5zWCIsInRyYW5zWSIsInRvdGFsSGl0IiwiaGFzQmVlbkhpdCIsImlzU3VuayIsImlzSGl0IiwiY3JlYXRlUGxheWVyIiwiZ2VuZXJhdGVHcmlkIiwicGxhY2VBbGxTaGlwcyIsInNldFNlbGYiLCJzZXRPcHBvbmVudCIsInRyYWNrVHVybnMiLCJwbGF5ZXJPbmVUdXJuIiwidHVybk1lc3NhZ2UiLCJzdGFydEdhbWUiLCJuZXdHYW1lIiwiT2JqZWN0Iiwib3ZlciIsImVuZEdhbWUiLCJwbGF5ZXJPbmUiLCJwbGF5ZXJUd28iLCJzZXRHYW1lT2JqZWN0IiwiaXNDb21wdXRlciIsImlzUGxheWluZ0FnYWluc3RBSSIsImlubmVySFRNTCIsImlzU2hpcFN1bmsiLCJjaGVja1NoaXBzIiwic3F1YXJlVW5pdCIsInVuaXQiLCJjcmVhdGVFbGVtZW50IiwiaXNFbXB0eSIsImNvbHVtbnMiLCJuZXdncmlkIiwic2V0Qm9hcmRDb2x1bW5zIiwic2V0QXR0cmlidXRlIiwiZ2VuZXJhdGVSb3ciLCJ0YXJnZXRHcmlkIiwiY29sdW1uIiwicm93IiwiY29vcmRpbmF0ZSIsImFyZWEiLCJhcHBlbmRDaGlsZCIsImdlbmVyYXRlU3F1YXJlIiwidG9TdHJpbmciLCJJRCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0dXJuQm9vbElEIiwiZ2FtZU9iamVjdCIsImlzQUkiLCJjbGFzc0xpc3QiLCJ0b2dnbGUiLCJjaGlsZE5vZGVzIiwiZG90IiwicmVtb3ZlIiwiYWRkIiwidGFyZ2V0ZWRfc2hpcCIsInBvcyIsIl8iLCJkZWxCb2FyZCIsInJlcXVpcmUiLCJwbGF5ZXJzIiwic3RhcnRPdmVyQnV0dG9uIiwicGxheWVyT25lQXJlYSIsInBsYXllclR3b0FyZWEiLCJyZXNldCIsImNyZWF0ZVNoaXAiLCJncmlkTGVuZ3RoIiwicGxhY2VTaGlwIiwic2hpcFR5cGUiLCJwb3NpdGlvbmVkIiwib3JpZW50YXRpb24iLCJob3JpelRoZW5WZXJ0IiwidmVydFRoZW5Ib3JpeiIsInZhbGlkUGxhY2VtZW50IiwiaXNJdE9jY3VwcGllZCIsInBsYWNlU2hpcFBhcnQiLCJkb21fY29vcmRpbmF0ZXMiLCJzZXRQb3MiLCJob3Jpem9udGFsIiwiaXNPY2N1cGllZCIsIkNhbm5vbjEiLCJDYW5ub24yIiwiQ2Fubm9uMyIsInBsYXlDYW5ub24xIiwiQ2Fubm9uT25lIiwiQXVkaW8iLCJwbGF5IiwicGxheUNhbm5vbjIiLCJDYW5ub25Ud28iLCJwbGF5Q2Fubm9uMyIsIkNhbm5vblRocmVlIiwiYXVkaW9BcnJheSIsImNob29zZSIsImNvbnRhaW5lciIsIm5ld3BsYXllciIsImJvYXJkQ29sdW1ucyIsImJvYXJkTm9kZSIsImdhbWUiLCJvcHBvbmVudE5hbWUiLCJtZXNzYWdlcyIsInNldFR1cm5UcmFja2VyIiwidHVybklEIiwiZ2V0Qm9hcmRDb2x1bW5zIiwicGxheWVyQXJlYSIsIm51bSIsInJhbmRvbSIsImNvbnRhaW5lck5vZGUiLCJncmlkTm9kZSIsInJvd05vZGVBcnJheSIsInJlbW92ZUNoaWxkIiwibGFzdEVsZW1lbnRDaGlsZCIsInR5cGUiLCJuZXdTaGlwIiwiYW5ub3VuY2VtZW50IiwibWVzc2FnZSIsImtlZXBUcmFjayIsImRpc3BsYXlUdXJuIiwic2V0VGltZW91dCIsImFsbFN1bmsiLCJhbm5vdW5jZVdpbm5lciJdLCJzb3VyY2VSb290IjoiIn0=