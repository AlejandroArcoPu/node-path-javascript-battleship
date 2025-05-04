import Player from "../classes/Player";
import {
  placeControllerComputer,
  placeControllerTwoPlayerFirst,
} from "./placeController";
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
  const restartElement = document.querySelector(".restart-button");
  board1.classList.add("disabled");
  board2.classList.add("disabled");
  const roundElement = document.querySelector(".round-info");
  roundElement.classList.add("winner");
  roundElement.textContent =
    winner === "player1" ? "Player 1️⃣ wins!" : "Player 2️⃣ wins!";
  restartElement.classList.remove("not-display");
}

function paintWinnerComputer(board1, board2, winner) {
  const restartElement = document.querySelector(".restart-button");
  const roundElement = document.querySelector(".round-info");
  roundElement.classList.add("winner");
  roundElement.textContent =
    winner === "player1" ? "You win!" : "Computer wins!";

  board1.classList.add("disabled");
  board2.classList.add("disabled");
  restartElement.classList.remove("not-display");
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
  const rowAttacked = board.querySelector(`#Row${player.name}${coordinate[1]}`);
  const colAttacked = rowAttacked.querySelector(
    `#Col${player.name}${coordinate[0]}`
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
  paintMiniBoats(player2);
  changeClickableBoardComputer(board2, board1);
  paintTurnMessageComputer(player2);
  let winner = foundWinner(player1, player2);
  if (winner) {
    paintWinnerComputer(board1, board2, winner);
    return;
  }
  setTimeout(() => {
    computerRandomAttack(board1, player1);
    paintMiniBoats(player1);

    winner = foundWinner(player1, player2);
    changeClickableBoardComputer(board1, board2);
    paintTurnMessageComputer(player1);
    if (winner) {
      paintWinnerComputer(board1, board2, winner);
    }
  }, 1500);
}

function getCurrentNonClickable() {
  const board1 = document.querySelector(".board1");
  const board2 = document.querySelector(".board2");
  const board1ClassList = [...board1.classList];

  return board1ClassList.includes("clickable-board") ? board2 : board1;
}

function gameProcessTwoPlayers(event, attackedPlayer, otherPlayer, board) {
  humanAttack(event, attackedPlayer);
  paintMiniBoats(attackedPlayer);
  const nonClickableBoard = getCurrentNonClickable();
  changeClickableBoardTwoPlayers(board, nonClickableBoard);
  paintTurnMessageTwoPlayers(attackedPlayer);
  let winner = foundWinner(attackedPlayer, otherPlayer);
  if (winner) {
    paintWinnerTwoPlayers(winner);
  }
}

function playControllerTwoPlayers(player1, player2) {
  notDisplay(".place2");
  display(".play");
  initPlay();

  const roundInfo = document.querySelector(".round-info");
  roundInfo.textContent = "Player 1️⃣ turn!";

  const board1 = document.querySelector(".board1");
  const playerTitle1 = board1.querySelector(".player-title");
  playerTitle1.textContent = "Player 1️⃣ board";
  createBoard(board1, player1);
  paintMiniBoats(player1);

  const board2 = document.querySelector(".board2");
  const playerTitle2 = board2.querySelector(".player-title");
  playerTitle2.textContent = "Player 2️⃣ board";

  createBoard(board2, player2);
  paintMiniBoats(player2);
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

  const restartElement = document.querySelector(".restart-button");
  restartElement.addEventListener("click", restartToPlaceTwoPlayers);
}

function restartToPlaceComputer() {
  notDisplay(".play");
  placeControllerComputer();
}

function restartToPlaceTwoPlayers() {
  notDisplay(".play");
  placeControllerTwoPlayerFirst();
}

function initPlay() {
  const restartElement = document.querySelector(".restart-button");
  restartElement.classList.add("not-display");

  const roundElement = document.querySelector(".round-info");
  roundElement.classList.remove("winner");

  const board1 = document.querySelector(".board1");
  if (board1) board1.remove();
  const newBoard1 = document.createElement("div");
  newBoard1.classList.add("board1");
  newBoard1.classList.add("disabled");

  const titleBoard1 = document.createElement("h3");
  titleBoard1.classList.add("player-title");
  titleBoard1.innerHTML =
    'Your board<svg xmlns="http://www.w3.org/2000/svg" height="24" width="21" viewBox="0 0 448 512" > <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" /> </svg>';
  newBoard1.append(titleBoard1);

  const board2 = document.querySelector(".board2");
  if (board2) board2.remove();
  const newBoard2 = document.createElement("div");
  newBoard2.classList.add("board2");

  const titleBoard2 = document.createElement("h3");
  titleBoard2.classList.add("player-title");
  titleBoard2.innerHTML =
    'Opponent board<svg xmlns="http://www.w3.org/2000/svg" height="24" width="28" viewBox="0 0 640 512" > <path fill="currentColor" d="M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /> </svg>';
  newBoard2.append(titleBoard2);

  const boards = document.querySelector(".boards");

  boards.prepend(newBoard1);
  boards.append(newBoard2);
}

function playControllerComputer(player1) {
  initPlay();
  notDisplay(".place");
  display(".play");

  const player2 = new Player("player2", "computer");
  player2.gameboard.placeRandomShips();

  const board1 = document.querySelector(".board1");
  createBoard(board1, player1);
  paintCoordinates(player1, board1);
  paintMiniBoats(player1);

  const board2 = document.querySelector(".board2");
  createBoard(board2, player2);
  paintMiniBoats(player2);
  board2.classList.toggle("clickable-board");
  console.log(player2.gameboard.ships);

  const cellBoardElements = board2.querySelectorAll(".column-board");
  cellBoardElements.forEach((cellBoard) => {
    cellBoard.addEventListener("click", (event) =>
      gameProcessHumanvsComputer(event, player1, player2, board1, board2)
    );
  });

  const restartElement = document.querySelector(".restart-button");
  restartElement.addEventListener("click", restartToPlaceComputer);
}

export { playControllerComputer, playControllerTwoPlayers };
