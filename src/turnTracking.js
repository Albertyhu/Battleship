export const trackTurns = (playerOne, playerTwo) => {
    const keepTrack = new Object();
    keepTrack.playerOneTurn = true;
    keepTrack.toggleTurn = () => {
        keepTrack.playerOneTurn = !keepTrack.playerOneTurn;
        keepTrack.displayTurn();
    }
    (keepTrack.displayTurn = () => {
        if (keepTrack.playerOneTurn) {
            turnMessage.innerHTML = "Player One's Turn";
        }
        else {
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