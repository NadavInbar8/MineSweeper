'use strict';

// Consts //
const MINE = '💣';
const EMPTY = '⬜';
const FLAG = '🚩';
const SMILEY = '🙂';

// Global Variables //

var gBoard;
var gBlankCounter = 0;
var gFlagCounter = 0;
var gLife = 3;
var isFirstClick = true;
var gTimerInterval;
var safeCount = 3;
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
  randomMineInserter(gGameMode.mines);
  renderBoard(gBoard, '.board-container');
  gGame.isOn = true;
  clearInterval(gTimerInterval);
  isFirstClick = true;
  min = 0;
  sec = 0;
  secEl.innerHTML = sec;
  minEl.innerHTML = min;
  gLife = 3;
  safeCount = 3;
  gBlankCounter = 0;
  gFlagCounter = 0;
  document.querySelector('.life-count').innerText = '3';
  document.querySelector('.safe-count').innerText = '3';
  document.querySelector('.icon-button').innerHTML =
    '<img src="assets/smiley.svg" height="50px" />';
}

function restartGame() {}

function buildBoard(SIZE) {
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
  if (el.classList[0] === 'easy') {
    gGameMode.size = 4;
    gGameMode.mines = 2;
    gBlankCounter = 0;
  } else if (el.classList[0] === 'medium') {
    gGameMode.size = 8;
    gGameMode.mines = 12;
    gBlankCounter = 0;
  } else if (el.classList[0] === 'expert') {
    gBlankCounter = 0;
    gGameMode.size = 12;
    gGameMode.mines = 30;
  }
  console.clear();

  init();
}

function randomMineInserter(mines) {
  for (let i = 0; i < mines; i++) {
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
  if (gGame.isOn) {
    console.log(el);
    var idx = +el.dataset.pos.charAt(0);
    var jdx = +el.dataset.pos.charAt(1);
    if (gBoard[idx][jdx].isMarked == false || gBoard[idx][jdx] != FLAG) {
      if (!el.innerText || el.innerText === FLAG) {
        if (gBoard[idx][jdx].type === FLAG) {
          el.innerHTML = '';
          gBoard[idx][jdx].isMarked = false;
          gBoard[idx][jdx].type = '';

          gFlagCounter--;
        } else {
          gBoard[idx][jdx].type = FLAG;
          el.innerHTML = "<img src='assets/defense.svg' height='50px' />";
          gBoard[idx][jdx].isMarked = true;
          gFlagCounter++;
          if (checkVictory()) {
            gameOver();
          } else console.log('returned false');
        }
      }
    }
  }
}

function safeClick() {
  var temp = gGameMode.size ** 2 - gGameMode.mines;
  if (safeCount > 0) {
    safeCount--;
    document.querySelector('.safe-count').innerText = safeCount;
    var randI = getRandomIntInclusive(0, gGameMode.size - 1);
    var randJ = getRandomIntInclusive(0, gGameMode.size - 1);
    if (
      gBoard[randI][randJ].type === EMPTY &&
      gBoard[randI][randJ].isMarked === false
    ) {
      var posStr = randI + '' + randJ;
      var curElCell = document.querySelector(`[data-pos="${posStr}"]`);
      curElCell.classList.add('safe');
      setTimeout(() => {
        curElCell.classList.remove('safe');
      }, 1000);
    } else if (gBlankCounter !== temp) {
      safeCount++;
      safeClick();
    } else {
      return;
    }
  }
}

function cellClicked(el) {
  var idx = +el.dataset.pos.charAt(0);
  var jdx = +el.dataset.pos.charAt(1);
  if (gGame.isOn === true) {
    if (isFirstClick) {
      isFirstClick = false;
      if (el.dataset.ismine === 'true') {
        el.dataset.ismine = 'false';
        gBoard[idx][jdx].type = EMPTY;
        randomMineInserter(1);
        renderBoard(gBoard);
      }
      // renderBoard(gBoard, '.board-container');
      gTimerInterval = setInterval(timer, 1000);
    }
    if (gBoard[idx][jdx].type !== FLAG) {
      if (el.dataset.ismine === 'true') {
        el.innerHTML = "<img src='assets/bomb-red.svg' height='50px' />";
        gFlagCounter++;
        if (checkVictory()) {
          gameOver();
        }
      }
      if (el.dataset.ismine === 'true' && gLife <= 0) {
        for (let i = 0; i < gBoard.length; i++) {
          for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].type === MINE) {
              var posStr = i + '' + j;
              var curElCell = document.querySelector(`[data-pos="${posStr}"]`);
              curElCell.innerHTML =
                "<img src='assets/bomb-red.svg' height='50px' />";
            }
          }
        }
        gameOver();
      } else if (el.dataset.ismine === 'true') {
        gLife--;
        if (gLife === -1) {
          document.querySelector('.life-count').innerText = 0;
        } else {
          document.querySelector('.life-count').innerText = gLife;
        }
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
                var curElCell = document.querySelector(
                  `[data-pos="${posStr}"]`
                );
                cellClicked(curElCell);
              }
            }
          }
        } else {
          el.innerText = mines;
          gBlankCounter++;
          if (checkVictory()) {
            gameOver();
          }
        }
      }
    }
  }
}

function hintClick() {}

function gameOver() {
  var msg = '';
  if (
    gBlankCounter === gGameMode.size ** 2 - gGameMode.mines &&
    gBlankCounter + gFlagCounter === gGameMode.size ** 2
  ) {
    msg += `Congratulations You've Won! <img src="assets/cool.svg" height="50px" />`;
  } else {
    msg += `You Lost!... Better luck next time!`;
    document.querySelector('.icon-button').innerHTML =
      '<img src="assets/head.svg" height="50px" />';
  }
  var elModelH1 = modal.querySelector('h1');
  elModelH1.innerHTML = msg;
  clearInterval(gTimerInterval);
  gGame.isOn = false;
  openModal();
}

function checkVictory() {
  if (gBlankCounter + gFlagCounter === gGameMode.size ** 2) {
    document.querySelector('.icon-button').innerHTML =
      '<img src="assets/cool.svg" height="50px" />';
    return true;
  } else {
    return false;
  }
}
