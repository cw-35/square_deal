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

    if (rack.querySelector(".tile") !== null) {inform("Wait!","You must use both tiles!"); playSound("/sounds/Error.mp3"); return;}

    for (const tile of tiles) {
        const grid = tile.dataset.grid;
        if (previousGrid === grid) {
            playSound("/sounds/Error.mp3");
            inform("Wait!", "You can't place both tiles in the same grid!");
            invalidMove = true;
            break;
        }
        previousGrid = grid;
    }

    if (invalidMove === false){
        currentTile = null;
        playSound("/sounds/EndTurn.mp3");
        
        for (const tile of tiles) {
            const row = tile.dataset.row;
            const col = tile.dataset.col;
            const grid = tile.dataset.grid;
            const value = tile.dataset.value;
    
            const selector = `.cell[data-row='${row}'][data-col='${col}']`;
            const cells = document.querySelectorAll(selector);

            tile.classList.remove("selected");

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

            turn += .5;
            tile.style.opacity = 1;
            rack.appendChild(tile);
            endTurnBtn.hidden = true;

        }

        if (tilesBag.length <= 2) {
            roundReset();
        }
        chooseTiles();

        let isBot = document.querySelector("html").classList.contains("bot");
        console.log(isBot);
        if (isBot === true) {
            botTurn();
        }
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

    let squareDealA = isSquareDeal(gridA);
    let squareDealB = isSquareDeal(gridB);

    if (squareDealA === true && squareDealB === true) {
        inform("Game Over!", "It's a tie!");
        return;
    } else {
        if (squareDealA === true) {
            inform("Game Over!", "Blue wins!");
            return;
        } else if (squareDealB == true){
            inform("Game Over!", "Red wins!");
            return;
        }
    }

    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.textContent = ``;
    });

    confettiEffect();
    playSound("/sounds/Cheer.mp3");
    

    let [sumA, sumB] = calculateScores();

    inform("Round Over!", `Player: +${sumA} points\nBot: +${sumB} points`)

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
    var sumA = 0;
    var rowSqrA = 0;
    var colSqrA = 0;

    var rowMaxB = 0;
    var colMaxB = 0;
    var sumB = 0;
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

    scoreCounterA.textContent = `Player Score: ${scoreA}`;
    scoreCounterB.textContent = `Bot Score: ${scoreB}`;

    if (scoreA >= 900) {
        if (scoreB >= 900) {
            inform("Game Over!", "It's a tie!");
        } else {
            inform("Game Over!", "Player wins!");
        }
    } else {
        if (scoreB >= 900) {
            inform("Game Over!", "Bot wins!");
        }
    }

    return [sumA, sumB];
}

function listSum(numbers) {

    const sum = numbers.reduce(
        (accumulator, currentVal) => accumulator + currentVal, 0
    );

    return sum;

}

function confettiEffect() {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
        confettiRadius: 7.5,
        confettiNumber: 500,
    });
}

function inform(title, content){

    const modal = document.getElementById("modal");
    const modalTitle = modal.querySelector("h2");
    const modalContent = modal.querySelector("p");

    modal.classList.add("open");
    modalTitle.textContent = title;
    modalContent.textContent = content;

}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("open");
}

function playSound(src) {
    let audio = new Audio(src);
    audio.play();
}

function botTurn() {
    let [ai, aj] = selectRandomCell(gridA);
    let [bi, bj] = selectRandomCell(gridB);
    const tiles = document.querySelectorAll(".tile");
    const tile1 = tiles[0];
    const tile2 = tiles[1];
    const playerGrid = document.querySelector(".grid[data-grid='A']");
    const botGrid = document.querySelector(".grid[data-grid='B']");
    const cellA = playerGrid.querySelector(`.cell[data-row='${ai}'][data-col='${aj}']`);
    const cellB = botGrid.querySelector(`.cell[data-row='${bi}'][data-col='${bj}']`);

    tile1.dataset.row = ai;
    tile1.dataset.col = aj;
    tile1.dataset.grid = "A";
    cellA.appendChild(tile1);

    tile2.dataset.row = bi;
    tile2.dataset.col = bj;
    tile2.dataset.grid = "B";
    cellB.appendChild(tile2);
    endTurn();
}

function selectRandomCell(grid) {
    let count = 0;
    let chosen = null;
  
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == -1) {
          count++;
          if (Math.random() < 1 / count) {
            chosen = [i, j];
          }
        }
      }
    }
  
    return chosen;
}
  
function isSquareDeal(grid) {
    function isPerfectSquare(n) {
        if (n < 0) return false;
        const r = Math.sqrt(n);
        return Number.isInteger(r);
    }

    const N = 4;

    for (let r = 0; r < N; r++) {
        let sum = 0;
        for (let c = 0; c < N; c++) {
            sum += grid[r][c];
        }
        if (!isPerfectSquare(sum)) return false;
    }

    for (let c = 0; c < N; c++) {
        let sum = 0;
        for (let r = 0; r < N; r++) {
            sum += grid[r][c];
        }
        if (!isPerfectSquare(sum)) return false;
    }

    return true;
}

function init() {

    const tiles = document.querySelectorAll(".tile");
    const cells = document.querySelectorAll(".cell");
    const rack = document.querySelector(".rack");
    const endTurnBtn = document.querySelector("#endTurnBtn");
    const tile1 = tiles[0];
    const tile2 = tiles[1];

    tiles.forEach(tile => {
        tile.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tile.dataset.value);
        });
        tile.addEventListener("pointerdown", () => {
            currentTile = tile;
            tile.classList.add("selected");
            if(tile === tile1) {
                tile2.classList.remove("selected");
            } else {
                tile1.classList.remove("selected");
            }
        });
    });
    
    function placeTile (cell) {
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
                playSound("/sounds/PlacingSound.mp3");
            }
            
        } else {
            if (gridB[row][column] === -1) {
                currentTile.dataset.row = row;
                currentTile.dataset.col = column;
                currentTile.dataset.grid = grid;
                cell.appendChild(currentTile);
                if (rack.querySelector(".tile") == null) {endTurnBtn.hidden = false;}
                playSound("/sounds/PlacingSound.mp3");
            }
        }
    }

    cells.forEach(cell => {
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        cell.addEventListener("drop", (e) => {

            e.preventDefault();

            placeTile(cell);

        });
        cell.addEventListener("click", (e) => {

            e.preventDefault();

            placeTile(cell);

        });
    });

    chooseTiles();

}

document.addEventListener("DOMContentLoaded", init);