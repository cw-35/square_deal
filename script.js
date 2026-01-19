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

var tilesBag = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8];

var currentTile;

function goTo(path) {

    window.location.href = path;

}

function endTurn() {

    const tiles = document.querySelectorAll(".tile");
    const rack = document.querySelector(".rack");
    const endTurnBtn = document.querySelector("#endTurnBtn");

    var previousGrid = "N"
    let invalidMove = false;

    if (rack.querySelector(".tile") !== null) {alert("You must use both tiles!"); return;}

    for (const tile of tiles) {
        const grid = tile.dataset.grid;
        if (previousGrid === grid) {
            alert("You can't place both tiles in the same grid!");
            invalidMove = true;
            break;
        }
        previousGrid = grid;
    }

    if (invalidMove === false){
        
        for (const tile of tiles) {
            const row = tile.dataset.row;
            const col = tile.dataset.col;
            const grid = tile.dataset.grid;
            const value = tile.dataset.value;
    
            const selector = `.cell[data-row='${row}'][data-col='${col}']`;
            const cells = document.querySelectorAll(selector);
    
            cells.forEach(cell => {
                const cell_grid = cell.parentElement.dataset.grid;
                if (cell_grid == grid) {
                    if (grid === "A") {
                        gridA[row][col] = Number(value);
                        cell.textContent = value;
                    } else if (grid === "B") {
                        gridB[row][col] = Number(value);
                        cell.textContent = value;
                    }
                }
            });
    
            rack.appendChild(tile);
            endTurnBtn.hidden = true;
        }

        if (tilesBag.length <= 2) {
            roundReset();
        }
    
        turn += 1;
        chooseTiles();
    }

}

function chooseTiles() {

    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile=> {

        var num = -1;

        const randomIndex = Math.floor(Math.random() * tilesBag.length);
        num = tilesBag[randomIndex];
        tilesBag.splice(randomIndex, 1);

        tile.textContent = num;
        tile.dataset.value = num;

    });


}

function roundReset() {

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.textContent = ``;
    });

    alert("Round over!");

    calculateScores();

    tilesBag = [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8];
    
    gridA = [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1]
    ];

    gridB = [
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1],
        [-1, -1, -1, -1]
    ];

}

function calculateScores() {

    const scoreCounterA = document.querySelector("#scoreA");
    const scoreCounterB = document.querySelector("#scoreB");

    const squares = [0, 1, 4, 9, 16, 25]
    var sum;

    var rowMaxA = 0;
    var colMaxA = 0;
    var sumA;
    var rowSqrA = 0;
    var colSqrA = 0;

    var rowMaxB = 0;
    var colMaxB = 0;
    var sumB;
    var rowSqrB = 0;
    var colSqrB = 0;

    //check rows A
    gridA.forEach(function (list, index) {
        sum = listSum(list);
        if (squares.includes(sum) && sum > rowMaxA) {
            const squaredNumbers = list.map(num => num * num);
            rowMaxA = sum;
            rowSqrA = listSum(squaredNumbers);
        }
    })

    //check columns A
    for (let col = 0; col < gridA[0].length; col ++){
        sum = 0;
        gridA.forEach(row => {
            sum += row[col];
        })
        if (squares.includes(sum) && sum > colMaxA) {
            colSqrA = 0;
            gridA.forEach(row => {
                colSqrA += row[col] * row[col];
            })
            colMaxA = sum;
        }
    }

    sumA = rowSqrA + colSqrA;

    //check rows B
    gridB.forEach(function (list, index) {
        sum = listSum(list);
        if (squares.includes(sum) && sum > rowMaxB) {
            const squaredNumbers = list.map(num => num * num);
            rowMaxB = sum;
            rowSqrB = listSum(squaredNumbers);
        }
    })

    //check columns B
    for (let col = 0; col < gridB[0].length; col ++){
        sum = 0;
        gridB.forEach(row => {
            sum += row[col];
        })
        if (squares.includes(sum) && sum > colMaxB) {
            colSqrB = 0;
            gridB.forEach(row => {
                colSqrB += row[col] * row[col];
            })
            colMaxB = sum;
        }
    }

    sumB = rowSqrB + colSqrB;

    scoreA += sumA;
    scoreB += sumB;

    scoreCounterA.textContent = `Player A Score: ${scoreA}`;
    scoreCounterB.textContent = `Player B Score: ${scoreB}`;

    if (scoreA >= 900) {
        if (scoreB >= 900) {
            alert("TIE!!!");
        } else {
            alert("Player A wins!");
        }
    } else {
        if (scoreB >= 900) {
            alert("Player B wins!");
        }
    }
}

function listSum(numbers) {

    const sum = numbers.reduce(
        (accumulator, currentVal) => accumulator + currentVal, 0
    );

    return sum;

}

function init() {

    const tiles = document.querySelectorAll(".tile");
    const cells = document.querySelectorAll(".cell");
    const rack = document.querySelector(".rack");
    const endTurnBtn = document.querySelector("#endTurnBtn");

    tiles.forEach(tile => {
        tile.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tile.dataset.value);
            currentTile = tile;
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

            if (cell.querySelector(".tile") !== null) {return;}

            const column = Number(cell.dataset.col);
            const row = Number(cell.dataset.row);
            const grid = cell.parentElement.dataset.grid;

            if (grid === "A") {
                if (gridA[row][column] === -1) {
                    currentTile.dataset.row = row;
                    currentTile.dataset.col = column;
                    currentTile.dataset.grid = grid;
                    cell.appendChild(currentTile);
                    if (rack.querySelector(".tile") == null) {endTurnBtn.hidden = false;}
                }
                
            } else {
                if (gridB[row][column] === -1) {
                    currentTile.dataset.row = row;
                    currentTile.dataset.col = column;
                    currentTile.dataset.grid = grid;
                    cell.appendChild(currentTile);
                    if (rack.querySelector(".tile") == null) {endTurnBtn.hidden = false;}
                }
            }

        });
    });

    chooseTiles();

}

document.addEventListener("DOMContentLoaded", init);