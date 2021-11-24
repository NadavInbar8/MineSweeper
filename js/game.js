'use strict';

// Consts //
const MINE = '💣';
const EMPTY = '⬜';
const FLAG = '🚩';
const SMILEY = '🙂';
const LIFE = '❤';

// Global Variables //

var gBoard;
var gBlankCounter = 0;
var gLife = 3;
var isFirstClick = true;
var gTimerInterval;
var gGameMode = {
  mines: 2,
  size: 4,
};
var gGame = {
  score: 0,
  isOn: false,
};

// Functions //

function init() {
  gBoard = buildBoard(gGameMode.size);
  randomMineInserter();
  renderBoard(gBoard, '.board-container');
  console.log(checkBlanks(gBoard));
  gGame.isOn = true;
}

function restartGame() {}

function buildBoard(SIZE) {
  // real minesweeper is 15*30
  var board = [];
  for (let i = 0; i < SIZE; i++) {
    board.push([]);
    for (let j = 0; j < SIZE; j++) {
      var cell = {
        type: EMPTY,
        i: i,
        j: j,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function changeDifficulty(el) {
  if (el.classList.value === 'easy') {
    gGameMode.size = 4;
    gGameMode.mines = 2;
    gBlankCounter = 0;
  } else if (el.classList.value === 'medium') {
    gGameMode.size = 8;
    gGameMode.mines = 12;
    gBlankCounter = 0;
  } else if (el.classList.value === 'expert') {
    gBlankCounter = 0;

    gGameMode.size = 12;
    gGameMode.mines = 30;
  }
  init();
}

function randomMineInserter() {
  for (let i = 0; i < gGameMode.mines; i++) {
    var randI = getRandomIntInclusive(0, gGameMode.size - 1);
    var randJ = getRandomIntInclusive(0, gGameMode.size - 1);
    if (gBoard[randI][randJ].type === MINE) {
      randI = getRandomIntInclusive(0, gGameMode.size - 1);
      randJ = getRandomIntInclusive(0, gGameMode.size - 1);
      gBoard[randI][randJ].type = MINE;
      gBoard[randI][randJ].isMine = true;
    } else {
      gBoard[randI][randJ].type = MINE;
      gBoard[randI][randJ].isMine = true;
    }
  }
}

function flagClick(el) {
  el.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
  });
  var idx = +el.dataset.pos.charAt(0);
  var jdx = +el.dataset.pos.charAt(1);
  if (!el.innerText || el.innerText === FLAG) {
    if (el.innerText === FLAG) {
      el.innerText = '';
      gBoard[idx][jdx].isMarked = false;
    } else {
      el.innerText = FLAG;
      gBoard[idx][jdx].isMarked = true;
    }
  }
}

function cellClicked(el) {
  var idx = +el.dataset.pos.charAt(0);
  var jdx = +el.dataset.pos.charAt(1);
  if (el.innerText !== FLAG) {
    if (el.dataset.ismine === 'true' && gLife <= 0) {
      for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
          if (gBoard[i][j].type === MINE) {
            var posStr = i + '' + j;
            var curElCell = document.querySelector(`[data-pos="${posStr}"]`);
            curElCell.innerText = MINE;
            console.log('im here');
          }
        }
      }
    } else if (el.dataset.ismine === 'true') {
      gLife--;
      document.querySelector('.life').innerText = ` ${gLife}x ${LIFE}`;
    } else if (gBoard[idx][jdx].isMarked === false) {
      gBoard[idx][jdx].isMarked = true;

      var mines = getMinesAround(idx, jdx);
      if (mines === 0) {
        gBlankCounter++;

        for (var i = idx - 1; i <= idx + 1; i++) {
          if (i < 0 || i >= gBoard.length) continue;
          for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === idx && j === jdx) continue;
            el.innerText = 0;

            if (checkVictory()) {
              gameOver();
            }
            if (
              gBoard[i][j].isMine === false &&
              gBoard[i][j].isMarked === false
            ) {
              var posStr = i + '' + j;
              var curElCell = document.querySelector(`[data-pos="${posStr}"]`);
              cellClicked(curElCell);
            }
          }
        }
      } else {
        el.innerText = mines;
        gBlankCounter++;
        console.log(gBlankCounter);
        if (checkVictory()) {
          gameOver();
        }
      }
    }
  }
}

function checkBlanks(board) {
  var blanks = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].type === EMPTY) {
        blanks++;
      }
    }
  }
  return blanks;
}

function updateScore(diff) {}

function gameOver() {
  var msg = '';
  if (gBlankCounter === checkBlanks(gBoard)) {
    msg += `Congratz You've Won!`;
  } else {
    msg += `You Lost!... Better luck next time!`;
  }
  var elModelH1 = modal.querySelector('h1');
  elModelH1.innerText = msg;
  openModal();
}

function checkVictory() {
  if (gBlankCounter === checkBlanks(gBoard)) {
    document.querySelector('.smiley').innerText = '😎';
    return true;
  } else {
    return false;
  }
}

function timer() {
  var start = 0;
}
