start();

function start() {
  const cells = document.querySelectorAll("td");
  const newGame = document.createElement("button");
  document.getElementById("buttons").innerHTML = "";

  document.getElementById("messages").innerHTML = "";

  newGame.innerHTML = "New Game";
  newGame.classList.add("new-game-button");
  newGame.addEventListener("click", start);
  document.getElementById("buttons").append(newGame);

  cells.forEach(cell => {
    let insideCell = cell.querySelector("div");
    insideCell.innerHTML = "";
    insideCell.classList.remove("x-cell");
    insideCell.classList.remove("o-cell");

    cell.addEventListener("click", () => {
      gameStats = checkGameStats(getBoard());
      if (
        insideCell.innerHTML != "X" &&
        insideCell.innerHTML != "O" &&
        gameStats === "go"
      ) {
        makeAMove(insideCell);
      }
    });
  });
}

function makeAMove(cell) {
  cell.innerHTML = "X";
  cell.classList.add("x-cell");

  let currentBoard = getBoard();
  let stats = checkGameStats(currentBoard);

  if (stats === "go") {
    computerPlays(currentBoard);
  } else {
    setTimeout(() => freezeGame(stats), 500);
  }
}

function computerPlays(board) {
  fetch(`http://localhost:5000/?board=${board}`)
    .then(response => {
      return response.json();
    })
    .then(updatedBoard => insertComputerMove(updatedBoard.board));
}

function insertComputerMove(updatedBoard) {
  cells = getCells();

  updatedBoard = updatedBoard.replace(new RegExp("&nbsp;", "g"), "+");

  boardArray = updatedBoard.split("");

  cells.forEach((cell, index) => {
    if (boardArray[index] === "o") {
      cell.innerHTML = boardArray[index].toUpperCase();
      cell.classList.add("o-cell");
    }
  });

  let stats = checkGameStats(updatedBoard);
  if (stats != "go") {
    freezeGame(stats);
  }
}

function getBoard() {
  cells = getCells();
  boardString = "";

  cells.forEach(cell => {
    cell.innerHTML === ""
      ? (boardString += "+")
      : (boardString += cell.innerHTML.toLowerCase());
  });
  return boardString;
}

function getCells() {
  return document.querySelectorAll("td > div");
}

function checkGameStats(board) {
  const winRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
  ];
  boardArray = board.split("");
  let result,
    totalMoves = 0;

  boardArray.forEach(cell => {
    if (cell === "o" || cell === "x") {
      totalMoves += 1;
    }
  });

  if (totalMoves === 9) {
    result = "It's a draw!";
  }

  winRows.forEach(row => {
    oCounter = 0;
    xCounter = 0;

    row.forEach(cell => {
      if (boardArray[cell] === "o") {
        oCounter += 1;
        return "o";
      } else if (boardArray[cell] === "x") {
        xCounter += 1;
        return "x";
      } else {
        return " ";
      }
    });

    if (oCounter === 3) {
      result = "Too bad, try again!";
    } else if (xCounter === 3) {
      result = "Congrats, you win!";
    }
  });

  if (!result) {
    result = "go";
  }
  return result;
}

function freezeGame(stats) {
  let messageContainer = document.getElementById("messages");
  messageContainer.innerHTML = "";
  let message = document.createElement("h1");
  message.innerHTML = stats;
  messageContainer.appendChild(message);
}
