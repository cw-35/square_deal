var turn = 1;

var gridA = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
];

var gridB = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
];

var scoreA = 0;
var scoreB = 0;

var tilesA = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8];
var tilesB = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8];

var currentTile;

function goTo(path) {

    window.location.href = path;

}

function endTurn() {

    const tiles = document.querySelectorAll(".tile");
    const rack = document.querySelector(".rack");

    tiles.forEach(tile => {
        const row = tile.dataset.row;
        const col = tile.dataset.col;
        const grid = tile.dataset.grid;
        const value = tile.dataset.value;

        if (grid === "A"){
            const selector = `.cell[data-row='${row}'][data-col='${col}']`;
            const cell = document.querySelector(selector);
            gridA[row][col] = value;
            cell.textContent = value;
        } else if (grid === "B") {
            gridB[row][col] = value;
        }

        rack.appendChild(tile);
    });

    turn += 1;

}

function init() {

    const tiles = document.querySelectorAll(".tile");
    const cells = document.querySelectorAll(".cell");

    tiles.forEach(tile => {
        tile.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tile.dataset.value);
            currentTile = tile;
            console.log("hi")
        });
    });
    
    cells.forEach(cell => {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
    });
    
    cells.forEach(cell => {
        cell.addEventListener("drop", (e) => {

            e.preventDefault();
            const value = Number(e.dataTransfer.getData("text/plain"));
            const column = Number(cell.dataset.col);
            const row = Number(cell.dataset.row);
            const grid = cell.parentElement.dataset.grid;

            if (grid === "A") {
                if (gridA[row][column] === -1) {
                    currentTile.dataset.row = row;
                    currentTile.dataset.col = column;
                    currentTile.dataset.grid = grid;
                    cell.appendChild(currentTile);
                }
                
            } else {
                if (gridB[row][column] === -1) {
                    currentTile.dataset.row = row;
                    currentTile.dataset.col = column;
                    currentTile.dataset.grid = grid;
                    cell.appendChild(currentTile);
                }
            }

        });
    });
      

}

document.addEventListener("DOMContentLoaded", init);