
export const checkShips = (player) => {
    var allSunk = true; 
    player.shipArray.forEach(ship => {
        if (!ship.isSunk) {
            allSunk = false; 
        }
    })
    if (allSunk) {
        announceWinner(player)
    } 
}

const announceWinner = (player) => {
    console.log(player)
    document.getElementById('endGameMessage').innerHTML = 'The winner is ' + player.opponentName + "!"; 
    player.gameObject.endGame(); 
}