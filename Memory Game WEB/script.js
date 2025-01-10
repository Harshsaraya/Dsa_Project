const tiles = [];
let matchedTilesCount = 0;
let stepsTaken = 0;
let firstTile = null;
let secondTile = null;
let lockBoard = false;
let boardSize = 2;
let timer;
let timeTaken = 0;

const imageCount = 8;
const imageBaseUrl = 'src/';

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timer = setInterval(() => {
        timeTaken++;
        document.getElementById('time-taken').innerText = timeTaken;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function createBoard() {
    if (boardSize % 2 !== 0) boardSize++;

    tiles.length = 0;

    const imageUrls = [];
    for (let i = 1; i <= imageCount; i++) {
        imageUrls.push(`${imageBaseUrl}image${i}.jpeg`);
    }

    let randomizedImages = [];
    for (let i = 0; i < boardSize * boardSize / 2; i++) {
        const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        randomizedImages.push(randomImage, randomImage);
    }

    shuffle(randomizedImages);

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    randomizedImages.forEach(tileImage => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        
        const tileInner = document.createElement('div');
        tileInner.classList.add('tile-inner');
        
        const tileFront = document.createElement('div');
        tileFront.classList.add('tile-front');
        
        const tileBack = document.createElement('div');
        tileBack.classList.add('tile-back');
        
        const imgElement = document.createElement('img');
        imgElement.src = tileImage;
        imgElement.classList.add('tile-img');
        
        tileBack.appendChild(imgElement);
        tileInner.appendChild(tileFront);
        tileInner.appendChild(tileBack);
        tileElement.appendChild(tileInner);
        
        tileElement.dataset.tileValue = tileImage;
        tileElement.addEventListener('click', flipTile);
        gameBoard.appendChild(tileElement);
    });

    startTimer();
}

function flipTile() {
    if (lockBoard) return;
    
    this.classList.add('flipped');
    
    stepsTaken++;
    document.getElementById('steps-taken').innerText = stepsTaken;
    
    if (!firstTile) {
        firstTile = this;
        return;
    }
    
    secondTile = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    if (firstTile.dataset.tileValue === secondTile.dataset.tileValue) {
        firstTile.classList.add('matched');
        secondTile.classList.add('matched');
        resetTiles();

        if (document.querySelectorAll('.tile:not(.matched)').length === 0) {
            stopTimer();
            setTimeout(() => {
                const winMessage = document.createElement('div');
                winMessage.classList.add('win-message');
                winMessage.innerHTML = `<h2>You Win!</h2><p>Great job! You completed the game in ${timeTaken} seconds.</p>`;
                document.body.appendChild(winMessage);
                
                document.getElementById('next-level-btn').style.display = 'block';
                document.getElementById('instructions').style.display = 'block';

                setTimeout(() => {
                    winMessage.remove();
                }, 3000);
            }, 1000);
        }
    } else {
        setTimeout(() => {
            firstTile.classList.remove('flipped');
            secondTile.classList.remove('flipped');
            resetTiles();
        }, 1000);
    }
}

function resetTiles() {
    [firstTile, secondTile] = [null, null];
    lockBoard = false;
}

function resetGame() {
    stepsTaken = 0;
    timeTaken = 0;
    document.getElementById('steps-taken').innerText = stepsTaken;
    document.getElementById('time-taken').innerText = timeTaken;
    stopTimer();
    createBoard();
    document.getElementById('next-level-btn').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
}

function nextLevel() {
    boardSize++;
    resetGame();
}

function restartGame() {
    boardSize = 2;
    resetGame();
}

createBoard();

document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('next-level-btn').addEventListener('click', nextLevel);
