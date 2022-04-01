import _ from 'lodash';
import './ship.js'; 
import { generateGrid } from './grid.js'; 
import './mystyle.css';
import { startGame } from './gameLoop.js';
import { delBoard } from './reset.js';
//import { generateCoordinates } from './placeShips.js';

//for watching the html file 
require('./home.html')

const players = startGame();
const startOverButton = document.getElementById('startOverButton');
const playerOneArea = document.getElementById('playerAreaOne');
const playerTwoArea = document.getElementById('playerAreaTwo');

startOverButton.addEventListener('click', () => {
    delBoard(playerOneArea);
    delBoard(playerTwoArea);
    players["playerOne"].reset(); 
    players["playerTwo"].reset(); 
    startGame(); 
});



