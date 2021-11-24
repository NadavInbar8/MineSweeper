'use strict';

// Consts //
const MINE = '💣';
const EMPTY = '⬜';
const FLAG = '🚩';
const SMILEY = '🙂';

// Global Variables //

var gBoard;
var gBlankCounter = 0;
var gDifficulty = 2;
var gSize = 4;
var gGame = {
  score: 0,
  isOn: false,
};

// Functions //

function init() {
  gBoard = buildBoard(gSize);
  renderBoard(gBoard, '.board-container');
  checkBlanks(gBoard);
  gGame.isOn = true;
}

function restartGame(size) {
  var mine;

  switch (size) {
    case 4:
      mine = 2;
      break;
    case 8:
      mine = 12;
      break;
    case 12:
      mine = 30;
      break;
  }

  init();
}

function buildBoard(SIZE) {
  // real minesweeper is 15*30
  var board = [];
  for (let i = 0; i < SIZE; i++) {
    board.push([]);
    for (let j = 0; j < SIZE; j++) {
      var cell = {
        type: randomCellInput(),
        i: i,
        j: j,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function changeDifficulty(el) {
  if (el.classList.value === 'easy') {
    gDifficulty = 2;
    gSize = 4;
  } else if (el.classList.value === 'medium') {
    gDifficulty = 12;
    gSize = 8;
  } else if (el.classList.value === 'expert') {
    gDifficulty = 30;
    gSize = 12;
  }
  init();
}

function randomCellInput() {
  var cellInput = getRandomIntInclusive(0, 1);
  if (cellInput === 0) {
    return EMPTY;
  } else return MINE;
}

function cellClicked(el) {
  console.log(el);
  console.log(el.dataset.ismine);
  if (el.dataset.ismine === 'true') {
    gameOver();
  } else {
    var idx = +el.dataset.pos.charAt(0);
    var jdx = +el.dataset.pos.charAt(1);

    var mines = getMinesAround(idx, jdx);
    switch (mines) {
      case 0:
    }
    console.log(mines);
    if (mines === 0) {
    }
    el.innerText = mines;
    gBlankCounter--;
    if (checkVictory()) {
      console.log('win');
      gameOver();
    }
  }
}

function checkBlanks(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j].type === EMPTY) {
        gBlankCounter++;
      }
    }
  }
}

function updateScore(diff) {}

function gameOver() {
  openModal();
}

function checkVictory() {
  if (gBlankCounter === 0) {
    return true;
  } else return false;
}

/////////////////////////////////////////////////////

/// Modal Functions ///

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelectorAll('.show-modal');

//open and close modal functions
const openModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// click to open the modal
for (let i = 0; i < btnOpenModal.length; i++) {
  btnOpenModal[i].addEventListener('click', openModal);
}

// click to close the modal
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// click escape to close the modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
