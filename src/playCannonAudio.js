import Cannon1 from './audio/cannon-shot-1.mp3';
import Cannon2 from './audio/cannon-shot-2.mp3';
import Cannon3 from './audio/cannon-shot-3.mp3';
import { genRandom } from './randGen.js';






function playCannon1() {
    const CannonOne = new Audio(Cannon1);
    CannonOne.play(); 
}

function playCannon2() {
    const CannonTwo = new Audio(Cannon2);
    CannonTwo.play();
}

function playCannon3() {
    const CannonThree = new Audio(Cannon3);
    CannonThree.play();
}

const audioArray = [playCannon1, playCannon2, playCannon3]

export const playCannonAudio = () => {
    var choose = genRandom(3) - 1;
    audioArray[choose]();
}