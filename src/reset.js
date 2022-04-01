//Delete Dom all relevante dom elements
//Reset player's arrays 

//need to delete grid information 

export const delBoard = (containerNode) => {
    const gridNode = containerNode.childNodes[0]; 
    const rowNodeArray = gridNode.childNodes; 
    rowNodeArray.forEach(row => {
        while (row.childNodes.length !== 0) {
            row.removeChild(row.lastElementChild); 
        }
    })
    while (gridNode.childNodes.length !== 0) {
        gridNode.removeChild(gridNode.lastElementChild); 
    }
    containerNode.removeChild(gridNode); 
}

