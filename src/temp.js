const attackTheOtherEnd = () => {
    //if the attack pattern was horizontal
    var x_coor = memory.currentTarget.x;
    var y_coor = memory.currentTarget.y;
    if (memory.isHoriz) {
        //if the computer's target was moving right, change the direction of the attack to the left
        if (memory.currentTarget.x > memory.previousTarget.x) {
            x_coor = memory.currentTarget.x - (memory.hitCounts)
        }
        //vice versa 
        else if (memory.currentTarget.x < memory.previousTarget.x) {
            x_coor = memory.currentTarget.x + (memory.hitCounts)
        }
    }
    //if the attack pattern was vertical 
    else {
        //if the computer's target was moving upward, change the direction of the attack downward
        if (memory.currentTarget.y > memory.previousTarget.y) {
            y_coor = memory.currentTarget.y - (memory.hitCounts)
        }
        //vice versa 
        else if (memory.currentTarget.y < memory.previousTarget.y) {
            y_coor = memory.currentTarget.y + (memory.hitCounts)
        }
    }
    //empty nextTarget[]
    clearNextTarget();
    memory.previousTarget = { x: x_coor, y: y_coor }
    console.log("Attack the other end: " + x_coor + "," + y_coor)
    chooseValidPotentialTarget(x_coor, y_coor)
    resetHitCounts();
}