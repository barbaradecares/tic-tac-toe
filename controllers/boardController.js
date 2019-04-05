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

exports.index = (req, res, next) => {
  board = req.query.board;
  boardArray = board.split("");

  let moveIndex;
  let move = {};

  if (!isValidBoard(board)) {
    res.status(400);
    res.send("Invalid board");
  } else {
    checkForWinOrBlock();
    switch (true) {
      case "win" in move:
        console.log("win");
        moveIndex = move["win"];
        break;
      case "block" in move:
        console.log("block");
        moveIndex = move["block"];
        break;
      default:
        predictWin();
        if ("predict" in move) {
          console.log("predict");
          moveIndex = move["predict"];
        } else {
          if (boardArray[4] == " ") {
            moveIndex = 4;
            console.log("center");
          } else {
            console.log("corner");
            moveIndex = getAvailableCorner();
          }
        }
        break;
    }

    //Define move
    boardArray[moveIndex] = "o";

    res.send(boardArray.join("").replace(/ /g, "&nbsp;"));
  }

  function checkForWinOrBlock() {
    winRows.forEach(row => {
      oCounter = 0;
      xCounter = 0;

      //Keeps track of possible win rows stats
      const boardOption = row.map(cell => {
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

      //Assign type of move and position
      if (oCounter == 2 && xCounter == 0) {
        move["win"] = row[boardOption.indexOf(" ")];
      } else if (xCounter == 2 && oCounter == 0) {
        move["block"] = row[boardOption.indexOf(" ")];
      }
    });
  }

  function predictWin() {
    for (let i = 0; i < 9; i++) {
      if (boardArray[i] === " ") {
        boardArray[i] = "o";
        checkForWinOrBlock();
        if (move.win) {
          delete move.win;
          move["predict"] = i;
        }
        boardArray[i] = " ";
      }
    }
  }

  function getAvailableCorner() {
    switch (true) {
      case boardArray[0] == " ":
        return 0;
        break;
      case boardArray[2] == " ":
        return 2;
        break;
      case boardArray[6] == " ":
        return 6;
        break;
      case boardArray[8] == " ":
        return 8;
        break;
    }
  }

  function isValidBoard(board) {
    let characters = board.match(/[ox ]/g);

    if (characters.length !== 9 || !characters) {
      return false;
    } else {
      return isProperTurn(characters) ? true : false;
    }
  }

  function isProperTurn(characters) {
    let oCounter = 0,
      xCounter = 0;

    for (let i = 0; i < characters.length; i++) {
      if (characters[i] === "x") {
        xCounter += 1;
      } else if (characters[i] === "o") {
        oCounter += 1;
      }
    }

    if (
      oCounter > xCounter ||
      oCounter + xCounter === 9 ||
      xCounter > oCounter + 1
    ) {
      return false;
    } else {
      return true;
    }
  }
};
