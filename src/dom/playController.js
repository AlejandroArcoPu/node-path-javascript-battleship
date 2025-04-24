import Player from "../classes/Player";
import {
  createBoard,
  display,
  notDisplay,
  paintCoordinates,
  randomCoordinate,
  paintMiniBoats,
} from "./utils";

function paintTurnMessageComputer(player) {
  const roundElement = document.querySelector(".round-info");
  roundElement.textContent =
    player.name === "player1" ? "Your turn!" : "Computer turn!";
}

function paintTurnMessageTwoPlayers(player) {
  const roundElement = document.querySelector(".round-info");
  roundElement.textContent =
    player.name === "player1" ? "Player 1️⃣ turn!" : "Player 2️⃣ turn!";
}

function paintWinnerTwoPlayers(winner) {
  const board1 = document.querySelector(".board1");
  const board2 = document.querySelector(".board2");
  board1.classList.add("disabled");
  board2.classList.add("disabled");
  console.log(winner);
  const roundElement = document.querySelector(".round-info");
  roundElement.classList.add("winner");
  roundElement.textContent =
    winner === "player1" ? "Player 1️⃣ win!" : "Player 2️⃣ win!";
}

function paintWinnerComputer(board1, board2, winner) {
  const roundElement = document.querySelector(".round-info");
  roundElement.classList.add("winner");
  roundElement.textContent =
    winner === "player1" ? "You win!" : "Computer win!";

  board1.classList.add("disabled");
  board2.classList.add("disabled");
}

function changeClickableBoardTwoPlayers(currentBoard, newBoard) {
  currentBoard.classList.toggle("clickable-board");
  newBoard.classList.toggle("clickable-board");
  currentBoard.classList.toggle("disabled");
  newBoard.classList.toggle("disabled");
}

function changeClickableBoardComputer(currentBoard, newBoard) {
  if (newBoard.classList[0] === "board1") {
    newBoard.classList.remove("clickable-board");
  } else {
    newBoard.classList.toggle("clickable-board");
  }
  currentBoard.classList.toggle("clickable-board");
  currentBoard.classList.toggle("disabled");
  newBoard.classList.toggle("disabled");
}

function paintAttacked(player, coordinate, attacked) {
  let span = document.createElement("span");
  if (
    JSON.stringify(player.gameboard.missedCoordinates).includes(
      JSON.stringify(coordinate)
    )
  ) {
    span.textContent = "○";
    attacked.append(span);
    attacked.classList.add("attacked-coordinate");
  } else {
    span.textContent = "✘";
    attacked.append(span);
    attacked.classList.add("hit-coordinate");
  }
}

function humanAttack(event, player) {
  const coordinateX = Number(event.currentTarget.id.match(/\d+/)[0][1]);
  const coordinateY = Number(
    event.currentTarget.parentElement.id.match(/\d+/)[0][1]
  );
  const coordinate = [coordinateX, coordinateY];
  const colAttacked = event.target;

  player.gameboard.receiveAttack(coordinate);
  paintAttacked(player, coordinate, colAttacked);
}

function computerRandomAttack(board, player) {
  const coordinate = randomCoordinate(player);
  player.gameboard.receiveAttack(coordinate);
  const rowAttacked = board.querySelector(`#Row${player.name}${coordinate[0]}`);
  const colAttacked = rowAttacked.querySelector(
    `#Col${player.name}${coordinate[1]}`
  );
  paintAttacked(player, coordinate, colAttacked);
}

function foundWinner(player1, player2) {
  if (player1.gameboard.allSunk() && !player2.gameboard.allSunk()) {
    return player2.name;
  } else if (!player1.gameboard.allSunk() && player2.gameboard.allSunk()) {
    return player1.name;
  } else {
    return;
  }
}

function gameProcessHumanvsComputer(event, player1, player2, board1, board2) {
  humanAttack(event, player2);
  paintMiniBoats(player1);
  changeClickableBoardComputer(board2, board1);
  paintTurnMessageComputer(player2);
  let winner = foundWinner(player1, player2);
  if (winner) {
    paintWinnerComputer(board1, board2, winner);
    return;
  }
  setTimeout(() => {
    computerRandomAttack(board1, player1);
    winner = foundWinner(player1, player2);
    changeClickableBoardComputer(board1, board2);
    paintTurnMessageComputer(player1);
    if (winner) {
      paintWinnerComputer(board1, board2, winner);
    }
  }, 500);
}

function getCurrentNonClickable() {
  const board1 = document.querySelector(".board1");
  const board2 = document.querySelector(".board2");
  const board1ClassList = [...board1.classList];

  return board1ClassList.includes("clickable-board") ? board2 : board1;
}

function gameProcessTwoPlayers(event, attackedPlayer, otherPlayer, board) {
  humanAttack(event, attackedPlayer);
  const nonClickableBoard = getCurrentNonClickable();
  changeClickableBoardTwoPlayers(board, nonClickableBoard);
  paintTurnMessageTwoPlayers(attackedPlayer);
  let winner = foundWinner(attackedPlayer, otherPlayer);
  console.log(winner);
  if (winner) {
    paintWinnerTwoPlayers(winner);
  }
}

function playControllerTwoPlayers(player1, player2) {
  notDisplay(".place2");
  display(".play");

  const roundInfo = document.querySelector(".round-info");
  roundInfo.textContent = "Player 1️⃣ turn!";

  const board1 = document.querySelector(".board1");
  const playerTitle1 = board1.querySelector(".player-title");
  playerTitle1.textContent = "Player 1️⃣ board";
  createBoard(board1, player1);

  const board2 = document.querySelector(".board2");
  const playerTitle2 = board2.querySelector(".player-title");
  playerTitle2.textContent = "Player 2️⃣ board";

  createBoard(board2, player2);
  board2.classList.toggle("clickable-board");

  const cellBoardElements2 = board2.querySelectorAll(".column-board");
  cellBoardElements2.forEach((cellBoard) => {
    cellBoard.addEventListener("click", (event) =>
      gameProcessTwoPlayers(event, player2, player1, board2)
    );
  });

  const cellBoardElements1 = board1.querySelectorAll(".column-board");
  cellBoardElements1.forEach((cellBoard) => {
    cellBoard.addEventListener("click", (event) =>
      gameProcessTwoPlayers(event, player1, player2, board1)
    );
  });
}

function playControllerComputer(player1) {
  notDisplay(".place");
  display(".play");

  const player2 = new Player("player2", "computer");
  player2.gameboard.placeRandomShips();

  const board1 = document.querySelector(".board1");
  createBoard(board1, player1);
  paintCoordinates(player1, board1);

  const board2 = document.querySelector(".board2");
  createBoard(board2, player2);
  board2.classList.toggle("clickable-board");

  const cellBoardElements = board2.querySelectorAll(".column-board");
  cellBoardElements.forEach((cellBoard) => {
    cellBoard.addEventListener("click", (event) =>
      gameProcessHumanvsComputer(event, player1, player2, board1, board2)
    );
  });
}

export { playControllerComputer, playControllerTwoPlayers };
