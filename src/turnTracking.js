import { runAI } from './computerAI.js'; 

export const trackTurns = (playerOne, playerTwo) => {
    const keepTrack = new Object();
    keepTrack.playerOneTurn = true;
    keepTrack.toggleTurn = () => {
        keepTrack.playerOneTurn = !keepTrack.playerOneTurn;
        keepTrack.displayTurn();
        if (playerTwo.isComputer && !keepTrack.playerOneTurn) {
            setTimeout(() => { runAI(playerTwo) }, 2000); 
          //  runAI(playerTwo)
        }
    }
    (keepTrack.displayTurn = () => {
        if (keepTrack.playerOneTurn) {
            console.log("Player one's turn")
            turnMessage.innerHTML = "Player One's Turn";
        }
        else {
            console.log("Player two's turn")
            turnMessage.innerHTML = "Player Two's Turn";
        }
    })()
    keepTrack.getTurnStatus = () => {
        return keepTrack.playerOneTurn;
    }
    playerOne.setTurnTracker(keepTrack, true);
    playerTwo.setTurnTracker(keepTrack, false);
    return keepTrack;
}