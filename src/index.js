import _ from 'lodash';
import './ship.js'; 
import { generateGrid } from './grid.js'; 
import './mystyle.css';

//for watching the html file 
require('./home.html')

const sampleGrid = document.getElementById('sample'); 
sampleGrid.appendChild(generateGrid(10));



