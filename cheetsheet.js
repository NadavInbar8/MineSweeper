'use strict'

const MINE = '💥';
const FLAG = '🚩';
const EMPTY = '';
var SMILEY = '🙂';

var gLives = ['', '🤍', '🤍 🤍', '🤍 🤍 🤍'];
var glivesCount = 3;
var gBoard;
var gLevel;
var elTimer;
var isFirstClick = true;
var isHintClicked = false;
var isMineByUser = false;
var isMinesCreated = false;
var gCountRecursionActions = 1;

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function initGame() {
    updateLevel();

}

function restartGame(size) {
    var mine;

    switch (size) {
        case 4:
            mine = 2
            break;
        case 8:
            mine = 12
            break;
        case 12:
            mine = 30
            break;
    }

    updateLevel(size, mine);
}

function updateLevel(size = 4, mines = 2) {
    updateInitGameProperties(size, mines);

    gBoard = buildBoard(gLevel);
    renderBoard(gBoard);
    
    timerRunning = false;
    resetTimer();
    
    renderInitGame();
    disableRightClick();
}

function buildBoard(gLevel) {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }

    return board;
}

function setMinesNegsCount(board) {
    var count = 0;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
                    if (rowIdx < 0 || rowIdx >= board.length) continue;
                    for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
                        if (colIdx < 0 || colIdx >= board[0].length) continue;
                        if (rowIdx === i && colIdx === j) continue;
                        var currCell = board[rowIdx][colIdx];
                        if (currCell.isMine) count++;
                    }
                }
                if (count !== 0) {
                    board[i][j].minesAroundCount = count;
                    count = 0;
                } else {
                    board[i][j].minesAroundCount = '';
                }
            }
        }
    }
}

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    strHTML += `<tr><th colspan="${board.length}"><button class="smiley"
    onclick="restartGame(${board.length})">${SMILEY}</button><span>00:00:00</span>
    </th></tr>`;

    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < board[0].length; j++) {
            var className = 'cell cell' + i + '-' + j;
            strHTML += `\t<td class="${className}" 
            onmousedown= "cellClicked(this, event, ${i}, ${j})" 
            onclick=" placeMineByUser(this, ${i}, ${j})"></td>\n`;
        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, event, i, j) {
    if (!gGame.isOn || isMarkCoveredCell || gBoard[i][j].isShown || isMineByUser) return;
    if (!timerRunning) {
        timerRunning = true;
        updateTimer();
    }

    if (event.button === 2) {
        cellMarked(elCell, i, j);
    } else if (event.button === 0) {
        if (gBoard[i][j].isMarked) return;
        if (isHintClicked) {
            hintRevealed(elCell, i, j);
            gGame.isOn = false;
            setTimeout(() => {
                hintUnrevealed(elCell, i, j);
                isHintClicked = false;
                gGame.isOn = true;
            }, 1000);
        } else {
            var cell = gBoard[i][j];
            shownCell(cell, elCell);
            if (isFirstClick) {
                if (!isMinesCreated) placeMines(gBoard, i, j);
                setMinesNegsCount(gBoard);
                isFirstClick = false;
            }
            switch (cell.minesAroundCount) {
                case MINE:
                    if (glivesCount === 0) {
                        gameOver();
                        updateGameOverProperties('Game over!', '🤯');
                        break;
                    } else {
                        glivesCount--;
                        document.querySelector('.lives').innerText = gLives[glivesCount];
                        elCell.innerHTML = cell.minesAroundCount;
                        break;
                    }
                case '':
                    addAction(i, j);
                    expandShown(gBoard, i, j);
                    gDoneActions.push(gCountRecursionActions);
                    gCountRecursionActions = 1;
                    break;
                default:
                    elCell.innerHTML = cell.minesAroundCount;
                    renderColorNums(cell, elCell);
                    addAction(i, j);
                    gDoneActions.push(1);
                    break;
            }
        }
    }
    checkGameOver();
}

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isMarked) {
        elCell.innerHTML = EMPTY;
        gGame.markedCount--;
        gBoard[i][j].isMarked = false;
    } else {
        elCell.innerHTML = FLAG;
        gGame.markedCount++;
        gBoard[i][j].isMarked = true;
        addAction(i, j);
        gDoneActions.push(1);
    }
}

function gameOver() {
    gGame.isOn = false;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].minesAroundCount === MINE) {
                var currCell = gBoard[i][j]
                currCell.isShown = true;
                document.querySelector(`.cell${i}-${j}`).innerHTML = currCell.minesAroundCount;
            }
        }
    }
}

function checkGameOver() {
    var countShownMarked = gGame.shownCount + gGame.markedCount;
    if (countShownMarked === gBoard.length * gBoard[0].length) {
        gameOver();
        updateBestTime(gLevel.SIZE);
        updateGameOverProperties('Game done!', '😎');
    } else return;
}

function expandShown(board, i, j) {
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= board.length) continue;
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            if (colIdx < 0 || colIdx >= board[0].length) continue;
            if (rowIdx === i && colIdx === j) continue;
            var currCell = board[rowIdx][colIdx];
            var elCurrCell = document.querySelector(`.cell${rowIdx}-${colIdx}`);
            if (currCell.isMine) continue;
            if (currCell.isShown) continue;
            if (currCell.isMarked) continue;
            shownCell(currCell, elCurrCell);
            renderColorNums(currCell, elCurrCell);
            addAction(rowIdx, colIdx);
            gCountRecursionActions++;
            if (currCell.minesAroundCount === EMPTY) expandShown(gBoard, rowIdx, colIdx);
        }
    }
}


function updateGameOverProperties(str, smiley) {
    document.querySelector('.end').innerText = str;
    document.querySelector('.smiley').innerHTML = smiley;
    timerRunning = false;
    resetTimer();
}

function shownCell(cell, elCell) {
    cell.isShown = true;
    elCell.innerHTML = cell.minesAroundCount;
    elCell.classList.add('shown');
    gGame.shownCount++;
}

function renderInitGame() {
    elTimer = document.querySelector('span');
    document.querySelector('.lives').innerHTML = gLives[3];
    document.querySelector('.safe').innerText = 'Safe Click: 3';
    document.querySelector('.end').innerText = '';
    document.querySelector('.hint1').innerHTML = '<img src="./img/hint.png" width="55">';
    document.querySelector('.hint2').innerHTML = '<img src="./img/hint.png" width="55">';
    document.querySelector('.hint3').innerHTML = '<img src="./img/hint.png" width="55">';
}

function updateInitGameProperties(size, mines) {
    SMILEY = '🙂';
    glivesCount = 3;
    gSafeClickCount = 2;
    gCountMinesUser = 0;
    isMarkCoveredCell = false;
    isFirstClick = true;
    isHintClicked = false;
    isMineByUser = false;
    isMinesCreated = false;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gCountRecursionActions = 1;
    gLevel = {
        SIZE: size,
        MINES: mines
    };
    gDoneActions = [];
}

function renderColorNums(cell, elCell) {
    switch(cell.minesAroundCount) {
        case 1:
            elCell.style.color = '#044389';
            elCell.style.fontWeight = 'bold';
            break;
        case 2:
            elCell.style.color = 'darkgreen';
            elCell.style.fontWeight = 'bold';
            break;
        case 3:
            elCell.style.color = 'darkred';
            elCell.style.fontWeight = 'bold';
            break;
        case 4:
            elCell.style.color = '#003459';
            elCell.style.fontWeight = 'bold';
            break;
        default:
            elCell.style.color = 'darkmagenta';
            elCell.style.fontWeight = 'bold';
            break;
    }
}