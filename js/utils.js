//prints a game table
function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  strHTML += `<tr><th><button class="smiley"
  onclick="restartGame(${mat.length})">${SMILEY}</button><span class="timer">00:00:00</span><span class="life"> ${gLife}x ${LIFE}</span>
  </th></tr>`;

  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var className = 'cell ';
      var isBombData = 'data-ismine="';
      var posData = 'data-pos="' + i + '' + j + '"';
      if (mat[i][j].type == MINE) {
        className += ' mine ';
        isBombData += 'true"';
      } else if (mat[i][j].type === EMPTY) {
        className += ' empty ';
        isBombData += 'false"';
      }
      strHTML +=
        `<td onclick="cellClicked(this)"  oncontextmenu="flagClick(this)" class="` +
        className +
        '" ' +
        isBombData +
        posData +
        '> </td>';
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// renders a cell in a table.
//location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

//return a random number between 2 numbers
function getRandomInt(min, max) {
  return Math.trunc(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

//gives a random color in hex code
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// return an arry of empty cells inside a board
function getEmptyCell(board) {
  var emptyCells = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      if (currCell === EMPTY) {
        var emptyCellPos = { i, j };
        emptyCells.push(emptyCellPos);
      }
    }
  }
  var randomIdx = getRandomInt(0, emptyCells.length);
  var emptyCell = emptyCells[randomIdx];
  return emptyCell;
}

function getMinesAround(idx, jdx) {
  var countMines = 0;
  for (var i = idx - 1; i <= idx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = jdx - 1; j <= jdx + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === idx && j === jdx) continue;
      if (gBoard[i][j].type === MINE) {
        countMines++;
      }
    }
  }
  return countMines;
}

// //more advanced timer, aa:bb:cc kind, when setting interval need to set it for 100ms
// function startTimer() {
//   var timer = document.querySelector('.timer');
//   var milisec = 0;
//   var sec = 0;
//   var min = 0;
//   milisec++;
//   if (milisec > 9) {
//     sec++;
//     milisec = 0;
//   }
//   if (sec > 59) {
//     min++;
//     sec = 0;
//   }
//   timer.innerText =
//     (min < 10 ? '0' + min : min) +
//     ':' +
//     (sec < 10 ? '0' + sec : sec) +
//     ':' +
//     '0' +
//     milisec;
// }

//simple timer, counting seconds, set interval to 100ms for smooth run
function setTimer(gStartingTime) {
  var currTime = new Date().getTime();
  // var timer = parseInt((currTime-gStartingTime)/1000)
  var timer = (currTime - gStartingTime) / 1000;
  // console.log(timer)
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = `Time:\n ${timer}`;
}
