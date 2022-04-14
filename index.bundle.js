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
    setTimeout(function () {
      hitOpponentArea(player);
    }, 2000); //  hitOpponentArea(player) 
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
    var turnStatus = player.turnTracker.getTurnStatus(); //This part needs further work if the player chooses to play with another oppponent other than the computer 

    if (!area.hit && player.turnBoolID !== turnStatus && !player.gameObject.over && player.isComputer) {
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
      (0,_computerAI_js__WEBPACK_IMPORTED_MODULE_0__.runAI)(playerTwo);
    }
  };

  (keepTrack.displayTurn = function () {
    if (keepTrack.playerOneTurn) {
      turnMessage.innerHTML = "Player One's Turn";
    } else {
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
var code = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>Battleship</title>\r\n    <link rel=\"icon\" type=\"image/png\" href=\"" + ___HTML_LOADER_REPLACEMENT_0___ + "\">\r\n</head>\r\n<body>\r\n    <div id=\"container\">\r\n        <div id=\"titleContainer\"><h1>Battleship</h1></div>\r\n        <div id=\"messageContainer\">\r\n            <div id=\"turnMessageArea\"><h2 id=\"turnMessage\"></h2></div>\r\n            <div id=\"announcementsContainer\"><h3 id=\"announcement\"></h3></div>\r\n            <div id=\"endGameMessageArea\"><h3 id=\"endGameMessage\"></h3></div>\r\n        </div>\r\n        <div id=\"innerContainer\">\r\n            <div id=\"p1Zone\">\r\n                <h2>Player One</h2>\r\n                <div id=\"playerAreaOne\"></div>\r\n            </div>\r\n            <div id=\"p2Zone\">\r\n                <h2>Player Two</h2>\r\n                <div id=\"playerAreaTwo\"></div>\r\n            </div>\r\n        </div>\r\n        <div id=\"infoContainer\"></div>\r\n        <div id=\"buttonContainer\"><button id=\"startOverButton\">Start Over</button></div>\r\n    </div>\r\n</body>\r\n</html>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpRjtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RCxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3JFYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9jb21wdXRlckFJLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9ncmlkLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9wbGFjZVNoaXBzLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcGxheUNhbm5vbkF1ZGlvLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvcmFuZEdlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3Jlc2V0LmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3R1cm5UcmFja2luZy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL3dpbkNvbmRpdGlvbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL215c3R5bGUuY3NzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2F1ZGlvL2Nhbm5vbi1zaG90LTEubXAzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9zcmMvYXVkaW8vY2Fubm9uLXNob3QtMi5tcDMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9hdWRpby9jYW5ub24tc2hvdC0zLm1wMyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vc3JjL2hvbWUuaHRtbCIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL2h0bWwtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL3NyYy9teXN0eWxlLmNzcz9kZDUwIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFja190ZW1wbGF0ZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3dlYnBhY2tfdGVtcGxhdGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX3RlbXBsYXRlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuUmFuZG9tIH0gZnJvbSAnLi9yYW5kR2VuLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlQ29vcmRpbmF0ZXMgfSBmcm9tICcuL3BsYWNlU2hpcHMnOyBcclxuaW1wb3J0IHsgaGl0RW1wdHksIGhpdE9jY3VwaWVkIH0gZnJvbSAnLi9ncmlkLmpzJztcclxuaW1wb3J0IHsgaXNVbmRlZmluZWQgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBwbGF5Q2Fubm9uQXVkaW8gfSBmcm9tICcuL3BsYXlDYW5ub25BdWRpby5qcyc7XHJcblxyXG4vL0l0IG9ubHkgbmVlZHMgdG8ga2VlcCB0cmFjayBvZiB0aGUgb3Bwb25lbnQncyBzaGlwcyBhbmQgYm9hcmQgXHJcbi8vcmFuZG9tbHkgcGlja3MgY29vcmRpbmF0ZXMuIFxyXG4vL05lZWQgdG8gcmVjb2duaXplIG5vdCB0byBwaWNrIGhpdCBhcmVhc1xyXG4vL1doZW4gaXQgZG9lcyBoaXQgdGhlIG9wcG9uZW50J3Mgc2hpcCwgaXQgbmVlZHMgdG8gaGl0IHRoZSBhZGphY2VudCBhcmVhcy4gXHJcbi8vTmVlZHMgdG8ga25vdyB3aGVuIGl0J3MgdHVybiBjb21lcyB1cFxyXG4vL05lZWRzIHRvIGtub3cgd2hlbiB0aGUgZ2FtZSBpcyBvdmVyLiBcclxuXHJcbi8vdHVybiBpcyBmYWxzZSB3aGVuIGl0J3MgdGhlIEFJJ3MgdHVybiBcclxuXHJcbmNvbnN0IG1lbW9yeSA9IHtcclxuICAgIC8vQWZ0ZXIgdGhlIEFJIGhpdHMgYSBzaGlwLCBpdCBjb21lcyB1cCB3aXRoIHRhcmdldHMgaXQgd2lsbCBhdHRhY2sgaW4gaXRzIG5leHQgdHVybiBcclxuICAgIC8vbmV4dFRhcmdldFtdIGtlZXBzIHRyYWNrIG9mIHRob3NlIHRhcmdldHMuIFxyXG4gICAgbmV4dFRhcmdldDogW10sIFxyXG5cclxuICAgIC8va2VlcHMgdHJhY2sgb2YgbmV4dCB0YXJnZXRzIHRoYXQgaGF2ZSBsZXNzIHByaW9yaXR5IHRoYW4gdGhlIG9uZXMgaW4gbmV4dFRhcmdldFtdLlxyXG4gICAgLy9JdCdzIG9ubHkgdW50aWwgdGhlIEFJIGRvZXMgbm90IGhhdmUgYW55IHRhcmdldHMgaW4gbmV4dFRhcmdldFtdIGxlZnQgdGhhdCBpdCBnb2VzIGFmdGVyIHRhcmdldHMgaW4gbmV4dFNlY29uZGFyeVRhcmdldFtdLiBcclxuICAgIG5leHRTZWNvbmRhcnlUYXJnZXQ6W10sXHJcblxyXG4gICAgaGl0VGFyZ2V0OiBbXSxcclxuXHJcbiAgICAvL2tlZXBzIHRyYWNrIG9mIHByZXZpb3VzIHRhcmdldDsgXHJcbiAgICBwcmV2aW91c1RhcmdldDoge30sIFxyXG5cclxuICAgIC8va2VlcHMgdHJhY2sgb2YgdGhlIGN1cnJlbnQgdGFyZ2V0IFxyXG4gICAgY3VycmVudFRhcmdldDogbnVsbCwgXHJcblxyXG4gICAgLy9LZWVwcyB0cmFjayBvZiB3aGV0aGVyIG9yIG5vdCBlbmVteSBzaGlwcyBvcmllbnRhdGlvbiBoYXZlIGJlZW4gaWRlbnRpZmllZCBcclxuICAgIGlkZW50aWZpZWRPcmllbnRhdGlvbjogZmFsc2UsIFxyXG4gICAgLy9UaGlzIGtlZXBzIHRyYWNrIG9mIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcCBpdCdzIGF0dGFja2luZy4gXHJcbiAgICBpc0hvcml6OiB0cnVlLCBcclxuICAgIGNvbnNlY3V0aXZlSGl0OiBmYWxzZSwgXHJcbiAgICAvL251bWJlciBvZiB0aW1lcyBhbiBhdHRhY2sgaGl0cyBpdHMgdGFyZ2V0XHJcbiAgICAvLyBpdCByZXNldHMgdG8gMCBpZiBhbiBhdHRlbXB0IG1pc3NlZCBpdHMgdGFyZ2V0XHJcbiAgICBoaXRDb3VudHM6IDAsIFxyXG4gICAgb3Bwb25lbnQ6IG51bGwsIFxyXG4gICAgc2hpcExvY2F0ZWQ6IGZhbHNlLCBcclxuICAgIGNvbmZpcm1lZEhpdHM6IFtdLCBcclxuICAgIGVuZW15U2hpcHM6IFtdLCBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldE9wcG9uZW50ID0gb3Bwb25lbnQgPT4ge1xyXG4gICAgbWVtb3J5Lm9wcG9uZW50ID0gb3Bwb25lbnQ7IFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0T3Bwb25lbnRTaGlwcyA9ICgpID0+IHtcclxuICAgIG1lbW9yeS5vcHBvbmVudC5zaGlwQXJyYXkuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICBtZW1vcnkuZW5lbXlTaGlwcy5wdXNoKHNoaXApOyBcclxuICAgIH0pXHJcbn1cclxuXHJcbmNvbnN0IHJlc2V0SGl0Q291bnRzID0gKCkgPT4ge1xyXG4gICAgbWVtb3J5LmhpdENvdW50cyA9IDA7XHJcbn1cclxuXHJcbmNvbnN0IGluY3JlbWVudEhpdENvdW50ID0gKCkgPT4ge1xyXG4gICAgbWVtb3J5LmhpdENvdW50cyArPSAxOyBcclxufVxyXG5cclxuY29uc3QgdXBkYXRlSGl0Q291bnQgPSAoKSA9PiB7XHJcbiAgICBtZW1vcnkuaGl0Q291bnRzID0gZ2V0TGVmdE92ZXJIaXRDb3VudHMoKTsgXHJcbiAgICBjb25zb2xlLmxvZyhcIlVwZGF0ZWQgaGl0Y291bnQgPSBcIiArIG1lbW9yeS5oaXRDb3VudHMpOyBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJ1bkFJID0gKHBsYXllcikgPT4ge1xyXG4gICAgaWYoIXBsYXllci50dXJuVHJhY2tlci5nZXRUdXJuU3RhdHVzKCkpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgaGl0T3Bwb25lbnRBcmVhKHBsYXllcikgfSwgMjAwMCk7XHJcbiAgICAgIC8vICBoaXRPcHBvbmVudEFyZWEocGxheWVyKSBcclxuICAgIH1cclxuICBcclxufVxyXG4vL25lZWRzIHRvIGtub3cgdGhlIHBsYXllcidzIGJvYXJkIFxyXG4vL25lZWRzIHRvIGF2b2lkIGhpdCBhcmVhcyBcclxuLy9UaGUgZnVuY3Rpb24gbmVlZHMgdG8gcGF5IHNwZWNpYWwgYXR0ZW50aW9uIHRvIHdoZW4gc2hpcHMgYXJlIG5vdCBzdW5rIHlldC4gXHJcbmV4cG9ydCBjb25zdCBoaXRPcHBvbmVudEFyZWEgPSAocGxheWVyKSA9PiB7XHJcbiAgICB2YXIgYXR0YWNrQXJlYSA9IGZhbHNlO1xyXG4gICAgd2hpbGUgKCFhdHRhY2tBcmVhKSB7XHJcbiAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gZGVjaWRlVGFyZ2V0KCk7ICAgICAgXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoY29vcmRpbmF0ZXMueCA9PT0gbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueCAmJiBjb29yZGluYXRlcy55ID09PSBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS55KSB7XHJcbiAgICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiY29vcmRpbmF0ZXMueCA9IFwiICsgY29vcmRpbmF0ZXMueClcclxuICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJjb29yZGluYXRlcy55ID0gXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgaWYgKCFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3JlY29yZCB0aGUgY29vcmRpbmF0ZSBvZiB0aGUgY3VycmVudCBhcmVhIHRoZSBBSSBpcyBhdHRhY2tpbmcgXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmN1cnJlbnRUYXJnZXQgPSB7IHg6IGNvb3JkaW5hdGVzLngsIHk6IGNvb3JkaW5hdGVzLnkgfTsgXHJcbiAgICAgICAgICAgICAgICAgICAgLy9pZiBhcmVhIGRvZXMgY29udGFpbiB0aGUgZW5lbXkgc2hpcCBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBnZXRTcXVhcmUobWVtb3J5Lm9wcG9uZW50Lm5hbWUsIGNvb3JkaW5hdGVzLngsIGNvb3JkaW5hdGVzLnkpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLm9jY3VwaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdE9jY3VwaWVkKG1lbW9yeS5vcHBvbmVudCwgc3F1YXJlLCBjb29yZGluYXRlcy54LCBjb29yZGluYXRlcy55KTsgXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNyZW1lbnRIaXRDb3VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrQXJlYSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29uZmlybWVkIGhpdDogXCIgKyBjb29yZGluYXRlcy54ICsgXCIsXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkuY29uZmlybWVkSGl0cy5wdXNoKHt4OiBjb29yZGluYXRlcy54LCB5OiBjb29yZGluYXRlcy55fSlcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIEFJIGhhcyB0aGUgbmV4dCB0YXJnZXRzIGJhc2VkIG9uIGEgbG9jYXRpb24gb2YgYSBjb25maXJtZWQgaGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09MCAmJiBtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9yaXpPclZlcnQoY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0lmIEFJIGRvZXNuJ3QgaGF2ZSBhbnkgY2x1ZSBhcyB0byB0aGUgbG9jYXRpb25zIG9mIHRoZSBlbmVteSBzaGlwcywgcmFuZG9tbHkgY2hvb3NlIGEgbG9jYXRpb24gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9FbnRlciBjb29yZGluYXRlcyBvZiBhZGphY2VudCBzcXVhcmVzIGludG8gbmV4dFRhcmdldFtdIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQoY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBsaW5lIGlzIHBsYWNlZCBoZXJlIGZvciB0ZXN0aW5nXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW1vcnkucHJldmlvdXNUYXJnZXQgPSB7IHg6IGNvb3JkaW5hdGVzLngsIHk6IGNvb3JkaW5hdGVzLnkgfTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5pZGVudGlmaWVkT3JpZW50YXRpb24gPSB0cnVlOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVtb3J5LmNvbnNlY3V0aXZlSGl0ID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci50dXJuVHJhY2tlci50b2dnbGVUdXJuKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5leHRUYXJnZXRbXTogXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1lbW9yeS5uZXh0VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXh0U2Vjb25kYXJ5VGFyZ2V0OiBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQpOyBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdEVtcHR5KHNxdWFyZSk7IFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIHBhcnQgaXMgcHJvYmxlbWF0aWNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJdGVtKGNvb3JkaW5hdGVzLngsIGNvb3JkaW5hdGVzLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1pc3NlZDogXCIgKyBjb29yZGluYXRlcy54ICsgXCIsXCIgKyBjb29yZGluYXRlcy55KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtZW1vcnkubmV4dFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9yeS5pZGVudGlmaWVkT3JpZW50YXRpb24gPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci50dXJuVHJhY2tlci50b2dnbGVUdXJuKCk7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRhY2tBcmVhID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLmhpdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgYXJlYSBoYXMgYWxyZWFkeSBiZWVuIGhpdC4gXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckl0ZW0oY29vcmRpbmF0ZXMueCwgY29vcmRpbmF0ZXMueSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNrQXJlYSA9IGZhbHNlOyBcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwbGF5Q2Fubm9uQXVkaW8oKTsgXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBnZXRTcXVhcmUgPSAocGxheWVyLCB4LCB5KSA9PiB7XHJcbiAgICBjb25zdCBzcXVhcmVJRCA9IHBsYXllciArIFwiLVwiICsgeCArIFwiLFwiICsgeTtcclxuICAgIGNvbnN0IHNxdWFyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNxdWFyZUlEKTtcclxuICAgIHJldHVybiBzcXVhcmU7XHJcbn1cclxuXHJcbi8vTWFrZXMgdGhlIEFJIHNtYXJ0ZXIgXHJcbi8vQ2hlY2sgdG8gc2VlIGlmIG5leHRUYXJnZXRbXSBpcyBlbXB0eS4gXHJcbi8vV2hlbiBBSSBoaXRzIGEgc2hpcCwgaXQgc2hvdWxkIHNlYXJjaCB0aGUgYWRqYWNlbnQgYXJlYXMsIHVudGlsIGl0J3MgY29uZmlybWVkIHRoYXQgYSBzaGlwIGlzIHN1bmsgIFxyXG4vL0l0IGRlY2lkZXMgdG8gYXR0YWNrIHRoZSB0b3AsIGJvdHRvbSwgbGVmdCBvciByaWdodCBhcmVhcy5cclxuLy9JdCBjYW4ndCBhdHRhY2sgYW4gYXJlYSB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gb2NjdXBpZWQuIFxyXG4vL1RvcCBhcmVhOiB4LCB5ICsgMVxyXG4vL2JvdHRvbSBhcmVhOiB4LCB5IC0xIFxyXG4vL2xlZnQgYXJlYTogeCAtIDEsIHlcclxuLy9yaWdodCBhcmVhOiB4ICsgMSwgeSBcclxuLy8gSXQgaGFzIHRvIGtub3cgaWYgdGhlIGFyZWEgaXMgb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ3JpZC4gXHJcbi8vSWYgdGhlIGFyZWEgaXQgZGVjaWRlIHRvIGF0dGFjayBkb2Vzbid0IG1lZXQgdGhlIGFib3ZlIGNvbmRpdGlvbnMsIGluIGl0cyBuZXh0IHR1cm4sIGl0IGNob29zZXMgdGhlIG90aGVyIGVuZCBvZiB0aGUgc2hpcFxyXG4vL1NvbHV0aW9uOiBUcmFjayB0aGUgaGl0IGFyZWFzIGluIGFuIGFycmF5LiBUaGUgcHJvZ3JhbSBtdXN0IGhpdCB0aGUgYXJlYXMgYXJvdW5kIGl0LiBcclxuLy9PbmNlIGV2ZXJ5IHRhcmdldCBhcmVhIGluIHRoYXQgYXJyYXkgaGFzIGJlZW4gaGl0IGFuZC4uLlxyXG4vL0lmIGl0IHJlY2VpdmVzIHRoZSBtZXNzYWdlIHRoYXQgYSBzaGlwIGlzIHN1bmssIGl0IGdvZXMgYmFjayB0byByYW5kb21seSBjaG9vc2luZyB0aWxlcyBvbiB0aGUgb3Bwb25lbnQncyBib2FyZCBcclxuXHJcbi8vVGhlIEFJIG11c3QgZmlndXJlIG91dCB3aGF0IGlzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcC4gXHJcblxyXG4vL0lmIGF0dGFja2VkIHNoaXAgaGFzIGJlZW4gaGl0IG1vcmUgdGhhbiA0IHRpbWVzIGFuZCBpZiB0aGUgYW5ub3VuY2VtZW50IHNheXMgdGhhdCB0aGUgc2hpcCB0aGF0IGhhcyBiZWVuIHN1bmsgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiBhIGNhcnJpZXIsIGl0IG11c3Qgc2VhcmNoICB0aGUgdG9wIGFuZCBib3R0b20gYXJlYXMgb2YgZWl0aGVyIGVuZCBvZiB0aGUgc2hpcC5cclxuLy90aGlzIGZ1bmN0aW9uIGNob29zZXMgYW5kIHJldHVybnMgYSBjb29yZGluYXRlIHRvIGF0dGFjayBcclxuY29uc3QgZGVjaWRlVGFyZ2V0ID0gKCkgPT4ge1xyXG4gICAgLy9JZiB0aGUgQUkgaGFzIGN1cnJlbnRseSBpZGVudGlmaWVkIHRoZSBnZW5lcmFsIGxvY2F0aW9uIG9mIHRoZSBzaGlwIGFuZCBpcyBhdHRhY2tpbmcgaXRcclxuICAgIGlmIChtZW1vcnkubmV4dFRhcmdldC5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBjb25zdCBuZXh0QXJlYSA9IG1lbW9yeS5uZXh0VGFyZ2V0W2dlblJhbmRvbShtZW1vcnkubmV4dFRhcmdldC5sZW5ndGgpIC0gMV07IFxyXG4gICAgIC8vICAgY29uc29sZS5sb2coXCJDdXJyZW50IHRhcmdldDogXCIpO1xyXG4gICAgIC8vICAgY29uc29sZS5sb2cobmV4dEFyZWEpO1xyXG4gICAgICAgIHJldHVybiBuZXh0QXJlYTsgXHJcbiAgICB9XHJcblxyXG4gICAgICAgICAgLy9JZiBBSSBkb2Vzbid0IGhhdmUgYW55IGNsdWVzIG9mIHRoZSBsb2NhdGlvbiBvZiB0aGUgb3Bwb25lbnQncyBzaGlwcyBcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0QXJlYSA9IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2dlblJhbmRvbShtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5sZW5ndGgpIC0gMV07IFxyXG4gICAgICAgICAgICByZXR1cm4gbmV4dEFyZWE7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIFxyXG4gICAgICAgICAgICByZXR1cm4gZ2VuZXJhdGVDb29yZGluYXRlcygxMCk7IFxyXG4gICAgfVxyXG59XHJcblxyXG4vL0Z1bmN0aW9uIHRha2VzIGEgbG9vayBhdCB0aGUgc3F1YXJlcyBhZGphY2VudCB0byB0aGUgYXR0YWNrZWQgc3F1YXJlIFxyXG4vL2FuZCBkZXRlcm1pbmVzIHdoZXRoZXIgb3Igbm90IHRvIHB1dCB0aGVtIGluIHRoZSBuZXh0IHRhcmdldCBsaXN0LiBcclxuY29uc3QgY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQgPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQgeCA9IFwiICsgeF9jb29yICsgXCI7IHkgPSBcIiArIHlfY29vciApXHJcbiAgICBpZiAoeF9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgIGlmICghaGFzQWxyZWFkeUJlZW5BdHRhY2tlZCh4X2Nvb3IgKyAxLCB5X2Nvb3IpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHt4OiB4X2Nvb3IgKyAxLHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSB9XHJcbiAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2godGFyZ2V0KTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHhfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciAtMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciAtIDEsIHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSAgfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHlfY29vciArIDEgPD0gMTApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yLCB5X2Nvb3IgKyAxKSkge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciwgeTogeV9jb29yICsgMSwgaXNIb3JpejogZmFsc2UgfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgaWYgKHlfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciwgeV9jb29yIC0gMSkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiB4X2Nvb3IsIHk6IHlfY29vciAtIDEsIGlzSG9yaXo6IGZhbHNlfVxyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmNvbnN0IGFkZFNlY29uZGFyeVBvdGVudGlhbFRhcmdldHMgPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiYWRkU2Vjb25kYXJ5UG90ZW50aWFsVGFyZ2V0cyB4ID0gXCIgKyB4X2Nvb3IgKyBcIjsgeSA9IFwiICsgeV9jb29yKVxyXG4gICAgaWYgKHhfY29vciArIDEgPD0gMTApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yICsgMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yICsgMSAmJiBtZW1vcnkuY3VycmVudFRhcmdldC55ICE9PSB5X2Nvb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3REdXBsaWNhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldFtpXS54ICE9PSB4X2Nvb3IgKyAxICYmIG1lbW9yeS5uZXh0VGFyZ2V0W2ldLnkgPT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ueCAhPT0geF9jb29yICsgMSAmJiBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS55ID09IHlfY29vcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vdER1cGxpY2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogeF9jb29yICsgMSwgeTogeV9jb29yLCBpc0hvcml6OiB0cnVlIH1cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeF9jb29yIC0gMSA+IDApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yIC0gMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yIC0gMSAmJiBtZW1vcnkuY3VycmVudFRhcmdldC55ICE9PSB5X2Nvb3IpIHsgXHJcbiAgICAgICAgICAgICAgICB2YXIgbm90RHVwbGljYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHR5VGFyZ2V0W2ldLnggIT09IHhfY29vciAtIDEgJiYgbWVtb3J5Lm5leHRUYXJnZXRbaV0ueSA9PSB5X2Nvb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90RHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS54ICE9PSB4X2Nvb3IgLSAxICYmIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnkgPT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChub3REdXBsaWNhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB7IHg6IHhfY29vciAtIDEsIHk6IHlfY29vciwgaXNIb3JpejogdHJ1ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeV9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgIGlmICghaGFzQWxyZWFkeUJlZW5BdHRhY2tlZCh4X2Nvb3IsIHlfY29vciArIDEpKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkuY3VycmVudFRhcmdldC54ICE9PSB4X2Nvb3IgJiYgbWVtb3J5LmN1cnJlbnRUYXJnZXQueSAhPT0geV9jb29yICsgMSkgeyBcclxuICAgICAgICAgICAgICAgIHZhciBub3REdXBsaWNhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkubmV4dFRhcmdldFtpXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZW1vcnkubmV4dFRhcmdldFtpXS54ICE9PSB4X2Nvb3IgJiYgbWVtb3J5Lm5leHRUYXJnZXRbaV0ueSA9PSB5X2Nvb3IgKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdER1cGxpY2F0ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXRbaV0ueCAhPT0geF9jb29yICYmIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnkgPT0geV9jb29yICsgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobm90RHVwbGljYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0geyB4OiB4X2Nvb3IsIHk6IHlfY29vciArIDEsIGlzSG9yaXo6IGZhbHNlIH1cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoeV9jb29yIC0gMSA+IDApIHtcclxuICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yLCB5X2Nvb3IgLSAxKSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5LmN1cnJlbnRUYXJnZXQueCAhPT0geF9jb29yICYmIG1lbW9yeS5jdXJyZW50VGFyZ2V0LnkgIT09IHlfY29vciAtIDEpIHsgXHJcbiAgICAgICAgICAgICAgICB2YXIgbm90RHVwbGljYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXRbaV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVtb3J5Lm5leHRUYXJnZXRbaV0ueCAhPT0geF9jb29yICYmIG1lbW9yeS5uZXh0VGFyZ2V0W2ldLnkgPT0geV9jb29yIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3REdXBsaWNhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0W2ldLnggIT09IHhfY29vciAmJiBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldFtpXS55ID09IHlfY29vciAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm90RHVwbGljYXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG5vdER1cGxpY2F0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHsgeDogeF9jb29yLCB5OiB5X2Nvb3IgLSAxLCBpc0hvcml6OiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL2NsZWFycyB0aGUgbmV4dFRhcmdldCBhcnJheTsgXHJcbmNvbnN0IGNsZWFyTmV4dFRhcmdldCA9ICgpID0+IHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVtb3J5Lm5leHRUYXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGlzY2FyZCA9IG1lbW9yeS5uZXh0VGFyZ2V0LnBvcCgpO1xyXG4gICAgfVxyXG4gICAgbWVtb3J5Lm5leHRUYXJnZXQgPSBbXTsgXHJcbn1cclxuXHJcblxyXG5jb25zdCBjbGVhck5leHRTZWNvbmRhcnlUYXJnZXQgPSAoKSA9PiB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgZGlzY2FyZCA9IG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LnBvcCgpOyBcclxuICAgIH1cclxuICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0ID0gW107IFxyXG59XHJcblxyXG4vL2ZpbmRzIG91dCBpZiBhIGNvb3JkaW5hdGUgaGFzIGFscmVhZHkgYmVlbiBhdHRhY2tlZC4gXHJcbmV4cG9ydCBjb25zdCBoYXNBbHJlYWR5QmVlbkF0dGFja2VkID0gKHgsIHkpID0+IHtcclxuICAgIGZvcih2YXIgaSA9IDA7IGk8IG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5W2ldLnggPT09IHggJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSA9IG1lbW9yeS5vcHBvbmVudC5ib2FyZEFycmF5Lmxlbmd0aDsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL0FmdGVyIGhpdHRpbmcgYSBzaGlwIHRoZSAybmQsIHByb2dyYW0gc2hvdWxkIGtub3cgd2hhdCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNoaXAgaXMuIFxyXG4vL0Z1bmN0aW9uIGNvbXBhcmVzIHRoZSB4IGFuZCB5IGNvb3JkaW5hdGVzIGluIHRoZSBwYXJhbWV0ZXJzIHdpdGggdGhlIHggYW5kIHkgY29vcmRpbmF0ZXMgc3RvcmVkIGluIHByZXZpb3VzVGFyZ2V0XHJcbmNvbnN0IGhvcml6T3JWZXJ0ID0gKHhfY29vciwgeV9jb29yKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnSG9yaXpPUlZlcnQgeCA9ICcgKyB4X2Nvb3IgKyBcIjsgeSA9IFwiICsgeV9jb29yKVxyXG4gICAgY2xlYXJJdGVtKHhfY29vciwgeV9jb29yKTtcclxuICAgIHRyYW5zZmVyVG9TZWNvbmRhcnkoKVxyXG4gICAgLy9pZiB5IGNvb3JkaW5hdGVzIGFyZSB0aGUgc2FtZSwgaXQncyBob3Jpem9udGFsXHJcbiAgICBpZiAobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgPT09IHlfY29vcikge1xyXG4gICAgICAgIG1lbW9yeS5pc0hvcml6ID0gdHJ1ZTsgXHJcbiAgICAgICAgLy9nbyByaWdodCBcclxuICAgICAgICBpZiAoeF9jb29yID4gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKSB7XHJcbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZSBuZXh0IHRhcmdldGVkIHNxdWFyZSBpcyB2YWxpZCBmb3IgYW4gYXR0YWNrIFxyXG4gICAgICAgICAgICBpZiAoeF9jb29yICsgMSA8PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKHhfY29vciArIDEsIHlfY29vcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHsgeDogeF9jb29yICsgMSwgeTogeV9jb29yLCBpc0hvcml6OiB0cnVlIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vTWFrZSBzdXJlIHRoZXJlIGlzIG5vIGR1cGxpY2F0ZSBpbiBuZXh0U2Vjb25kYXJ5VGFyZ2V0XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgKyAxICYmIGl0ZW0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54IC0gMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIGZhbHNlIClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgIC8vSG93dmVyLCBpZiB0aGUgY3VycmVudCBhdHRhY2sgd2FzIG5vdCBmb2xsb3dlZCB1cCBieSBhbm5vdW5jZW1lbnQgb2YgYSBzdW5rIHNoaXAgXHJcbiAgICAgICAgICAgIC8vLi4uYWRkIGNvb3JkaW5hdGVzIG9mIHRoZSBzcXVhcmUgdGhhdCBpcyBhZGphY2VudCB0byB0aGUgbG9jYXRpb24gb2YgdGhlIGluaXRpYWwgYXR0YWNrIG9mIHRoZSBzaGlwIHRvIG5leHRUYXJnZXRcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54IC0gMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggLSAxLCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSwgdHJ1ZSwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9nbyBsZWZ0XHJcbiAgICAgICAgZWxzZSBpZiAoeF9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgaWYgKHhfY29vciAtIDEgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoeF9jb29yIC0gMSwgeV9jb29yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2goeyB4OiB4X2Nvb3IgLSAxLCB5OiB5X2Nvb3IsIGlzSG9yaXo6IHRydWUgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgLSAxICYmIGl0ZW0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCArIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1RoZSBuZXh0IHRhcmdldCBpcyBpbnZhbGlkLlxyXG4gICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAvLy4uLmFkZCBjb29yZGluYXRlcyBvZiB0aGUgc3F1YXJlIHRoYXQgaXMgYWRqYWNlbnQgdG8gdGhlIGxvY2F0aW9uIG9mIHRoZSBpbml0aWFsIGF0dGFjayBvZiB0aGUgc2hpcCB0byBuZXh0VGFyZ2V0XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ICsgMSwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnksIHRydWUsIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCArIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9pZiB4IGNvb3JkaW5hdGVzIGFyZSB0aGUgc2FtZSwgaXQncyB2ZXJ0aWNhbCBcclxuICAgIGVsc2UgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ID09PSB4X2Nvb3IpIHtcclxuICAgICAgICBtZW1vcnkuaXNIb3JpeiA9IGZhbHNlO1xyXG4gICAgICAgIC8vR28gZG93blxyXG4gICAgICAgIGlmICh5X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSApIHtcclxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlIG5leHQgdGFyZ2V0ZWQgc3F1YXJlIGlzIHZhbGlkIGZvciBhbiBhdHRhY2sgXHJcbiAgICAgICAgICAgIGlmICh5X2Nvb3IgLSAxID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNBbHJlYWR5QmVlbkF0dGFja2VkKCB4X2Nvb3IsIHlfY29vciAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRUYXJnZXQucHVzaCh7IHg6IHhfY29vciwgeTogeV9jb29yIC0gMSwgaXNIb3JpejogZmFsc2UgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSB4X2Nvb3IgJiYgaXRlbS55ID09PSB5X2Nvb3IgLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKyAxLCBmYWxzZSwgdHJ1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAgICAgLy8uLi5hZGQgY29vcmRpbmF0ZXMgb2YgdGhlIHNxdWFyZSB0aGF0IGlzIGFkamFjZW50IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgaW5pdGlhbCBhdHRhY2sgb2YgdGhlIHNoaXAgdG8gbmV4dFRhcmdldFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55ICsgMSwgZmFsc2UsIHRydWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZmluZFRoZUVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKyAxLCBmYWxzZSwgdHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2dvIHVwXHJcbiAgICAgICAgZWxzZSBpZiAoeV9jb29yID4gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgKSB7XHJcbiAgICAgICAgICAgIGlmICh5X2Nvb3IgKyAxIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0FscmVhZHlCZWVuQXR0YWNrZWQoIHhfY29vciwgeV9jb29yICsgMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKHsgeDogeF9jb29yLCB5OiB5X2Nvb3IgKyAxLCBpc0hvcml6OiBmYWxzZSB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5mb3JFYWNoKChpdGVtLCBpbmRleCwgb2JqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IHhfY29vciAmJiBpdGVtLnkgPT09IHlfY29vciArIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmaW5kVGhlRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54LCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSAtIDEsIGZhbHNlLCBmYWxzZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vVGhlIG5leHQgdGFyZ2V0IGlzIGludmFsaWQuXHJcbiAgICAgICAgICAgICAgICAvL0hvd3ZlciwgaWYgdGhlIGN1cnJlbnQgYXR0YWNrIHdhcyBub3QgZm9sbG93ZWQgdXAgYnkgYW5ub3VuY2VtZW50IG9mIGEgc3VuayBzaGlwIFxyXG4gICAgICAgICAgICAgICAgLy8uLi5hZGQgY29vcmRpbmF0ZXMgb2YgdGhlIHNxdWFyZSB0aGF0IGlzIGFkamFjZW50IHRvIHRoZSBsb2NhdGlvbiBvZiB0aGUgaW5pdGlhbCBhdHRhY2sgb2YgdGhlIHNoaXAgdG8gbmV4dFRhcmdldFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55IC0gMSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LngsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55IC0gMSwgZmFsc2UsIGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLypcclxuICAgIG1lbW9yeS5uZXh0VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICBpZiAobWVtb3J5LmlzSG9yaXogIT09IGl0ZW0uaXNIb3Jpeikge1xyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFNlY29uZGFyeVRhcmdldC5wdXNoKG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgKi9cclxuICAgIGFkZFNlY29uZGFyeVBvdGVudGlhbFRhcmdldHMoeF9jb29yLCB5X2Nvb3IpXHJcbn1cclxuXHJcbmNvbnN0IHRyYW5zZmVyVG9TZWNvbmRhcnkgPSAoKSA9PiB7XHJcbiAgICBtZW1vcnkubmV4dFRhcmdldC5mb3JFYWNoKHRhcmdldCA9PiB7XHJcbiAgICAgICAgbWVtb3J5Lm5leHRTZWNvbmRhcnlUYXJnZXQucHVzaCh7eDogdGFyZ2V0LngsIHk6IHRhcmdldC55LCBpc0hvcml6OiB0YXJnZXQuaXNIb3Jpen0pXHJcbiAgICB9KVxyXG4gICAgY2xlYXJOZXh0VGFyZ2V0KCk7IFxyXG59XHJcblxyXG5jb25zdCBjbGVhckl0ZW0gPSAoeCwgeSkgPT4ge1xyXG4gICAgaWYgKG1lbW9yeS5uZXh0VGFyZ2V0Lmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0geCAmJiBpdGVtLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0geCAmJiBpdGVtLnkgPT09IHkpIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY2xlYXJTZWNvbmRhcnlJdGVtID0gKHgsIHkpID0+IHtcclxuICAgIG1lbW9yeS5uZXh0U2Vjb25kYXJ5VGFyZ2V0LmZvckVhY2goKGl0ZW0sIGluZGV4LCBvYmplY3QpID0+IHtcclxuICAgICAgICBpZiAoaXRlbS54ID09PSB4ICYmIGl0ZW0ueSA9PT0geSkge1xyXG4gICAgICAgICAgICBvYmplY3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG4vL2Z1bmN0aW9uIHRvIGRldGVybWluZSBpZiB0aGVyZSBhcmUgc3RpbGwgYW55IGVuZW15IGJvYXRzIGFyb3VuZCBhbiBhcmVhIGFmdGVyIGEgYm9hdCBoYXMgYmVlbiBzdW5rXHJcbi8vV2hlbiBhIHN1bmtlbiBzaGlwIGhhcyBiZWVuIGFubm91bmNlZCwgdGhlIGZ1bmN0aW9uIGZpbmRzIG91dCB3aGV0aGVyIG9yIG5vdCB0aGVyZSBpcyBkaXNjcmlwYW5jeSBcclxuLy8uLi5iZXR3ZWVuIHRoZSBoaXRDb3VudHMgYW5kIHRoZSBzdW5rZW4gc2hpcCdzIGhpdCBwb2ludHMuXHJcbi8vSWYgdGhlcmUgaXMsIHBhc3MgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3Vua2VuIHNoaXAgdGhhdCB3YXMgaW5pdGlhbGx5IGhpdFxyXG4vLy4udG8gY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXRcclxuLy9UaGlzIGZ1bmN0aW9uIGlzIHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgYW55IHZhbGlkIGNvb3JkaW5hdGVzIHRvIGJlIHRoZSBuZXh0IHRhcmdldHMuIFxyXG5leHBvcnQgY29uc3QgaXNBcmVhU2VjdXJlID0gKHN1bmtTaGlwLCB4X2Nvb3IsIHlfY29vcikgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJoaXRDb3VudHMgPSBcIiArIChtZW1vcnkuaGl0Q291bnRzICsgMSkpXHJcbiAgICBjb25zb2xlLmxvZyhcInNoaXAgbGVuZ3RoID0gXCIgKyBzdW5rU2hpcC5sZW5ndGggKVxyXG4gICAgbWVtb3J5LnNoaXBMb2NhdGVkID0gZmFsc2U7IFxyXG4gICAgLy9JIGhhZCB0byBtYW51YWxseSBpbmNyZW1lbnQgbWVtb3J5LmhpdENvdW50cyBoZXJlIGJlY2F1c2UgaXNBcmVhU2VjdXJlIGlzIGV4ZWN1dGVkIGJlZm9yZSB0aGUgQUkgaW5jcmVtZW50cyBoaXRDb3VudCBpbiBoaXRPcHBvbmVudEFyZWEoKVxyXG4gICAgaWYgKHN1bmtTaGlwLmxlbmd0aCAhPT0gKG1lbW9yeS5oaXRDb3VudHMgKyAxKSkge1xyXG4gICAgICAgIHVwZGF0ZUhpdENvdW50KCk7IFxyXG4gICAgICAgIC8vICAgYXR0YWNrVGhlT3RoZXJFbmQoeF9jb29yLCB5X2Nvb3IpXHJcbiAgICAgLy8gICBjb25zb2xlLmxvZygnaXNBcmVhU2VjdXJlIG1lbW9yeS5wcmV2aW91c1RhcmdldDogJyArIFwiKFwiICsgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKyBcIixcIiArIG1lbW9yeS5wcmV2aW91c1RhcmdldC55ICsgXCIpXCIpOyBcclxuICAgICAgICAvL0hvcml6b250YWwgXHJcbiAgICAgICAgaWYgKHlfY29vciA9PT0gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkpIHtcclxuICAgICAgICAgICAgaWYgKHhfY29vciA+IG1lbW9yeS5wcmV2aW91c1RhcmdldC54KSB7XHJcbiAgICAgICAgICAgICAgICBmaW5kTmVpZ2hib3JPZkVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCAtIDEsIG1lbW9yeS5wcmV2aW91c1RhcmdldC55LCB0cnVlLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh4X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICAgICAgZmluZE5laWdoYm9yT2ZFbmQobWVtb3J5LnByZXZpb3VzVGFyZ2V0LnggKyAxLCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1ZlcnRpY2FsIFxyXG4gICAgICAgIGVsc2UgaWYgKHhfY29vciA9PT0gbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgaWYgKHlfY29vciA+IG1lbW9yeS5wcmV2aW91c1RhcmdldC55KSB7XHJcbiAgICAgICAgICAgICAgICBmaW5kTmVpZ2hib3JPZkVuZChtZW1vcnkucHJldmlvdXNUYXJnZXQueCwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkgLSAxLCBmYWxzZSwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoeV9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LnkpIHtcclxuICAgICAgICAgICAgICAgIGZpbmROZWlnaGJvck9mRW5kKG1lbW9yeS5wcmV2aW91c1RhcmdldC54LCBtZW1vcnkucHJldmlvdXNUYXJnZXQueSArIDEsIGZhbHNlLCB0cnVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBcmVhIGlzIHNlY3VyZS4gQ2xlYXIgTmV4dFRhcmdldFtdLiBDbGVhciBuZXh0U2Vjb25kYXJ5VGFyZ2V0W10uIFwiKVxyXG4gICAgICAgIGNsZWFyTmV4dFRhcmdldCgpOyBcclxuICAgICAgICBjbGVhck5leHRTZWNvbmRhcnlUYXJnZXQoKTsgXHJcbiAgICAgIC8vICBtZW1vcnkucHJldmlvdXNUYXJnZXQgPSBudWxsOyBcclxuICAgICAgICByZXNldEhpdENvdW50cygpXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGF0dGFja1RoZU90aGVyRW5kID0gKHhfY29vciwgeV9jb29yKSA9PiB7XHJcbiAgICAvL2lmIHRoZSBhdHRhY2sgcGF0dGVybiB3YXMgaG9yaXpvbnRhbFxyXG4gICAgdmFyIG5ld1ggPSAwO1xyXG4gICAgdmFyIG5ld1kgPSAwO1xyXG4gICAgdmFyIGZvdW5kQ29uc2VjdXRpdmUgPSBmYWxzZTsgXHJcbiAgICAvL2hvcml6b250YWwgb3JpZW50YXRpb24gXHJcbiAgICB2YXIgZGlyZWN0aW9uWCA9IDA7IFxyXG4gICAgdmFyIGRpcmVjdGlvblkgPSAwIFxyXG4gICAgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC55ID09PSB5X2Nvb3IgJiYgeF9jb29yICE9PSBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgIGlmICh4X2Nvb3IgPiBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25YID0gLTI7IFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoeF9jb29yIDwgbWVtb3J5LnByZXZpb3VzVGFyZ2V0LngpIHtcclxuICAgICAgICAgICAgZGlyZWN0aW9uWCA9IDI7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vaWYgdGhlIGF0dGFjayBwYXR0ZXJuIHdhcyB2ZXJ0aWNhbCBcclxuICAgIGVsc2UgaWYgKG1lbW9yeS5wcmV2aW91c1RhcmdldC54ID09PSB4X2Nvb3IgJiYgeV9jb29yICE9PSBtZW1vcnkucHJldmlvdXNUYXJnZXQueSkge1xyXG4gICAgICAgIGlmICh5X2Nvb3IgPiBtZW1vcnkucHJldmlvdXNUYXJnZXQueSkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25ZID0gLTI7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh4X2Nvb3IgPCBtZW1vcnkucHJldmlvdXNUYXJnZXQueCkge1xyXG4gICAgICAgICAgICBkaXJlY3Rpb25ZID0gMjsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkuY29uZmlybWVkSGl0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ID09PSAoeF9jb29yICsgZGlyZWN0aW9uWCkgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0gKHlfY29vciArIGRpcmVjdGlvblkpKXtcclxuICAgICAgICAgICAgbmV3WCA9IHhfY29vciArIGRpcmVjdGlvblg7XHJcbiAgICAgICAgICAgIG5ld1kgPSB5X2Nvb3IgKyBkaXJlY3Rpb25ZO1xyXG4gICAgICAgICAgICBmb3VuZENvbnNlY3V0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJlY3Rpb25YIC89IDIpOyBcclxuICAgICAgICAgICAgTWF0aC5mbG9vcihkaXJlY3Rpb25ZIC89IDIpOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZm91bmRDb25zZWN1dGl2ZSkge1xyXG4gICAgICAgIHZhciBkb250RW5kTG9vcCA9IHRydWU7IFxyXG4gICAgICAgIHZhciBmb3VuZENvbnMgPSBmYWxzZTsgXHJcbiAgICAgICAgdmFyIGNvdW50ID0gMTsgXHJcbiAgICAgICAgdmFyIGNvbnNlY3V0aXZlWCA9IDA7XHJcbiAgICAgICAgdmFyIGNvbnNlY3V0aXZlWSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGRvbnRFbmRMb29wKSB7XHJcbiAgICAgICAgICAgIGNvbnNlY3V0aXZlWCA9IG5ld1ggKyAoZGlyZWN0aW9uWCAqIGNvdW50KTtcclxuICAgICAgICAgICAgY29uc2VjdXRpdmVZID0gbmV3WSArIChkaXJlY3Rpb25ZICogY291bnQpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lbW9yeS5jb25maXJtZWRIaXRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ID09PSBjb25zZWN1dGl2ZVggJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0gY29uc2VjdXRpdmVZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKzsgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmRDb25zID0gdHJ1ZTsgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFmb3VuZENvbnMpIHtcclxuICAgICAgICAgICAgICAgIGRvbnRFbmRMb29wID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZENvbnMgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbWVtb3J5Lm5leHRUYXJnZXQucHVzaCh7IHg6IGNvbnNlY3V0aXZlWCwgeTogY29uc2VjdXRpdmVZIH0pXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBdHRhY2sgdGhlIG90aGVyIGVuZDogXCIgKyBjb25zZWN1dGl2ZVggKyBcIixcIiArIGNvbnNlY3V0aXZlWSlcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlIG90aGVyIGVuZCBpcyB2YWxpZCBcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkF0dGFjayB0aGUgb3RoZXIgZW5kOiBcIiArIGRpcmVjdGlvblggKyBcIixcIiArIGRpcmVjdGlvblkpXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY29uc3QgaWRlbnRpZnlPcmllbnRhdGlvbiA9ICh4X2Nvb3IsIHlfY29vcikgPT4ge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkuY29uZmlybWVkSGl0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkuY29uZmlybWVkSGl0c1tpXS54ICsgMSA9PT0geF9jb29yICYmIG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgPT09IHlfY29vcikge1xyXG4gICAgICAgICAgICBtZW1vcnkubmV4dFRhcmdldC5wdXNoKCh7eDogeF9jb29yICsgMSwgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnggLSAxID09PSB4X2Nvb3IgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgKyAxID09PSB5X2Nvb3IgJiYgbWVtb3J5LmNvbmZpcm1lZEhpdHNbaV0ueCA9PT0geF9jb29yKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnkgKyAtMSA9PT0geV9jb29yICYmIG1lbW9yeS5jb25maXJtZWRIaXRzW2ldLnggPT09IHhfY29vcikge1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjaG9vc2VUYXJnZXRCYXNlZE9uT3JpZW50YXRpb24gPSAoeF9jb29yLCB5X2Nvb3IpID0+IHtcclxuICAgIC8vRXZlcnkgdGltZSBhbiBhdHRhY2sgaGl0cyBhbiBlbmVteSBzaGlwLFxyXG4gICAgLy8uLi5jaGVjayB0byBzZWUgaWYgaXQgaGFzIGJlZW4gaGl0IG1vcmUgdGhhbiBvbmUgdGltZS5cclxuICAgIC8vSWYgc28sIGlkZW50aWZ5IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2hpcCBhbmQgZm9jdXMgdGhlIGF0dGFjayBvbiB0aGF0IHNoaXBcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5lbXlTaGlwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZW5lbXlTaGlwcy5wb3NBcnJheS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoZW5lbXlTaGlwcy5wb3NBcnJheVtqXS54ID09PSB4X2Nvb3IgJiYgZW5lbXlTaGlwcy5wb3NBcnJheVtqXS55KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGl0Q291bnQgPSAwOyBcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgZW5lbXlTaGlwcy5wb3NBcnJheS5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmVteVNoaXBzLnBvc0FycmF5W2tdLmhpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaXRDb3VudCsrOyBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBmaW5kVGhlRW5kID0gKHhfY29vciwgeV9jb29yLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpID0+IHtcclxuICAgIC8vZW5kIGNvbmRpdGlvbnM6XHJcbiAgICAvL0l0IGNvbWVzIHVwb24gYSBzcXVhcmUgdGhhdCBoYXMgbm90IGJlZW4gYXR0YWNrZWRcclxuICAgIC8vaXQgY29tZXMgdXBvbiB0aGUgZWRnZSBvZiB0aGUgbWFwIFxyXG4gICAgdmFyIG1vdmVYID0gMDtcclxuICAgIHZhciBtb3ZlWSA9IDA7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsICYmIGlzQ2xpbWJpbmcgJiYgeF9jb29yIDw9IDEwKSB7XHJcbiAgICAgICAgbW92ZVggPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNIb3Jpem9udGFsICYmICFpc0NsaW1iaW5nICYmIHhfY29vciA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIWlzSG9yaXpvbnRhbCAmJiBpc0NsaW1iaW5nICYmIHlfY29vciA8PSAxMCkge1xyXG4gICAgICAgIG1vdmVZID0gMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgIWlzQ2xpbWJpbmcgJiYgeV9jb29yID4gMCkge1xyXG4gICAgICAgIG1vdmVZID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS54ID09PSB4X2Nvb3IgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWCA9IHhfY29vciArIG1vdmVYOyBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWSA9IHlfY29vciArIG1vdmVZO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZGQgT3RoZXIgRW5kIFJlY3Vyc2lvbjogXCIgKyB0cmFuc1ggKyBcIixcIiArIHRyYW5zWSlcclxuICAgICAgICAgICAgICAgIGZpbmRUaGVFbmQoeF9jb29yICsgbW92ZVgsIHlfY29vciArIG1vdmVZLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0ICYmICFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgICAvL2RvIG5vdGhpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1lbW9yeS5uZXh0VGFyZ2V0LnB1c2goeyB4OiB4X2Nvb3IsIHk6IHlfY29vciwgaXNIb3JpejogaXNIb3Jpem9udGFsIH0pXHJcbiAgICAgICAgICAgICAgICBjbGVhclNlY29uZGFyeUl0ZW0oeF9jb29yLCB5X2Nvb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaW5kVGhlRW5kOiBcIiArIHhfY29vciArIFwiLFwiICsgeV9jb29yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9jbGVhclNlY29uZGFyeUl0ZW0oKVxyXG59XHJcblxyXG4vL1RoaXMgZnVuY3Rpb24gaXMgc2ltaWxhciB0byBmaW5kVGhlRW5kKCksIGJ1dCBpdCBmaW5kcyB0aGUgbmVpZ2hib3JpbmcgYXJlYXMgb2YgdGhlIGVuZCBvZiB0aGUgc2hpcCBcclxuY29uc3QgZmluZE5laWdoYm9yT2ZFbmQgPSAoeF9jb29yLCB5X2Nvb3IsIGlzSG9yaXpvbnRhbCwgaXNDbGltYmluZykgPT4ge1xyXG4gICAgdmFyIG1vdmVYID0gMDtcclxuICAgIHZhciBtb3ZlWSA9IDA7XHJcbiAgICBpZiAoaXNIb3Jpem9udGFsICYmIGlzQ2xpbWJpbmcgJiYgeF9jb29yIDw9IDEwKSB7XHJcbiAgICAgICAgbW92ZVggPSAxO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNIb3Jpem9udGFsICYmICFpc0NsaW1iaW5nICYmIHhfY29vciA+IDApIHtcclxuICAgICAgICBtb3ZlWCA9IC0xO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIWlzSG9yaXpvbnRhbCAmJiBpc0NsaW1iaW5nICYmIHlfY29vciA8PSAxMCkge1xyXG4gICAgICAgIG1vdmVZID0gMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFpc0hvcml6b250YWwgJiYgIWlzQ2xpbWJpbmcgJiYgeV9jb29yID4gMCkge1xyXG4gICAgICAgIG1vdmVZID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS54ID09PSB4X2Nvb3IgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ueSA9PT0geV9jb29yKSB7XHJcbiAgICAgICAgICAgIGlmIChtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5oaXQgJiYgbWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0ub2NjdXBpZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zWCA9IHhfY29vciArIG1vdmVYO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHJhbnNZID0geV9jb29yICsgbW92ZVk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkZCBPdGhlciBFbmQgUmVjdXJzaW9uOiBcIiArIHRyYW5zWCArIFwiLFwiICsgdHJhbnNZKVxyXG4gICAgICAgICAgICAgICAgZmluZE5laWdoYm9yT2ZFbmQoeF9jb29yICsgbW92ZVgsIHlfY29vciArIG1vdmVZLCBpc0hvcml6b250YWwsIGlzQ2xpbWJpbmcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobWVtb3J5Lm9wcG9uZW50LmJvYXJkQXJyYXlbaV0uaGl0ICYmICFtZW1vcnkub3Bwb25lbnQuYm9hcmRBcnJheVtpXS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgLy9kbyBub3RoaW5nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaG9vc2VWYWxpZFBvdGVudGlhbFRhcmdldCh4X2Nvb3IsIHlfY29vcilcclxuICAgICAgICAgICAgICAgIGNsZWFyU2Vjb25kYXJ5SXRlbSh4X2Nvb3IsIHlfY29vcik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbmROZWlnaGJvck9mRW5kOiBcIiArIHhfY29vciArIFwiLFwiICsgeV9jb29yKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgZ2V0TGVmdE92ZXJIaXRDb3VudHMgPSAoKSA9PiB7XHJcbiAgICAvL1Rha2VzIHRoZSBzaGlwcyB0aGF0IGFyZSBwYXJ0aWFsbHkgaGl0IGFuZCBhZGQgdGhlaXIgdG90YWwgbnVtYmVyIG9mIHBhcnRzIHRoYXQgaGF2ZSBiZWVuIGhpdCBcclxuICAgIHZhciB0b3RhbEhpdCA9IDA7IFxyXG5cclxuICAgIG1lbW9yeS5lbmVteVNoaXBzLmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgaWYgKHNoaXAuaGFzQmVlbkhpdCAmJiAhc2hpcC5pc1N1bmspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaGlwLnBvc0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hpcC5wb3NBcnJheVtpXS5pc0hpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSGl0ICs9IDE7IFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIHRvdGFsSGl0OyBcclxufSIsImltcG9ydCB7IGNyZWF0ZVBsYXllciB9IGZyb20gJy4vcGxheWVyLmpzJzsgXHJcbmltcG9ydCB7IGdlbmVyYXRlR3JpZCB9IGZyb20gJy4vZ3JpZC5qcyc7IFxyXG5pbXBvcnQgeyBwbGFjZUFsbFNoaXBzIH0gZnJvbSAnLi9wbGFjZVNoaXBzLmpzJztcclxuaW1wb3J0IHsgc2V0U2VsZiwgc2V0T3Bwb25lbnQsIGdldE9wcG9uZW50U2hpcHMgfSBmcm9tICcuL2NvbXB1dGVyQUkuanMnO1xyXG5pbXBvcnQgeyB0cmFja1R1cm5zIH0gZnJvbSAnLi90dXJuVHJhY2tpbmcuanMnO1xyXG5pbXBvcnQgeyBydW5BSSwgZ2V0T3Bwb25lbnQgfSBmcm9tICcuL2NvbXB1dGVyQUkuanMnOyBcclxuXHJcbnZhciBwbGF5ZXJPbmVUdXJuID0gdHJ1ZTsgXHJcbmNvbnN0IHR1cm5NZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3R1cm5NZXNzYWdlJylcclxuXHJcblxyXG5leHBvcnQgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbmV3R2FtZSA9IG5ldyBPYmplY3QoKTtcclxuICAgIG5ld0dhbWUub3ZlciA9IGZhbHNlO1xyXG4gICAgbmV3R2FtZS5lbmRHYW1lID0gKCkgPT4ge1xyXG4gICAgICAgIG5ld0dhbWUub3ZlciA9IHRydWU7IFxyXG4gICAgfVxyXG4gICAgY29uc3QgcGxheWVyT25lID0gY3JlYXRlUGxheWVyKCdwbGF5ZXJPbmUnLCAncGxheWVyVHdvJywgJ3BsYXllckFyZWFPbmUnLCBmYWxzZSk7XHJcbiAgICBjb25zdCBwbGF5ZXJUd28gPSBjcmVhdGVQbGF5ZXIoJ3BsYXllclR3bycsICdwbGF5ZXJPbmUnLCAncGxheWVyQXJlYVR3bycsIHRydWUpO1xyXG5cclxuXHJcbiAgICAvL1RoZSBmb2xsb3dpbmcgdHdvIGxpbmVzIGlzIGEgd2F5IHRvIGxldCBib3RoIHBsYXllciBvYmplY3RzIGtub3cgaWYgYSB3aW5uZXIgaXMgYW5ub3VuY2VkLiBcclxuICAgIHBsYXllck9uZS5zZXRHYW1lT2JqZWN0KG5ld0dhbWUpO1xyXG4gICAgcGxheWVyVHdvLnNldEdhbWVPYmplY3QobmV3R2FtZSk7XHJcbiAgICB0cmFja1R1cm5zKHBsYXllck9uZSwgcGxheWVyVHdvKTtcclxuXHJcbiAgICBpZiAocGxheWVyVHdvLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICBwbGF5ZXJUd28uc2V0T3Bwb25lbnQocGxheWVyT25lKTtcclxuICAgICAgICBnZXRPcHBvbmVudChwbGF5ZXJPbmUpXHJcbiAgICAgICAgcGxheWVyT25lLmlzUGxheWluZ0FnYWluc3RBSSA9IHRydWU7IFxyXG4gICAgICAgIGdldE9wcG9uZW50U2hpcHMoKTsgXHJcbiAgICAgICAgcnVuQUkocGxheWVyVHdvKTtcclxuICAgIH1cclxuICAgXHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fubm91bmNlbWVudCcpLmlubmVySFRNTCA9ICcnO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VuZEdhbWVNZXNzYWdlJykuaW5uZXJIVE1MID0gJyc7XHJcblxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGxheWVyT25lLCBcclxuICAgICAgICBwbGF5ZXJUd28sXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCIvL0dlbmVyYXRlIGdyaWQgZm9yIGVhY2ggcGxheWVyXHJcbi8vR3JpZCBrZWVwcyB0cmFjayBvZiB3aGV0aGVyIHRoZSBwbGF5ZXIncyBzaGlwIGFyZSBhbGwgc3VuayBvciBub3QuIFxyXG4vL0VhY2ggc3F1YXJlIHVuaXQgaXMgcmVuZGVyZWQgYnkgYSBkaXYuICBcclxuLy9FYWNoIHNxdWFyZSBpcyBpZGVudGlmaWVkIGJ5IGEgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIElEXHJcbi8vVXNlIGFuIGFycmF5IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBzcXVhcmUgdW5pdHM/IEl0IHdvdWxkIGJlIGFuIGFycmF5IG9mIGFycmF5cyBcclxuLy9BIG1hc3RlciBhcnJheSBjb25zaXN0IG9mIGFycmF5cyBvZiByb3dzXHJcbi8vRWFjaCBvZiB0aGUgY2hpbGQgYXJyYXkgcmVwcmVzZW50cyBhIHJvdyBhbmQgY29uc2lzdHMgb2YgaW5kaXZpZHVhbCB1bml0cyBvZiBhIGNvbHVtbiBcclxuLy9FYWNoIHNxdWFyZSB1bml0IGlzIGFuIG9iamVjdCBcclxuLy9jb250YWlucyB4LHkgY29vcmRpbmF0ZXMgXHJcbi8vSGFzIGEgYm9vbGVhbiB2YWx1ZSBvZiB3aGV0aGVyIHRoZSBhcmVhIGl0IHJlcHJlc2VudHMgaGF2ZSBiZWVuIGhpdCBmb3Igbm90LiBcclxuXHJcbi8vTm9uLWhpdCBzcXVhcmVzIGFyZSBjb25zaWRlcmVkIGVtcHR5IFxyXG5cclxuaW1wb3J0IHsgaXNTaGlwU3VuayB9IGZyb20gJy4vc2hpcC5qcyc7IFxyXG5pbXBvcnQgeyBjaGVja1NoaXBzIH0gZnJvbSAnLi93aW5Db25kaXRpb24uanMnO1xyXG5pbXBvcnQgeyBpc0FyZWFTZWN1cmUgfSBmcm9tICcuL2NvbXB1dGVyQUkuanMnOyBcclxuaW1wb3J0IHsgcGxheUNhbm5vbkF1ZGlvIH0gZnJvbSAnLi9wbGF5Q2Fubm9uQXVkaW8uanMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNxdWFyZVVuaXQgPSB7XHJcbiAgICB1bml0OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXHJcbiAgICBoaXQ6IGZhbHNlLCBcclxuICAgIGlzRW1wdHk6IHRydWUsXHJcbiAgIFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVHcmlkID0gKGNvbHVtbnMsIHBsYXllcikgPT4ge1xyXG4gICAgdmFyIG5ld2dyaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgcGxheWVyLnNldEJvYXJkQ29sdW1ucyhjb2x1bW5zKTtcclxuICAgIG5ld2dyaWQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdncmlkJylcclxuICAgIGlmIChjb2x1bW5zIDwgMTApIHtcclxuICAgICAgICBjb2x1bW5zID0gMTA7IFxyXG4gICAgfVxyXG4gICAgZ2VuZXJhdGVSb3cobmV3Z3JpZCwgY29sdW1ucywgY29sdW1ucywgcGxheWVyKTsgXHJcbiAgICByZXR1cm4gbmV3Z3JpZDsgXHJcbn1cclxuXHJcbi8vVGhpcyBmdW5jdGlvbiBub3Qgb25seSBnZW5lcmF0ZXMgdGhlIHJvd3Mgb2YgdGhlIGdyaWQsIFxyXG4vL2J1dCBpcyBhbHNvIHJlc3BvbnNpYmxlIGZvciBnZW5lcmF0aW5nIHRoZSBzcXVhcmVzIGZvciBob2xkaW5nIGltcG9ydGFudCBpbmZvcm1hdGlvbiBzdWNoIGFzIHdoZXRoZXIgb3Igbm90IGEgc3F1YXJlIGlzIGVtcHR5IFxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVSb3cgPSAodGFyZ2V0R3JpZCwgY29sdW1uLCBjb3VudCwgcGxheWVyKSA9PiB7XHJcbiAgICBpZiAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IFxyXG4gICAgICAgIHJvdy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3JvdycpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGNvbHVtbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkaW5hdGUgPSBpICsgJywnICsgY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB7XHJcbiAgICAgICAgICAgICAgICBjb29yZGluYXRlLCBcclxuICAgICAgICAgICAgICAgIHg6IGksXHJcbiAgICAgICAgICAgICAgICB5OiBjb3VudCwgXHJcbiAgICAgICAgICAgICAgICBoaXQ6IGZhbHNlLCBcclxuICAgICAgICAgICAgICAgIG9jY3VwaWVkOiBmYWxzZSwgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkucHVzaChhcmVhKTsgXHJcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChnZW5lcmF0ZVNxdWFyZShwbGF5ZXIsIHBsYXllci5ib2FyZEFycmF5W3BsYXllci5ib2FyZEFycmF5Lmxlbmd0aCAtIDFdLCBjb29yZGluYXRlLnRvU3RyaW5nKCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcm93LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAncm93Jyk7IFxyXG4gICAgICAgIHRhcmdldEdyaWQuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICBnZW5lcmF0ZVJvdyh0YXJnZXRHcmlkLCBjb2x1bW4sIGNvdW50IC0gMSwgcGxheWVyKSAgIFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVTcXVhcmUgPSAocGxheWVyLCBhcmVhLCBJRCkgPT4ge1xyXG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7IFxyXG4gICAgc3F1YXJlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnZW1wdHlTcXVhcmUnKTsgXHJcbiAgICBzcXVhcmUuc2V0QXR0cmlidXRlKCdpZCcsIHBsYXllci5uYW1lICsgXCItXCIgKyBJRCk7IFxyXG5cclxuICAgIC8vdG8gc2hvdyB0aGUgY29vcmRpbmF0ZXMgb24gcmVuZGVyXHJcbiAgLypcclxuICAgIGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICBkaXNwbGF5LnN0eWxlLm1hcmdpbiA9ICdhdXRvJzsgXHJcbiAgICBkaXNwbGF5LmlubmVySFRNTCA9IElEOyBcclxuICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkaXNwbGF5KSovXHJcbiAgICBcclxuICAgIHNxdWFyZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAvL3R1cm5UcmFja2VyIGtlZXBzIHRyYWNrIG9mIHRoZSBwbGF5ZXIncyB0dXJuIGV2ZXJ5dGltZSB0aGV5IGF0dGVtcHQgdG8gaGl0IGVhY2ggb3RoZXIncyBzaGlwc1xyXG4gICAgICAgIHZhciB0dXJuU3RhdHVzID0gcGxheWVyLnR1cm5UcmFja2VyLmdldFR1cm5TdGF0dXMoKTsgXHJcblxyXG4gICAgICAgIC8vVGhpcyBwYXJ0IG5lZWRzIGZ1cnRoZXIgd29yayBpZiB0aGUgcGxheWVyIGNob29zZXMgdG8gcGxheSB3aXRoIGFub3RoZXIgb3BwcG9uZW50IG90aGVyIHRoYW4gdGhlIGNvbXB1dGVyIFxyXG4gICAgICAgIGlmICghYXJlYS5oaXQgJiYgcGxheWVyLnR1cm5Cb29sSUQgIT09IHR1cm5TdGF0dXMgJiYgIXBsYXllci5nYW1lT2JqZWN0Lm92ZXIgJiYgcGxheWVyLmlzQ29tcHV0ZXIpIHtcclxuICAgICAgICAgICAgYXJlYS5oaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICBwbGF5Q2Fubm9uQXVkaW8oKTsgXHJcbiAgICAgICAgICAgIGlmIChhcmVhLm9jY3VwaWVkKSB7XHJcbiAgICAgICAgICAgICAgICBoaXRPY2N1cGllZChwbGF5ZXIsIHNxdWFyZSwgYXJlYS54LCBhcmVhLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaGl0RW1wdHkoc3F1YXJlKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGxheWVyLnR1cm5UcmFja2VyLnRvZ2dsZVR1cm4oKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiBzcXVhcmU7IFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaGl0RW1wdHkgPSAoc3F1YXJlKSA9PiB7XHJcbiAgICBzcXVhcmUuY2xhc3NMaXN0LnRvZ2dsZSgnaGl0RW1wdHlTcXVhcmUnKTtcclxuICAgIGlmIChzcXVhcmUuY2hpbGROb2Rlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdjbGFzcycsICdkb3QnKVxyXG4gICAgICAgIHNxdWFyZS5hcHBlbmRDaGlsZChkb3QpO1xyXG4gICAgfSBcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGhpdE9jY3VwaWVkID0gKHBsYXllciwgc3F1YXJlLCB4X2Nvb3IsIHlfY29vcikgPT4ge1xyXG4gICAgaWYgKHBsYXllci5pc0NvbXB1dGVyKSB7XHJcbiAgICAgICAgc3F1YXJlLmNsYXNzTGlzdC5yZW1vdmUoJ2hpdEVtcHR5U3F1YXJlJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzcXVhcmUuY2xhc3NMaXN0LnJlbW92ZSgnb2NjdXBpZWRTcXVhcmUnKTtcclxuICAgIH1cclxuICAgIHNxdWFyZS5jbGFzc0xpc3QuYWRkKCdoaXRPY2N1cGllZFNxdWFyZScpO1xyXG4gICAgaWYgKHNxdWFyZS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRvdC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2RvdCcpXHJcbiAgICAgICAgc3F1YXJlLmFwcGVuZENoaWxkKGRvdCk7XHJcbiAgICB9XHJcbiBcclxuICAgIHZhciB0YXJnZXRlZF9zaGlwID0gbnVsbDsgXHJcbiAgICBwbGF5ZXIuc2hpcEFycmF5LmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgc2hpcC5oYXNCZWVuSGl0ID0gdHJ1ZTsgXHJcbiAgICAgICAgc2hpcC5wb3NBcnJheS5mb3JFYWNoKHBvcyA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwb3MueCA9PT0geF9jb29yICYmIHBvcy55ID09PSB5X2Nvb3IpIHtcclxuICAgICAgICAgICAgICAgIHBvcy5pc0hpdCA9IHRydWU7IFxyXG4gICAgICAgICAgICAgICAgc2hpcC5pc1N1bmsgPSBpc1NoaXBTdW5rKHBsYXllciwgc2hpcCk7IFxyXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgcGxheWVyIGlzIHBsYXlpbmcgYWdhaW5zdCB0aGUgQUksIHRoaXMgbm90aWZpZXMgdGhlIEFJIG9mIGltcG9ydGFudCBpbmZvXHJcbiAgICAgICAgICAgICAgICAvLy4uLmFib3V0IHNoaXAgYW5kIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgY29uZmlybWVkIGRhbWFnZSBsb2NhdGlvbiBcclxuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuaXNQbGF5aW5nQWdhaW5zdEFJICYmIHNoaXAuaXNTdW5rKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNBcmVhU2VjdXJlKHNoaXAsIHhfY29vciwgeV9jb29yKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbiAgICBjaGVja1NoaXBzKHBsYXllcilcclxufVxyXG5cclxuIiwiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICcuL3NoaXAuanMnOyBcclxuaW1wb3J0IHsgZ2VuZXJhdGVHcmlkIH0gZnJvbSAnLi9ncmlkLmpzJzsgXHJcbmltcG9ydCAnLi9teXN0eWxlLmNzcyc7XHJcbmltcG9ydCB7IHN0YXJ0R2FtZSwgdHJhY2tUdXJucyB9IGZyb20gJy4vZ2FtZUxvb3AuanMnO1xyXG5pbXBvcnQgeyBkZWxCb2FyZCB9IGZyb20gJy4vcmVzZXQuanMnO1xyXG4vL2ltcG9ydCB7IGdlbmVyYXRlQ29vcmRpbmF0ZXMgfSBmcm9tICcuL3BsYWNlU2hpcHMuanMnO1xyXG5cclxuXHJcbi8vZm9yIHdhdGNoaW5nIHRoZSBodG1sIGZpbGUgXHJcbnJlcXVpcmUoJy4vaG9tZS5odG1sJylcclxuXHJcbnZhciBwbGF5ZXJzID0gc3RhcnRHYW1lKCk7XHJcbmNvbnN0IHN0YXJ0T3ZlckJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydE92ZXJCdXR0b24nKTtcclxuY29uc3QgcGxheWVyT25lQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXJBcmVhT25lJyk7XHJcbmNvbnN0IHBsYXllclR3b0FyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyQXJlYVR3bycpO1xyXG5cclxuc3RhcnRPdmVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgZGVsQm9hcmQocGxheWVyT25lQXJlYSk7XHJcbiAgICBkZWxCb2FyZChwbGF5ZXJUd29BcmVhKTtcclxuICAgIHBsYXllcnNbXCJwbGF5ZXJPbmVcIl0ucmVzZXQoKTsgXHJcbiAgICBwbGF5ZXJzW1wicGxheWVyVHdvXCJdLnJlc2V0KCk7IFxyXG4gICAgcGxheWVycyA9IHN0YXJ0R2FtZSgpOyBcclxufSk7XHJcblxyXG5cclxuXHJcbiIsIi8vaW1wb3J0IHtjcmVhdGVTaGlwLCBjcmVhdGVDYXJyaWVyLCBjcmVhdGVCYXR0bGVzaGlwLCBjcmVhdGVEZXN0cm95ZXIsIGNyZWF0ZVN1Ym1hcmluZSwgY3JlYXRlUGF0cm9sIH0gZnJvbSAnLi9zaGlwLmpzJzsgXHJcbmltcG9ydCB7IGNyZWF0ZVNoaXAgfSBmcm9tICcuL3NoaXAuanMnOyBcclxuaW1wb3J0IHsgZ2VuUmFuZG9tIH0gZnJvbSAnLi9yYW5kR2VuLmpzJzsgXHJcbi8vVGhpcyBzaG91bGQgaWRlbnRpZnkgd2hpY2ggZ3JpZCB0byBwbGFjZSB0aGUgc2hpcHMgaW5cclxuLy9JdCBzaG91bGQgcmFuZG9taXplIHRoZSBwbGFjZW1lbnQuXHJcbi8vaXQgc2hvdWxkIHJlY29nbml6ZSB0aGUgZWRnZXMgb2YgdGhlIGdpcmQgYW5kIGtub3cgbm90IHRvIHBsYWNlIHNoaXBzIHRoYXQgZ29lcyBiZXlvbmQgdGhlIGVkZ2UgXHJcbi8vaXQgc2hvdWxkIGtub3cgbm90IHRvIG92ZXJsYXAgdGhlIHNoaXBzIFxyXG5cclxuLy9GdW5jdGlvblxyXG4vL0RldGVybWluZSB3aGF0IHNoaXAgaXQgd2lsbCBjcmVhdGVcclxuLy9JZGVudGlmeSB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIFxyXG4vL0xvb3A6IFxyXG4vL0dlbmVyYXRlIHJhbmRvbSBudW1iZXJzIGZvciB4IGFuZCB5IGNvb3JkaW5hdGVzIFxyXG4vL0RldGVybWluZSBpZiB0aGUgY29vcmRpbmF0ZXMgYXJlIHJpZ2h0IGJhc2VkIG9uIHRoZSBmb2xsb3dpbmcgY3JpdGVyaWFcclxuLy8xLikgVGhlIHNoaXAgZG9lcyBub3QgZ28gb3V0IG9mIGJvdW5kcyBvZiB0aGUgZ3JpZCBcclxuLy8yLikgVGhlIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbm90aGVyIHNoaXAgXHJcbi8vQnJlYWsgdGhlIGxvb3Agd2hlbiB0aGUgc2hpcCBhcHByb3ByaWF0ZWx5IHBsYWNlZCBcclxuXHJcbi8vSG93IGRvZXMgdGhlIGdhbWUgaWRlbnRpZnkgdGhlIG93bmVyc2hpcCBvZiB0aGUgc2hpcD9cclxuXHJcblxyXG5leHBvcnQgY29uc3QgcGxhY2VBbGxTaGlwcyA9IChwbGF5ZXIsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdjYXJyaWVyJywgNSwgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdiYXR0bGVzaGlwJywgNCwgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdkZXN0cm95ZXInLCAzLCBncmlkTGVuZ3RoKVxyXG4gICAgcGxhY2VTaGlwKHBsYXllciwgJ3N1Ym1hcmluZScsIDMsIGdyaWRMZW5ndGgpXHJcbiAgICBwbGFjZVNoaXAocGxheWVyLCAncGF0cm9sIGJvYXQxJywgMiwgZ3JpZExlbmd0aClcclxuICAgIHBsYWNlU2hpcChwbGF5ZXIsICdwYXRyb2wgYm9hdDInLCAyLCBncmlkTGVuZ3RoKVxyXG59XHJcblxyXG4vL3BsYWNlcyB0aGUgcGxheWVycyBzaGlwXHJcbi8vVGhlcmUgc2hvdWxkIGJlIGEgc2VwYXJhdGUgZnVuY3Rpb24gdGhhdCBwbGFjZXMgdGhlIGNvbXB1dGVyJ3Mgc2hpcC4gXHJcbi8vZ3JpZExlbmd0aCBpcyB0aGUgbnVtYmVyIG9mIGNvbHVtbnMgb24gdGhlIHBsYXllcidzIGJvYXJkIFxyXG5leHBvcnQgY29uc3QgcGxhY2VTaGlwID0gKHBsYXllciwgc2hpcFR5cGUsIGxlbmd0aCwgZ3JpZExlbmd0aCkgPT4ge1xyXG4gICAgLy9wb3NpdGlvbmVkIHdpbGwgdHVybiB0cnVlIGlmIHRoZSBhcHAgZmluZHMgYSBzdWl0YWJsZSBhcmVhIHRvIHBsYWNlIHRoZSBzaGlwIG9uIHRoZSBib2FyZCBcclxuICAgIHZhciBwb3NpdGlvbmVkID0gZmFsc2U7IFxyXG5cclxuICAgIC8vY3JlYXRlIGEgbmV3IHNoaXAgb2JqZWN0IFxyXG4gICAgY29uc3Qgc2hpcCA9IGNyZWF0ZVNoaXAobGVuZ3RoLCBzaGlwVHlwZSk7IFxyXG5cclxuICAgIC8vUnVuIHRoZSB0aGUgbG9vcCB1bnRpbCB0aGUgYXBwIGZpbmRzIGEgc3VpdGFibGUgcG9zaXRpb24gdG8gcGxhY2UgdGhlIHNoaXAgb24gdGhlIHBsYXllcidzIGJvYXJkIFxyXG4gICAgd2hpbGUgKCFwb3NpdGlvbmVkKSB7XHJcbiAgICAgICAgdmFyIGNvb3JkaW5hdGUgPSBnZW5lcmF0ZUNvb3JkaW5hdGVzKGdyaWRMZW5ndGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vSWYgMSwgcHJvZ3JhbXMgdHJpZXMgdG8gc2VlIGlmIHNoaXAgY2FuIGJlIHBsYWNlZCBob3Jpem9udGFsbHkgZmlyc3QsIHRoZW4gdmVydGljYWxseVxyXG4gICAgICAgIC8vSWYgMiwgcHJvZ3JhbXMgdHJpZXMgdG8gc2VlIGlmIHNoaXAgY2FuIGJlIHBsYWNlZCB2ZXJ0aWNhbGx5IGZpcnN0LCB0aGVuIGhvcml6b250YWxseVxyXG4gICAgICAgIHZhciBvcmllbnRhdGlvbiA9IGdlblJhbmRvbSgyKTtcclxuICAgICBcclxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IDEpIHtcclxuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlNoaXAgZm9yIHBsYWNlbWVudDogXCIgKyBzaGlwVHlwZSArIFwiOyBmaXJzdC1hdHRlbXB0OiBob3Jpem9udGFsIFwiKVxyXG4gICAgICAgICAgICBwb3NpdGlvbmVkID0gaG9yaXpUaGVuVmVydChwbGF5ZXIsIGNvb3JkaW5hdGUsIHNoaXAsIGxlbmd0aCwgZ3JpZExlbmd0aCkgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSAyKSB7XHJcbiAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJTaGlwIGZvciBwbGFjZW1lbnQ6IFwiICsgc2hpcFR5cGUgKyBcIjsgZmlyc3QgYXR0ZW1wdDogdmVydGljYWxcIilcclxuICAgICAgICAgICAgcG9zaXRpb25lZCA9IHZlcnRUaGVuSG9yaXoocGxheWVyLCBjb29yZGluYXRlLCBzaGlwLCBsZW5ndGgsIGdyaWRMZW5ndGgpIFxyXG4gICAgICAgIH1cclxuICAgICAgIC8qIGlmICghcG9zaXRpb25lZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVydW4gbG9vcCBmb3IgJyArIHNoaXBUeXBlKTtcclxuICAgICAgICB9Ki9cclxuICBcclxuICAgIH1cclxufSBcclxuXHJcbmNvbnN0IGhvcml6VGhlblZlcnQgPSAocGxheWVyLCBjb29yZGluYXRlLCBzaGlwLCBsZW5ndGgsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIC8vaWYgdGhlIHNoaXAgY2FuIGJlIHBsYWNlZCBob3Jpem9udGFsbHkgd2l0aG91dCBnb2luZyBvdXQgb2YgYm91bmRzLiBcclxuICAgIHZhciB2YWxpZFBsYWNlbWVudCA9IGZhbHNlOyBcclxuICAgIGlmIChjb29yZGluYXRlLnggKyBsZW5ndGggPD0gZ3JpZExlbmd0aCkge1xyXG4gICAgICAgIGlmICghaXNJdE9jY3VwcGllZChwbGF5ZXIsIGNvb3JkaW5hdGUsIGxlbmd0aCwgdHJ1ZSkpIHtcclxuICAgICAgICAgICAgLy9jb2RlIGZvciBwbGFjaW5nIHNoaXAgXHJcbiAgICAgICAgICAgIC8vZnVuY3Rpb24gaGFzIHRvIGtlZXAgdHJhY2sgb2YgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGlwXHJcbiAgICAgICAgICAgIC8vVGhpcyBpcyB0byBwcm92aWRlIGluZm9ybWF0aW9uIGZvciBhIGZ1bmN0aW9uIHRoYXQga2VlcHMgdHJhY2sgb2Ygd2hldGhlciBhIHNoaXAgaXMgc3VuayBvciBub3QgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gKGNvb3JkaW5hdGUueCArIGkpICYmIGl0ZW0ueSA9PT0gY29vcmRpbmF0ZS55ICYmIGl0ZW0ub2NjdXBpZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlU2hpcFBhcnQocGxheWVyLCBpdGVtLCBzaGlwLCBsZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZFxyXG4gICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LnB1c2goc2hpcClcclxuICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2lmIHBsYWNpbmcgc2hpcCBob3Jpem9udGFsbHkgbWFrZXMgaXQgb3V0IG9mIGJvdW5kcywgdHJ5IHBsYWNpbmcgaXQgdmVydGljYWxseVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKGNvb3JkaW5hdGUueSAtIGxlbmd0aCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICghaXNJdE9jY3VwcGllZChwbGF5ZXIsIGNvb3JkaW5hdGUsIGxlbmd0aCwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY29vcmRpbmF0ZS54ICYmIGl0ZW0ueSA9PT0gKGNvb3JkaW5hdGUueSAtIGkpICYmIGl0ZW0ub2NjdXBpZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZVNoaXBQYXJ0KHBsYXllciwgaXRlbSwgc2hpcCwgbGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8va2VlcCB0cmFjayBvZiB0aGUgc2hpcCBvbmNlIGl0J3MgcGxhY2VkIFxyXG4gICAgICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgICAgICB2YWxpZFBsYWNlbWVudCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWxpZFBsYWNlbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vaWYgdGhlIHNoaXAgY2FuJ3QgYmUgcGxhY2UgaG9yaXpvbnRhbGx5IG9yIHZlcnRpY2FsbHksIHJlcnVuIGxvb3A7IFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWxpZFBsYWNlbWVudDsgXHJcbn1cclxuXHJcbmNvbnN0IHZlcnRUaGVuSG9yaXogPSAocGxheWVyLCBjb29yZGluYXRlLCBzaGlwLCBsZW5ndGgsIGdyaWRMZW5ndGgpID0+IHtcclxuICAgIHZhciB2YWxpZFBsYWNlbWVudCA9IGZhbHNlOyBcclxuICAgIGlmIChjb29yZGluYXRlLnkgLSBsZW5ndGggPj0gMCkge1xyXG4gICAgICAgIGlmICghaXNJdE9jY3VwcGllZChwbGF5ZXIsIGNvb3JkaW5hdGUsIGxlbmd0aCwgZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PT0gY29vcmRpbmF0ZS54ICYmIGl0ZW0ueSA9PT0gKGNvb3JkaW5hdGUueSAtIGkpICYmIGl0ZW0ub2NjdXBpZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlU2hpcFBhcnQocGxheWVyLCBpdGVtLCBzaGlwLCBsZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZFxyXG4gICAgICAgICAgICBwbGF5ZXIuc2hpcEFycmF5LnB1c2goc2hpcClcclxuICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFsaWRQbGFjZW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoY29vcmRpbmF0ZS54ICsgbGVuZ3RoIDw9IGdyaWRMZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKCFpc0l0T2NjdXBwaWVkKHBsYXllciwgY29vcmRpbmF0ZSwgbGVuZ3RoLCB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5ib2FyZEFycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IChjb29yZGluYXRlLnggKyBpKSAmJiBpdGVtLnkgPT09IGNvb3JkaW5hdGUueSAmJiBpdGVtLm9jY3VwaWVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VTaGlwUGFydChwbGF5ZXIsIGl0ZW0sIHNoaXAsIGxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2tlZXAgdHJhY2sgb2YgdGhlIHNoaXAgb25jZSBpdCdzIHBsYWNlZFxyXG4gICAgICAgICAgICAgICAgcGxheWVyLnNoaXBBcnJheS5wdXNoKHNoaXApXHJcbiAgICAgICAgICAgICAgICB2YWxpZFBsYWNlbWVudCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbGlkUGxhY2VtZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbGlkUGxhY2VtZW50OyBcclxuXHJcbn1cclxuXHJcbmNvbnN0IHBsYWNlU2hpcFBhcnQgPSAocGxheWVyLCBpdGVtLCBzaGlwLCBsZW5ndGgpID0+IHtcclxuICAgIGNvbnN0IGRvbV9jb29yZGluYXRlcyA9IHBsYXllci5uYW1lICsgJy0nICsgaXRlbS54ICsgJywnICsgaXRlbS55O1xyXG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2Nvb3JkaW5hdGVzKVxyXG5cclxuXHJcbiAgICBpZiAoIXBsYXllci5pc0NvbXB1dGVyKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2Nvb3JkaW5hdGVzKS5jbGFzc0xpc3QucmVtb3ZlKCdlbXB0eVNxdWFyZScpXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tX2Nvb3JkaW5hdGVzKS5jbGFzc0xpc3QuYWRkKCdvY2N1cGllZFNxdWFyZScpXHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuXHJcbiAgICB9XHJcbiAgICAvL2Rpc3BsYXlzIHNoaXAgbGVuZ3RoIG9uIHNxdWFyZXNcclxuICAgIC8qXHJcbiAgICBjb25zdCBzaGlwX3R5cGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcclxuICAgIHNoaXBfdHlwZS5pbm5lckhUTUwgPSBsZW5ndGg7IFxyXG4gICAgc3F1YXJlLmFwcGVuZChzaGlwX3R5cGUpO1xyXG4gICAgKi9cclxuXHJcblxyXG4gICAgaXRlbS5vY2N1cGllZCA9IHRydWU7XHJcbiAgICBzaGlwLnNldFBvcyhpdGVtLngsIGl0ZW0ueSk7XHJcbn1cclxuXHJcbi8vdGhpcyBjYW4gYmUgcmV1c2VkIHRvIGRldGVybWluZSBpZiBoaXQgYXJlYSBpcyBvY2N1cGllZCBvciBub3QgXHJcbmV4cG9ydCBjb25zdCBpc0l0T2NjdXBwaWVkID0gKHBsYXllciwgY29vcmRpbmF0ZSwgbGVuZ3RoLCBob3Jpem9udGFsKSA9PiB7XHJcbiAgIC8vIGNvbnNvbGUubG9nKCd4ID0gJyArIGNvb3JkaW5hdGUueClcclxuICAgLy8gY29uc29sZS5sb2coJ3kgPSAnICsgY29vcmRpbmF0ZS55KVxyXG4gICAgdmFyIGlzT2NjdXBpZWQgPSBmYWxzZTsgXHJcbiAgICBpZiAoaG9yaXpvbnRhbCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnggPT09IChjb29yZGluYXRlLnggKyBpKSAmJiBpdGVtLnkgPT09IGNvb3JkaW5hdGUueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qY29uc29sZS5sb2coXCJwbGF5ZXIncyBjb29yZGluYXRlcyAoXCIgKyBpdGVtLnggKyBcIixcIiArIGl0ZW0ueSArIFwiKTogXCIgKyBpdGVtLm9jY3VwaWVkICsgXCJcXG5cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVzdGVkIGNvb3JkaW5hdGVzIChcIiArIChjb29yZGluYXRlLnggKyBpKSArIFwiLFwiICsgY29vcmRpbmF0ZS55ICsgXCIpXCJcclxuICAgICAgICAgICAgICAgICAgICApKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImhvcml6b250YWw6IFwiICsgaXRlbS5vY2N1cGllZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL0kgaGFkIHRvIGFkZCB0aGUgZm9sbG93aW5nIGJsb2NrIG9mIGNvZGUgbGF0ZXIgYXMgYW4gZXh0cmEgbWVhc3VyZSB0byBjaGVjayBmb3Igb2NjdXBpZWQgYXJlYXMgXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5zaGlwQXJyYXkuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXAucG9zQXJyYXkuZm9yRWFjaChwb3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MueCA9PT0gKGNvb3JkaW5hdGUueCArIGkpICYmIHBvcy55ID09PSBjb29yZGluYXRlLnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWU7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gbGVuZ3RoOyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvL2lmIHNoaXAgd2VyZSB0byBiZSBwbGFjZWQgdmVydGljYWxseVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcGxheWVyLmJvYXJkQXJyYXkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIihcIiArIGl0ZW0ueCArIFwiLFwiICsgaXRlbS55ICsgXCIpOiBcIiArIGl0ZW0ub2NjdXBpZWQgKyBcIlxcblwiICsgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXN0ZWQgY29vcmRpbmF0ZXMgKFwiICsgY29vcmRpbmF0ZS54ICsgXCIsXCIgKyAoY29vcmRpbmF0ZS55IC0gaSkgKyBcIilcIilcclxuICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS54ID09PSBjb29yZGluYXRlLnggJiYgaXRlbS55ID09PSAoY29vcmRpbmF0ZS55IC0gaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5vY2N1cGllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ2ZXJ0aWNhbDogXCIgKyBpdGVtLm9jY3VwaWVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc09jY3VwaWVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGxlbmd0aDsgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL0kgaGFkIHRvIGFkZCB0aGUgZm9sbG93aW5nIGJsb2NrIG9mIGNvZGUgbGF0ZXIgYXMgYW4gZXh0cmEgbWVhc3VyZSB0byBjaGVjayBmb3Igb2NjdXBpZWQgYXJlYXMgXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5zaGlwQXJyYXkuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaXAucG9zQXJyYXkuZm9yRWFjaChwb3MgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MueCA9PT0gY29vcmRpbmF0ZS54ICYmIHBvcy55ID09PSAoY29vcmRpbmF0ZS55IC0gaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNPY2N1cGllZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBsZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIC8vICBjb25zdCBtZXNzYWdlID0gJygnICsgY29vcmRpbmF0ZS54ICsgXCIsXCIgKyBjb29yZGluYXRlLnkgKyBcIikgXCIgKyBpc09jY3VwaWVkICsgXCI7IGhvcml6b250YWw6IFwiICsgaG9yaXpvbnRhbCArIFwiOyBMZW5ndGg6IFwiICsgbGVuZ3RoOyBcclxuICAgLy8gcGxheWVyLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gaXNPY2N1cGllZDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlQ29vcmRpbmF0ZXMgPSBjb2x1bW5zID0+IHtcclxuICAgIGNvbnN0IHggPSBnZW5SYW5kb20oY29sdW1ucyk7XHJcbiAgICBjb25zdCB5ID0gZ2VuUmFuZG9tKGNvbHVtbnMpOyBcclxuICAgIHJldHVybiB7eCx5fVxyXG59ICIsImltcG9ydCBDYW5ub24xIGZyb20gJy4vYXVkaW8vY2Fubm9uLXNob3QtMS5tcDMnO1xyXG5pbXBvcnQgQ2Fubm9uMiBmcm9tICcuL2F1ZGlvL2Nhbm5vbi1zaG90LTIubXAzJztcclxuaW1wb3J0IENhbm5vbjMgZnJvbSAnLi9hdWRpby9jYW5ub24tc2hvdC0zLm1wMyc7XHJcbmltcG9ydCB7IGdlblJhbmRvbSB9IGZyb20gJy4vcmFuZEdlbi5qcyc7XHJcblxyXG5mdW5jdGlvbiBwbGF5Q2Fubm9uMSgpIHtcclxuICAgIGNvbnN0IENhbm5vbk9uZSA9IG5ldyBBdWRpbyhDYW5ub24xKTtcclxuICAgIENhbm5vbk9uZS5wbGF5KCk7IFxyXG59XHJcblxyXG5mdW5jdGlvbiBwbGF5Q2Fubm9uMigpIHtcclxuICAgIGNvbnN0IENhbm5vblR3byA9IG5ldyBBdWRpbyhDYW5ub24yKTtcclxuICAgIENhbm5vblR3by5wbGF5KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBsYXlDYW5ub24zKCkge1xyXG4gICAgY29uc3QgQ2Fubm9uVGhyZWUgPSBuZXcgQXVkaW8oQ2Fubm9uMyk7XHJcbiAgICBDYW5ub25UaHJlZS5wbGF5KCk7XHJcbn1cclxuXHJcbmNvbnN0IGF1ZGlvQXJyYXkgPSBbcGxheUNhbm5vbjEsIHBsYXlDYW5ub24yLCBwbGF5Q2Fubm9uM11cclxuXHJcbmV4cG9ydCBjb25zdCBwbGF5Q2Fubm9uQXVkaW8gPSAoKSA9PiB7XHJcbiAgICB2YXIgY2hvb3NlID0gZ2VuUmFuZG9tKDMpIC0gMTtcclxuICAgIGF1ZGlvQXJyYXlbY2hvb3NlXSgpO1xyXG59IiwiLy9IYXZlIGFuIDItdGllciBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBzaGlwcyBhbmQgdGhlIGNvb3JkaW5hdGVzIFxyXG4vL1RoZSBzaGlwcyBhcnJheXMgb2YgXHJcbi8vVGhlIGdhbWUgaGFzIHRvIHJlY29nbml6ZSB0aGF0IHRoZSBzaGlwcyBjYW5ub3QgZ28gb3V0IG9mIGJvdW5kcy4gXHJcblxyXG4vL2NvbnN0IHNhbXBsZWFycmF5ID0gW1wiY2FycmllclwiPSBbXSwgXCJiYXR0bGVzaGlwXCI9W10sIFwiZGVzdHJveWVyXCIgPSBbXSwgXCJzdWJtYXJpbmVcIiA9IFtdLCBcInBhdHJvbFwiPVtdXVxyXG5cclxuaW1wb3J0IHsgZ2VuZXJhdGVHcmlkIH0gZnJvbSAnLi9ncmlkLmpzJztcclxuaW1wb3J0IHsgcGxhY2VBbGxTaGlwcyB9IGZyb20gJy4vcGxhY2VTaGlwcy5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBsYXllciA9IChuYW1lLCBvcHBvbmVudCwgY29udGFpbmVyLCBpc0FJKSA9PiB7XHJcbiAgICBjb25zdCBuZXdwbGF5ZXIgPSBuZXcgT2JqZWN0KCk7XHJcbiAgICBuZXdwbGF5ZXIuYm9hcmRBcnJheSA9IFtdO1xyXG4gICAgbmV3cGxheWVyLmJvYXJkQ29sdW1ucyA9IDA7IFxyXG4gICAgbmV3cGxheWVyLmJvYXJkTm9kZSA9IG51bGw7XHJcbiAgICBcclxuICAgIG5ld3BsYXllci5nYW1lT2JqZWN0ID0gbnVsbDsgXHJcbiAgICBuZXdwbGF5ZXIuc2V0R2FtZU9iamVjdCA9IGdhbWUgPT4ge1xyXG4gICAgICAgIG5ld3BsYXllci5nYW1lT2JqZWN0ID0gZ2FtZTsgXHJcbiAgICB9XHJcblxyXG4gICAgLy9BcnJheSBvZiBhbGwgdGhlIHBsYXllcidzIHNoaXBzXHJcbiAgICBuZXdwbGF5ZXIuc2hpcEFycmF5ID0gW107IFxyXG4gICAgbmV3cGxheWVyLm5hbWUgPSBuYW1lO1xyXG4gICAgbmV3cGxheWVyLm9wcG9uZW50TmFtZSA9IG9wcG9uZW50OyBcclxuICAgIG5ld3BsYXllci5vcHBvbmVudCA9IG51bGw7IFxyXG4gICAgbmV3cGxheWVyLnNldE9wcG9uZW50ID0gb3Bwb25lbnQgPT4ge1xyXG4gICAgICAgIG5ld3BsYXllci5vcHBvbmVudCA9IG9wcG9uZW50OyBcclxuICAgIH1cclxuICAgIG5ld3BsYXllci5pc0NvbXB1dGVyID0gaXNBSTsgXHJcbiAgICBuZXdwbGF5ZXIuaXNQbGF5aW5nQWdhaW5zdEFJID0gZmFsc2U7IFxyXG4gICAgbmV3cGxheWVyLm1lc3NhZ2VzID0gW107XHJcblxyXG4gICAgLy90dXJuVHJhY2tlciBpcyBhbiBvYmplY3Qgc2hhcmVkIGJldHdlZW4gcGxheWVycyB0aGF0IHRyYWNrcyB3aG9zZSB0dXJuIGl0IGlzIFxyXG4gICAgbmV3cGxheWVyLnR1cm5UcmFja2VyID0gbnVsbDsgXHJcbiAgICAvL3R1cm5Cb29sSUQgaGVscHMgdG8gdHJhY2sgdHVybnMgXHJcbiAgICBuZXdwbGF5ZXIudHVybkJvb2xJRCA9IGZhbHNlOyBcclxuICAgIG5ld3BsYXllci5zZXRUdXJuVHJhY2tlciA9IChpdGVtLCB0dXJuSUQpID0+IHtcclxuICAgICAgICBuZXdwbGF5ZXIudHVyblRyYWNrZXIgPSBpdGVtOyBcclxuICAgICAgICBuZXdwbGF5ZXIudHVybkJvb2xJRCA9IHR1cm5JRDsgXHJcbiAgICB9XHJcbiAgICBuZXdwbGF5ZXIuc2V0Qm9hcmRDb2x1bW5zID0gKGNvbHVtbnMpID0+IHtcclxuICAgICAgICBuZXdwbGF5ZXIuYm9hcmRDb2x1bW5zID0gY29sdW1uczsgXHJcbiAgICB9XHJcbiAgICBuZXdwbGF5ZXIuZ2V0Qm9hcmRDb2x1bW5zID0gKCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBuZXdwbGF5ZXIuYm9hcmRDb2x1bW5zOyBcclxuICAgIH1cclxuICAgIG5ld3BsYXllci5yZXNldCA9ICgpID0+IHtcclxuICAgICAgICB3aGlsZSAobmV3cGxheWVyLmJvYXJkQXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3cGxheWVyLmJvYXJkQXJyYXkucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld3BsYXllci5ib2FyZEFycmF5ID0gW107XHJcbiAgICAgICAgbmV3cGxheWVyLmJvYXJkTm9kZSA9IG51bGw7XHJcbiAgICAgICAgd2hpbGUgKG5ld3BsYXllci5zaGlwQXJyYXkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3cGxheWVyLnNoaXBBcnJheS5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3cGxheWVyLnNoaXBBcnJheSA9IFtdO1xyXG4gICAgICAgIG5ld3BsYXllci5uYW1lID0gbmFtZTtcclxuICAgICAgICB3aGlsZSAobmV3cGxheWVyLm1lc3NhZ2VzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ld3BsYXllci5tZXNzYWdlcy5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3cGxheWVyLm1lc3NhZ2VzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGxheWVyQXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcik7XHJcbiAgICBwbGF5ZXJBcmVhLmFwcGVuZENoaWxkKGdlbmVyYXRlR3JpZCgxMCwgbmV3cGxheWVyKSk7XHJcbiAgICBwbGFjZUFsbFNoaXBzKG5ld3BsYXllciwgMTApXHJcblxyXG5cclxuXHJcbiAgICByZXR1cm4gbmV3cGxheWVyOyBcclxufVxyXG4iLCJleHBvcnQgY29uc3QgZ2VuUmFuZG9tID0gbnVtID0+IHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW0pICsgMTsgXHJcbn1cclxuXHJcblxyXG4iLCIvL0RlbGV0ZSBEb20gYWxsIHJlbGV2YW50ZSBkb20gZWxlbWVudHNcclxuLy9SZXNldCBwbGF5ZXIncyBhcnJheXMgXHJcblxyXG4vL25lZWQgdG8gZGVsZXRlIGdyaWQgaW5mb3JtYXRpb24gXHJcblxyXG5leHBvcnQgY29uc3QgZGVsQm9hcmQgPSAoY29udGFpbmVyTm9kZSkgPT4ge1xyXG4gICAgY29uc3QgZ3JpZE5vZGUgPSBjb250YWluZXJOb2RlLmNoaWxkTm9kZXNbMF07IFxyXG4gICAgY29uc3Qgcm93Tm9kZUFycmF5ID0gZ3JpZE5vZGUuY2hpbGROb2RlczsgXHJcbiAgICByb3dOb2RlQXJyYXkuZm9yRWFjaChyb3cgPT4ge1xyXG4gICAgICAgIHdoaWxlIChyb3cuY2hpbGROb2Rlcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgcm93LnJlbW92ZUNoaWxkKHJvdy5sYXN0RWxlbWVudENoaWxkKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHdoaWxlIChncmlkTm9kZS5jaGlsZE5vZGVzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGdyaWROb2RlLnJlbW92ZUNoaWxkKGdyaWROb2RlLmxhc3RFbGVtZW50Q2hpbGQpOyBcclxuICAgIH1cclxuICAgIGNvbnRhaW5lck5vZGUucmVtb3ZlQ2hpbGQoZ3JpZE5vZGUpOyBcclxufVxyXG5cclxuIiwiLy9HcmlkIHNob3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiBlYWNoIGJvYXRcclxuLy9PcHRpb246IEtlZXAgdHJhY2sgb2YgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBzaGlwJ3MgZnJvbnQgYXJlYSB0aGVuIGRldGVybWluZSB3aGV0aGVyIHRoZSBzaGlwIGlzIHBsYWNlZCB2ZXJ0aWNhbGx5IG9yIGhvcml6b250YWxseVxyXG4vL09wdGlvbiAyOiBLZWVwIHRyYWNrIG9mIHRoZSBjb29yZGluYXRlcyBvZiBhbGwgdGhlIHNoaXBzIHVuaXRzXHJcblxyXG4vKlxyXG5leHBvcnQgY29uc3Qgc2hpcCA9IHtcclxuICAgIGxlbmd0aDogMCxcclxuICAgIGlzU3VuazogZmFsc2UsIFxyXG4gICAgcG9zQXJyYXk6IFtdLCBcclxuICAgIHR5cGU6ICcnLCBcclxuICAgIHNldFBvcyh4X2Nvb3IsIHlfY29vcikge1xyXG4gICAgICAgIHRoaXMucG9zQXJyYXkucHVzaCh7eDogeF9jb29yLCB5OiB5X2Nvb3J9KVxyXG4gICAgfSwgXHJcbn1cclxuKi9cclxuLy9UaGlzIG1ldGhvZCBkb2Vzbid0IHdvcmsgYmVjYXVzZSBmb3Igc29tZSByZWFzb24sIGVhY2ggc2hpcCB3YXMgcmVjb3JkaW5nIGV2ZXJ5IHNoaXBzIHBvc2l0aW9ucy4gXHJcbi8vQSByZXZpc2VkIHZlcnNpb24gaXMgd3JpdHRlbiBiZWxvdy5cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVTaGlwID0gKGxlbmd0aCwgdHlwZSkgPT4ge1xyXG4gICAgY29uc3QgbmV3U2hpcCA9IG5ldyBPYmplY3QoKTsgXHJcbiAgICBuZXdTaGlwLmxlbmd0aCA9IGxlbmd0aDsgXHJcbiAgICBuZXdTaGlwLnR5cGUgPSB0eXBlOyBcclxuICAgIG5ld1NoaXAuaXNTdW5rID0gZmFsc2U7XHJcbiAgICBuZXdTaGlwLmhhc0JlZW5IaXQgPSBmYWxzZTsgXHJcbiAgICBuZXdTaGlwLnBvc0FycmF5ID0gW107XHJcbiAgICBuZXdTaGlwLnNldFBvcyA9ICh4X2Nvb3IsIHlfY29vcikgPT57XHJcbiAgICAgICAgbmV3U2hpcC5wb3NBcnJheS5wdXNoKHsgeDogeF9jb29yLCB5OiB5X2Nvb3IsIGlzSGl0OiBmYWxzZSB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1NoaXA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBpc1NoaXBTdW5rID0gKHBsYXllciwgc2hpcCkgPT4ge1xyXG4gICAgdmFyIGlzU3VuayA9IHRydWU7XHJcbiAgICBzaGlwLnBvc0FycmF5LmZvckVhY2gocG9zID0+IHtcclxuICAgICAgICAvL2lmIGF0IGxlYXN0IG9uZSBwYXJ0IG9mIHRoZSBzaGlwIGlzIG5vdCBoaXQsIGlzU3VuayBpcyBmYWxzZTsgXHJcbiAgICAgICAgaWYgKCFwb3MuaXNIaXQpIHtcclxuICAgICAgICAgICAgaXNTdW5rID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGlmIChpc1N1bmspIHtcclxuICAgICAgICBjb25zdCBhbm5vdW5jZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYW5ub3VuY2VtZW50Jyk7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IHBsYXllci5uYW1lICsgXCIncyBcIiArIHNoaXAudHlwZSArIFwiIGhhcyBiZWVuIHN1bmshXCI7IFxyXG4gICAgICAgIGFubm91bmNlbWVudC5pbm5lckhUTUwgPSBtZXNzYWdlOyBcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiBpc1N1bms7XHJcbn0iLCJpbXBvcnQgeyBydW5BSSB9IGZyb20gJy4vY29tcHV0ZXJBSS5qcyc7IFxyXG5cclxuZXhwb3J0IGNvbnN0IHRyYWNrVHVybnMgPSAocGxheWVyT25lLCBwbGF5ZXJUd28pID0+IHtcclxuICAgIGNvbnN0IGtlZXBUcmFjayA9IG5ldyBPYmplY3QoKTtcclxuICAgIGtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuID0gdHJ1ZTtcclxuICAgIGtlZXBUcmFjay50b2dnbGVUdXJuID0gKCkgPT4ge1xyXG4gICAgICAgIGtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuID0gIWtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuO1xyXG4gICAgICAgIGtlZXBUcmFjay5kaXNwbGF5VHVybigpO1xyXG4gICAgICAgIGlmIChwbGF5ZXJUd28uaXNDb21wdXRlciAmJiAha2VlcFRyYWNrLnBsYXllck9uZVR1cm4pIHtcclxuICAgICAgICAgICAgcnVuQUkocGxheWVyVHdvKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIChrZWVwVHJhY2suZGlzcGxheVR1cm4gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGtlZXBUcmFjay5wbGF5ZXJPbmVUdXJuKSB7XHJcbiAgICAgICAgICAgIHR1cm5NZXNzYWdlLmlubmVySFRNTCA9IFwiUGxheWVyIE9uZSdzIFR1cm5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHR1cm5NZXNzYWdlLmlubmVySFRNTCA9IFwiUGxheWVyIFR3bydzIFR1cm5cIjtcclxuICAgICAgICB9XHJcbiAgICB9KSgpXHJcbiAgICBrZWVwVHJhY2suZ2V0VHVyblN0YXR1cyA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4ga2VlcFRyYWNrLnBsYXllck9uZVR1cm47XHJcbiAgICB9XHJcbiAgICBwbGF5ZXJPbmUuc2V0VHVyblRyYWNrZXIoa2VlcFRyYWNrLCB0cnVlKTtcclxuICAgIHBsYXllclR3by5zZXRUdXJuVHJhY2tlcihrZWVwVHJhY2ssIGZhbHNlKTtcclxuICAgIHJldHVybiBrZWVwVHJhY2s7XHJcbn1cclxuIiwiXHJcbmV4cG9ydCBjb25zdCBjaGVja1NoaXBzID0gKHBsYXllcikgPT4ge1xyXG4gICAgdmFyIGFsbFN1bmsgPSB0cnVlOyBcclxuICAgIHBsYXllci5zaGlwQXJyYXkuZm9yRWFjaChzaGlwID0+IHtcclxuICAgICAgICBpZiAoIXNoaXAuaXNTdW5rKSB7XHJcbiAgICAgICAgICAgIGFsbFN1bmsgPSBmYWxzZTsgXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGlmIChhbGxTdW5rKSB7XHJcbiAgICAgICAgYW5ub3VuY2VXaW5uZXIocGxheWVyKVxyXG4gICAgfSBcclxufVxyXG5cclxuY29uc3QgYW5ub3VuY2VXaW5uZXIgPSAocGxheWVyKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhwbGF5ZXIpXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5kR2FtZU1lc3NhZ2UnKS5pbm5lckhUTUwgPSAnVGhlIHdpbm5lciBpcyAnICsgcGxheWVyLm9wcG9uZW50TmFtZSArIFwiIVwiOyBcclxuICAgIHBsYXllci5nYW1lT2JqZWN0LmVuZEdhbWUoKTsgXHJcbn0iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIiNjb250YWluZXIge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbmFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuI3RpdGxlQ29udGFpbmVyIHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNtZXNzYWdlQ29udGFpbmVyIHtcXHJcXG53aWR0aDogMTAwJTsgXFxyXFxuYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbnRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNhbm5vdW5jZW1lbnRzQ29udGFpbmVyIHtcXHJcXG4gICAgbWluLWhlaWdodDogMjBweDsgXFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jYW5ub3VuY2VtZW50IHtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI2VuZEdhbWVNZXNzYWdlQXJlYSB7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDIwcHg7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4jdHVybk1lc3NhZ2UsICNlbmRHYW1lTWVzc2FnZSB7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuI2lubmVyQ29udGFpbmVyIHtcXHJcXG53aWR0aDogOTAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbm1hcmdpbjogYXV0bzsgXFxyXFxuanVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xcclxcbmRpc3BsYXk6IGZsZXg7IFxcclxcbn1cXHJcXG5cXHJcXG4jcDFab25lLCAjcDJab25lIHtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSB7XFxyXFxufVxcclxcblxcclxcbiNwMlpvbmUge1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMUFyZWEsICNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIxQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNwbGF5ZXIyQXJlYSB7XFxyXFxufVxcclxcblxcclxcbiNidXR0b25Db250YWluZXIge1xcclxcbiAgICBtYXJnaW4tdG9wOiAyMHB4O1xcclxcbnRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxuYWxpZ24tY29udGVudDogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI3N0YXJ0T3ZlckJ1dHRvbiB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiBWZXJkYW5hOyBcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2NjY2NjYztcXHJcXG4gICAgcGFkZGluZzogMTBweDsgXFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDVweDtcXHJcXG59XFxyXFxuXFxyXFxuZGl2LmVtcHR5U3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQwcHg7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uZW1wdHlTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDlkOWQ5O1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0RW1wdHlTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNDJweDtcXHJcXG4gICAgaGVpZ2h0OiA0MnB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNjc5NWZmO1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcblxcclxcbn1cXHJcXG5cXHJcXG4uaGl0RW1wdHlTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjN2ZmZmQ0O1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0T2NjdXBpZWRTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNDBweDtcXHJcXG4gICAgaGVpZ2h0OiA0MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7XFxyXFxufVxcclxcblxcclxcbi5oaXRPY2N1cGllZFNxdWFyZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmZjAwMDA7XFxyXFxufVxcclxcblxcclxcbi5vY2N1cGllZFNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzUwYWEwMDsgXFxyXFxufVxcclxcblxcclxcbi5vY2N1cGllZFNxdWFyZTpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1MGFhMDA7XFxyXFxufVxcclxcblxcclxcbi5yb3cge1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbn1cXHJcXG5cXHJcXG4uZ3JpZCB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmhlaWdodDogMTAwJTsgXFxyXFxubWFyZ2luLWxlZnQ6IGF1dG87XFxyXFxubWFyZ2luLXJpZ2h0OiBhdXRvO1xcclxcbn1cXHJcXG5cXHJcXG4uZG90IHtcXHJcXG53aWR0aDogNXB4O1xcclxcbmhlaWdodDogNXB4O1xcclxcbmJvcmRlci1yYWRpdXM6IDVweDsgXFxyXFxuYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDsgXFxyXFxubWFyZ2luOiBhdXRvO1xcclxcbnRvcDogNTAlO1xcclxcbmxlZnQ6IDUwJTtcXHJcXG5tYXJnaW4tdG9wOiA1MCU7XFxyXFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9teXN0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtBQUNBLFdBQVc7QUFDWCxZQUFZO0FBQ1oscUJBQXFCO0FBQ3JCO0FBQ0E7SUFDSSxXQUFXO0lBQ1gsa0JBQWtCO0FBQ3RCOztBQUVBO0FBQ0EsV0FBVztBQUNYLHFCQUFxQjtBQUNyQixrQkFBa0I7QUFDbEI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsV0FBVztJQUNYLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsV0FBVztBQUNmOztBQUVBO0lBQ0ksa0JBQWtCO0FBQ3RCOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFlBQVk7QUFDWixZQUFZO0FBQ1osOEJBQThCO0FBQzlCLGFBQWE7QUFDYjs7QUFFQTtJQUNJLGNBQWM7SUFDZCxrQkFBa0I7QUFDdEI7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQixrQkFBa0I7QUFDbEIscUJBQXFCO0FBQ3JCOztBQUVBO0lBQ0ksb0JBQW9CO0lBQ3BCLHlCQUF5QjtJQUN6QixhQUFhO0lBQ2Isa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6QixxQkFBcUI7QUFDekI7O0FBRUE7SUFDSSx5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsWUFBWTtJQUNaLGNBQWM7SUFDZCxTQUFTO0lBQ1QseUJBQXlCO0lBQ3pCLHVCQUF1QjtJQUN2QixxQkFBcUI7O0FBRXpCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6QixxQkFBcUI7SUFDckIseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6QixxQkFBcUI7SUFDckIseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCOztBQUVBO0lBQ0ksV0FBVztJQUNYLFlBQVk7SUFDWixhQUFhO0FBQ2pCOztBQUVBO0FBQ0EsV0FBVztBQUNYLFlBQVk7QUFDWixpQkFBaUI7QUFDakIsa0JBQWtCO0FBQ2xCOztBQUVBO0FBQ0EsVUFBVTtBQUNWLFdBQVc7QUFDWCxrQkFBa0I7QUFDbEIseUJBQXlCO0FBQ3pCLFlBQVk7QUFDWixRQUFRO0FBQ1IsU0FBUztBQUNULGVBQWU7QUFDZlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIjY29udGFpbmVyIHtcXHJcXG53aWR0aDogMTAwJTsgXFxyXFxuaGVpZ2h0OiAxMDAlOyBcXHJcXG5hbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxufVxcclxcbiN0aXRsZUNvbnRhaW5lciB7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jbWVzc2FnZUNvbnRhaW5lciB7XFxyXFxud2lkdGg6IDEwMCU7IFxcclxcbmFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG50ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbn1cXHJcXG5cXHJcXG4jYW5ub3VuY2VtZW50c0NvbnRhaW5lciB7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDIwcHg7IFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyOyBcXHJcXG59XFxyXFxuXFxyXFxuI2Fubm91bmNlbWVudCB7XFxyXFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNlbmRHYW1lTWVzc2FnZUFyZWEge1xcclxcbiAgICBtaW4taGVpZ2h0OiAyMHB4O1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuI3R1cm5NZXNzYWdlLCAjZW5kR2FtZU1lc3NhZ2Uge1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbiNpbm5lckNvbnRhaW5lciB7XFxyXFxud2lkdGg6IDkwJTsgXFxyXFxuaGVpZ2h0OiAxMDAlOyBcXHJcXG5tYXJnaW46IGF1dG87IFxcclxcbmp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXHJcXG5kaXNwbGF5OiBmbGV4OyBcXHJcXG59XFxyXFxuXFxyXFxuI3AxWm9uZSwgI3AyWm9uZSB7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxufVxcclxcblxcclxcbiNwMVpvbmUge1xcclxcbn1cXHJcXG5cXHJcXG4jcDJab25lIHtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuI3BsYXllcjFBcmVhLCAjcGxheWVyMkFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMUFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jcGxheWVyMkFyZWEge1xcclxcbn1cXHJcXG5cXHJcXG4jYnV0dG9uQ29udGFpbmVyIHtcXHJcXG4gICAgbWFyZ2luLXRvcDogMjBweDtcXHJcXG50ZXh0LWFsaWduOiBjZW50ZXI7IFxcclxcbmFsaWduLWNvbnRlbnQ6IGNlbnRlcjsgXFxyXFxufVxcclxcblxcclxcbiNzdGFydE92ZXJCdXR0b24ge1xcclxcbiAgICBmb250LWZhbWlseTogVmVyZGFuYTsgXFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XFxyXFxuICAgIHBhZGRpbmc6IDEwcHg7IFxcclxcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XFxyXFxufVxcclxcblxcclxcbmRpdi5lbXB0eVNxdWFyZSB7XFxyXFxuICAgIHdpZHRoOiA0MHB4O1xcclxcbiAgICBoZWlnaHQ6IDQwcHg7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNiMGIwYjA7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q5ZDlkOTtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQycHg7XFxyXFxuICAgIGhlaWdodDogNDJweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzY3OTVmZjtcXHJcXG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG5cXHJcXG59XFxyXFxuXFxyXFxuLmhpdEVtcHR5U3F1YXJlOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzdmZmZkNDtcXHJcXG59XFxyXFxuXFxyXFxuLmhpdE9jY3VwaWVkU3F1YXJlIHtcXHJcXG4gICAgd2lkdGg6IDQwcHg7XFxyXFxuICAgIGhlaWdodDogNDBweDtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2IwYjBiMDtcXHJcXG4gICAgYWxpZ24tY29udGVudDogY2VudGVyO1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4uaGl0T2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmUge1xcclxcbiAgICB3aWR0aDogNDBweDtcXHJcXG4gICAgaGVpZ2h0OiA0MHB4O1xcclxcbiAgICBkaXNwbGF5OiBibG9jaztcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYjBiMGIwO1xcclxcbiAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtY29sb3I6ICM1MGFhMDA7IFxcclxcbn1cXHJcXG5cXHJcXG4ub2NjdXBpZWRTcXVhcmU6aG92ZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTBhYTAwO1xcclxcbn1cXHJcXG5cXHJcXG4ucm93IHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWQge1xcclxcbndpZHRoOiAxMDAlOyBcXHJcXG5oZWlnaHQ6IDEwMCU7IFxcclxcbm1hcmdpbi1sZWZ0OiBhdXRvO1xcclxcbm1hcmdpbi1yaWdodDogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLmRvdCB7XFxyXFxud2lkdGg6IDVweDtcXHJcXG5oZWlnaHQ6IDVweDtcXHJcXG5ib3JkZXItcmFkaXVzOiA1cHg7IFxcclxcbmJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7IFxcclxcbm1hcmdpbjogYXV0bztcXHJcXG50b3A6IDUwJTtcXHJcXG5sZWZ0OiA1MCU7XFxyXFxubWFyZ2luLXRvcDogNTAlO1xcclxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKlxyXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XHJcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xyXG5cclxuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XHJcblxyXG4gICAgICBpZiAoaXRlbVs0XSkge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW1bMl0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobmVlZExheWVyKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XHJcblxyXG4gICAgICBpZiAobmVlZExheWVyKSB7XHJcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGl0ZW1bMl0pIHtcclxuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaXRlbVs0XSkge1xyXG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb250ZW50O1xyXG4gICAgfSkuam9pbihcIlwiKTtcclxuICB9OyAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cclxuXHJcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcclxuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cclxuICAgIGlmIChkZWR1cGUpIHtcclxuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcclxuXHJcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcclxuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcclxuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xyXG5cclxuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtZWRpYSkge1xyXG4gICAgICAgIGlmICghaXRlbVsyXSkge1xyXG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzdXBwb3J0cykge1xyXG4gICAgICAgIGlmICghaXRlbVs0XSkge1xyXG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcclxuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxpc3QucHVzaChpdGVtKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gbGlzdDtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XHJcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xyXG5cclxuICBpZiAoIWNzc01hcHBpbmcpIHtcclxuICAgIHJldHVybiBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcclxuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcclxuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xyXG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcclxuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xyXG59OyIsImV4cG9ydCBkZWZhdWx0IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCIyYmFlOTIzYzg3MWNmM2U1NDIxNDMxM2QwOGRlM2RmZS5tcDNcIjsiLCJleHBvcnQgZGVmYXVsdCBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiYzc2NjEwMjQ1OTc5YmUxNTYzM2ZiZTA1MTlmODAyM2EubXAzXCI7IiwiZXhwb3J0IGRlZmF1bHQgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImI4N2Y1OTBkNmZmZTI0M2E5ZGU0MDZiZmFiYWY0YTE1Lm1wM1wiOyIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19IVE1MX0xPQURFUl9HRVRfU09VUkNFX0ZST01fSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvaHRtbC1sb2FkZXIvZGlzdC9ydW50aW1lL2dldFVybC5qc1wiO1xudmFyIF9fX0hUTUxfTE9BREVSX0lNUE9SVF8wX19fID0gbmV3IFVSTChcIi4vYXNzZXQvZXhwbG9zaW9uLnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xuLy8gTW9kdWxlXG52YXIgX19fSFRNTF9MT0FERVJfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0hUTUxfTE9BREVSX0dFVF9TT1VSQ0VfRlJPTV9JTVBPUlRfX18oX19fSFRNTF9MT0FERVJfSU1QT1JUXzBfX18pO1xudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcclxcbjxodG1sPlxcclxcbjxoZWFkPlxcclxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCIgLz5cXHJcXG4gICAgPHRpdGxlPkJhdHRsZXNoaXA8L3RpdGxlPlxcclxcbiAgICA8bGluayByZWw9XFxcImljb25cXFwiIHR5cGU9XFxcImltYWdlL3BuZ1xcXCIgaHJlZj1cXFwiXCIgKyBfX19IVE1MX0xPQURFUl9SRVBMQUNFTUVOVF8wX19fICsgXCJcXFwiPlxcclxcbjwvaGVhZD5cXHJcXG48Ym9keT5cXHJcXG4gICAgPGRpdiBpZD1cXFwiY29udGFpbmVyXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcInRpdGxlQ29udGFpbmVyXFxcIj48aDE+QmF0dGxlc2hpcDwvaDE+PC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJtZXNzYWdlQ29udGFpbmVyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGlkPVxcXCJ0dXJuTWVzc2FnZUFyZWFcXFwiPjxoMiBpZD1cXFwidHVybk1lc3NhZ2VcXFwiPjwvaDI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwiYW5ub3VuY2VtZW50c0NvbnRhaW5lclxcXCI+PGgzIGlkPVxcXCJhbm5vdW5jZW1lbnRcXFwiPjwvaDM+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwiZW5kR2FtZU1lc3NhZ2VBcmVhXFxcIj48aDMgaWQ9XFxcImVuZEdhbWVNZXNzYWdlXFxcIj48L2gzPjwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJpbm5lckNvbnRhaW5lclxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwicDFab25lXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGgyPlBsYXllciBPbmU8L2gyPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVxcXCJwbGF5ZXJBcmVhT25lXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGlkPVxcXCJwMlpvbmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8aDI+UGxheWVyIFR3bzwvaDI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XFxcInBsYXllckFyZWFUd29cXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGlkPVxcXCJpbmZvQ29udGFpbmVyXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcImJ1dHRvbkNvbnRhaW5lclxcXCI+PGJ1dHRvbiBpZD1cXFwic3RhcnRPdmVyQnV0dG9uXFxcIj5TdGFydCBPdmVyPC9idXR0b24+PC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvYm9keT5cXHJcXG48L2h0bWw+XCI7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XHJcbiAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIG9wdGlvbnMgPSB7fTtcclxuICB9XHJcblxyXG4gIGlmICghdXJsKSB7XHJcbiAgICByZXR1cm4gdXJsO1xyXG4gIH0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVyc2NvcmUtZGFuZ2xlLCBuby1wYXJhbS1yZWFzc2lnblxyXG5cclxuXHJcbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xyXG5cclxuICBpZiAob3B0aW9ucy5oYXNoKSB7XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XHJcbiAgfVxyXG5cclxuICBpZiAob3B0aW9ucy5tYXliZU5lZWRRdW90ZXMgJiYgL1tcXHRcXG5cXGZcXHIgXCInPTw+YF0vLnRlc3QodXJsKSkge1xyXG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwsIFwiXFxcIlwiKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB1cmw7XHJcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL215c3R5bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9teXN0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHN0eWxlc0luRE9NID0gW107XHJcblxyXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XHJcbiAgdmFyIHJlc3VsdCA9IC0xO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xyXG4gICAgICByZXN1bHQgPSBpO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XHJcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcclxuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XHJcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcclxuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XHJcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcclxuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xyXG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICB2YXIgb2JqID0ge1xyXG4gICAgICBjc3M6IGl0ZW1bMV0sXHJcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxyXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXHJcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxyXG4gICAgICBsYXllcjogaXRlbVs1XVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XHJcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XHJcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xyXG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xyXG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xyXG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXHJcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcclxuICAgICAgICByZWZlcmVuY2VzOiAxXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gaWRlbnRpZmllcnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcclxuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XHJcbiAgYXBpLnVwZGF0ZShvYmopO1xyXG5cclxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XHJcbiAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFwaS5yZW1vdmUoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gdXBkYXRlcjtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xyXG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcclxuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XHJcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcclxuXHJcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xyXG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xyXG5cclxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcclxuXHJcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcclxuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcclxuXHJcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XHJcbiAgfTtcclxufTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBtZW1vID0ge307XHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xyXG5cclxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xyXG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXHJcblxyXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXHJcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcclxuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcclxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcclxuICB9XHJcblxyXG4gIHJldHVybiBtZW1vW3RhcmdldF07XHJcbn1cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcblxyXG5cclxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XHJcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xyXG5cclxuICBpZiAoIXRhcmdldCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcclxuICB9XHJcblxyXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xyXG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xyXG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xyXG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XHJcbiAgcmV0dXJuIGVsZW1lbnQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcclxuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XHJcblxyXG4gIGlmIChub25jZSkge1xyXG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXHJcbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XHJcbiAgdmFyIGNzcyA9IFwiXCI7XHJcblxyXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcclxuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XHJcbiAgfVxyXG5cclxuICBpZiAob2JqLm1lZGlhKSB7XHJcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcclxuICB9XHJcblxyXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xyXG5cclxuICBpZiAobmVlZExheWVyKSB7XHJcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XHJcbiAgfVxyXG5cclxuICBjc3MgKz0gb2JqLmNzcztcclxuXHJcbiAgaWYgKG5lZWRMYXllcikge1xyXG4gICAgY3NzICs9IFwifVwiO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9iai5tZWRpYSkge1xyXG4gICAgY3NzICs9IFwifVwiO1xyXG4gIH1cclxuXHJcbiAgaWYgKG9iai5zdXBwb3J0cykge1xyXG4gICAgY3NzICs9IFwifVwiO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XHJcblxyXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xyXG4gIH0gLy8gRm9yIG9sZCBJRVxyXG5cclxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXHJcblxyXG5cclxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXHJcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG59XHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xyXG5cclxuXHJcbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XHJcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xyXG4gIHJldHVybiB7XHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcclxuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xyXG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xyXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xyXG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XHJcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiXSwibmFtZXMiOlsiZ2VuUmFuZG9tIiwiZ2VuZXJhdGVDb29yZGluYXRlcyIsImhpdEVtcHR5IiwiaGl0T2NjdXBpZWQiLCJpc1VuZGVmaW5lZCIsInBsYXlDYW5ub25BdWRpbyIsIm1lbW9yeSIsIm5leHRUYXJnZXQiLCJuZXh0U2Vjb25kYXJ5VGFyZ2V0IiwiaGl0VGFyZ2V0IiwicHJldmlvdXNUYXJnZXQiLCJjdXJyZW50VGFyZ2V0IiwiaWRlbnRpZmllZE9yaWVudGF0aW9uIiwiaXNIb3JpeiIsImNvbnNlY3V0aXZlSGl0IiwiaGl0Q291bnRzIiwib3Bwb25lbnQiLCJzaGlwTG9jYXRlZCIsImNvbmZpcm1lZEhpdHMiLCJlbmVteVNoaXBzIiwiZ2V0T3Bwb25lbnQiLCJnZXRPcHBvbmVudFNoaXBzIiwic2hpcEFycmF5IiwiZm9yRWFjaCIsInNoaXAiLCJwdXNoIiwicmVzZXRIaXRDb3VudHMiLCJpbmNyZW1lbnRIaXRDb3VudCIsInVwZGF0ZUhpdENvdW50IiwiZ2V0TGVmdE92ZXJIaXRDb3VudHMiLCJjb25zb2xlIiwibG9nIiwicnVuQUkiLCJwbGF5ZXIiLCJ0dXJuVHJhY2tlciIsImdldFR1cm5TdGF0dXMiLCJzZXRUaW1lb3V0IiwiaGl0T3Bwb25lbnRBcmVhIiwiYXR0YWNrQXJlYSIsImNvb3JkaW5hdGVzIiwiZGVjaWRlVGFyZ2V0IiwiaSIsImJvYXJkQXJyYXkiLCJsZW5ndGgiLCJ4IiwieSIsImhpdCIsInNxdWFyZSIsImdldFNxdWFyZSIsIm5hbWUiLCJvY2N1cGllZCIsInVuZGVmaW5lZCIsImhvcml6T3JWZXJ0IiwiY2hvb3NlVmFsaWRQb3RlbnRpYWxUYXJnZXQiLCJ0b2dnbGVUdXJuIiwiY2xlYXJJdGVtIiwic3F1YXJlSUQiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwibmV4dEFyZWEiLCJ4X2Nvb3IiLCJ5X2Nvb3IiLCJoYXNBbHJlYWR5QmVlbkF0dGFja2VkIiwidGFyZ2V0IiwiYWRkU2Vjb25kYXJ5UG90ZW50aWFsVGFyZ2V0cyIsIm5vdER1cGxpY2F0ZSIsIm5leHR5VGFyZ2V0IiwiY2xlYXJOZXh0VGFyZ2V0IiwiZGlzY2FyZCIsInBvcCIsImNsZWFyTmV4dFNlY29uZGFyeVRhcmdldCIsInRyYW5zZmVyVG9TZWNvbmRhcnkiLCJpdGVtIiwiaW5kZXgiLCJvYmplY3QiLCJzcGxpY2UiLCJmaW5kVGhlRW5kIiwiY2xlYXJTZWNvbmRhcnlJdGVtIiwiaXNBcmVhU2VjdXJlIiwic3Vua1NoaXAiLCJmaW5kTmVpZ2hib3JPZkVuZCIsImF0dGFja1RoZU90aGVyRW5kIiwibmV3WCIsIm5ld1kiLCJmb3VuZENvbnNlY3V0aXZlIiwiZGlyZWN0aW9uWCIsImRpcmVjdGlvblkiLCJNYXRoIiwiZmxvb3IiLCJkb250RW5kTG9vcCIsImZvdW5kQ29ucyIsImNvdW50IiwiY29uc2VjdXRpdmVYIiwiY29uc2VjdXRpdmVZIiwiaWRlbnRpZnlPcmllbnRhdGlvbiIsImNob29zZVRhcmdldEJhc2VkT25PcmllbnRhdGlvbiIsImoiLCJwb3NBcnJheSIsImhpdENvdW50IiwiayIsImlzSG9yaXpvbnRhbCIsImlzQ2xpbWJpbmciLCJtb3ZlWCIsIm1vdmVZIiwidHJhbnNYIiwidHJhbnNZIiwidG90YWxIaXQiLCJoYXNCZWVuSGl0IiwiaXNTdW5rIiwiaXNIaXQiLCJjcmVhdGVQbGF5ZXIiLCJnZW5lcmF0ZUdyaWQiLCJwbGFjZUFsbFNoaXBzIiwic2V0U2VsZiIsInNldE9wcG9uZW50IiwidHJhY2tUdXJucyIsInBsYXllck9uZVR1cm4iLCJ0dXJuTWVzc2FnZSIsInN0YXJ0R2FtZSIsIm5ld0dhbWUiLCJPYmplY3QiLCJvdmVyIiwiZW5kR2FtZSIsInBsYXllck9uZSIsInBsYXllclR3byIsInNldEdhbWVPYmplY3QiLCJpc0NvbXB1dGVyIiwiaXNQbGF5aW5nQWdhaW5zdEFJIiwiaW5uZXJIVE1MIiwiaXNTaGlwU3VuayIsImNoZWNrU2hpcHMiLCJzcXVhcmVVbml0IiwidW5pdCIsImNyZWF0ZUVsZW1lbnQiLCJpc0VtcHR5IiwiY29sdW1ucyIsIm5ld2dyaWQiLCJzZXRCb2FyZENvbHVtbnMiLCJzZXRBdHRyaWJ1dGUiLCJnZW5lcmF0ZVJvdyIsInRhcmdldEdyaWQiLCJjb2x1bW4iLCJyb3ciLCJjb29yZGluYXRlIiwiYXJlYSIsImFwcGVuZENoaWxkIiwiZ2VuZXJhdGVTcXVhcmUiLCJ0b1N0cmluZyIsIklEIiwiYWRkRXZlbnRMaXN0ZW5lciIsInR1cm5TdGF0dXMiLCJ0dXJuQm9vbElEIiwiZ2FtZU9iamVjdCIsImNsYXNzTGlzdCIsInRvZ2dsZSIsImNoaWxkTm9kZXMiLCJkb3QiLCJyZW1vdmUiLCJhZGQiLCJ0YXJnZXRlZF9zaGlwIiwicG9zIiwiXyIsImRlbEJvYXJkIiwicmVxdWlyZSIsInBsYXllcnMiLCJzdGFydE92ZXJCdXR0b24iLCJwbGF5ZXJPbmVBcmVhIiwicGxheWVyVHdvQXJlYSIsInJlc2V0IiwiY3JlYXRlU2hpcCIsImdyaWRMZW5ndGgiLCJwbGFjZVNoaXAiLCJzaGlwVHlwZSIsInBvc2l0aW9uZWQiLCJvcmllbnRhdGlvbiIsImhvcml6VGhlblZlcnQiLCJ2ZXJ0VGhlbkhvcml6IiwidmFsaWRQbGFjZW1lbnQiLCJpc0l0T2NjdXBwaWVkIiwicGxhY2VTaGlwUGFydCIsImRvbV9jb29yZGluYXRlcyIsInNldFBvcyIsImhvcml6b250YWwiLCJpc09jY3VwaWVkIiwiQ2Fubm9uMSIsIkNhbm5vbjIiLCJDYW5ub24zIiwicGxheUNhbm5vbjEiLCJDYW5ub25PbmUiLCJBdWRpbyIsInBsYXkiLCJwbGF5Q2Fubm9uMiIsIkNhbm5vblR3byIsInBsYXlDYW5ub24zIiwiQ2Fubm9uVGhyZWUiLCJhdWRpb0FycmF5IiwiY2hvb3NlIiwiY29udGFpbmVyIiwiaXNBSSIsIm5ld3BsYXllciIsImJvYXJkQ29sdW1ucyIsImJvYXJkTm9kZSIsImdhbWUiLCJvcHBvbmVudE5hbWUiLCJtZXNzYWdlcyIsInNldFR1cm5UcmFja2VyIiwidHVybklEIiwiZ2V0Qm9hcmRDb2x1bW5zIiwicGxheWVyQXJlYSIsIm51bSIsInJhbmRvbSIsImNvbnRhaW5lck5vZGUiLCJncmlkTm9kZSIsInJvd05vZGVBcnJheSIsInJlbW92ZUNoaWxkIiwibGFzdEVsZW1lbnRDaGlsZCIsInR5cGUiLCJuZXdTaGlwIiwiYW5ub3VuY2VtZW50IiwibWVzc2FnZSIsImtlZXBUcmFjayIsImRpc3BsYXlUdXJuIiwiYWxsU3VuayIsImFubm91bmNlV2lubmVyIl0sInNvdXJjZVJvb3QiOiIifQ==