import { GAMEBOARD_SIZE_MAX } from "../classes/Gameboard.js";

export function notDisplay(classElement) {
  const element = document.querySelector(classElement);
  element.classList.add("not-display");
}

export function display(classElement) {
  const element = document.querySelector(classElement);
  element.classList.remove("not-display");
}

export function createBoard(board, player) {
  board.classList.add(player.type);
  for (let i = GAMEBOARD_SIZE_MAX; i >= 0; i--) {
    const rowBoard = document.createElement("div");
    rowBoard.classList.add(`row-board`);
    rowBoard.id = `Row${player.name}${i}`;
    for (let j = 0; j <= GAMEBOARD_SIZE_MAX; j++) {
      const columnBoard = document.createElement("div");
      columnBoard.classList.add(`column-board`);
      columnBoard.id = `Col${player.name}${j}`;
      rowBoard.append(columnBoard);
    }
    board.append(rowBoard);
  }
  addBoardNumbers(board);
}

function addBoardNumbers(board) {
  const colNumberElements = document.createElement("div");
  colNumberElements.classList.add("col-number-elements");
  for (let j = 0; j <= GAMEBOARD_SIZE_MAX; j++) {
    const colNumberElement = document.createElement("div");
    colNumberElement.textContent = j;
    colNumberElements.append(colNumberElement);
    colNumberElement.classList.add("col-number");
  }

  board.append(colNumberElements);
  const rowsInBoard = board.querySelectorAll(".row-board");
  rowsInBoard.forEach((row) => {
    const rowNumber = row.id.match(/\d+/)[0][1];
    const rowNumberElement = document.createElement("div");
    rowNumberElement.classList.add("row-number");
    rowNumberElement.textContent = rowNumber;
    row.prepend(rowNumberElement);
  });
}

function cleanCoordinates() {
  const alreadyPainted = document.querySelectorAll(".coordinate-painted");
  alreadyPainted.forEach((painted) =>
    painted.classList.remove("coordinate-painted")
  );
}

export function paintMiniBoats(player) {
  let stats = document.querySelector(".stats1");
  if (player.name === "player2") {
    stats = document.querySelector(".stats2");
  }

  let miniBoats = stats.querySelectorAll(".mini-boat");
  miniBoats.forEach((miniBoat) => {
    miniBoat.remove();
  });

  player.gameboard.ships.forEach((ship) => {
    let miniBoat = document.createElement("div");
    for (let i = 0; i < ship.length; i++) {
      let miniBoatPart = document.createElement("div");
      miniBoatPart.classList.add("mini-boat-part");
      if (ship.isSunk()) {
        miniBoatPart.classList.add("sunk");
      } else {
        miniBoatPart.classList.add("notsunk");
      }
      miniBoat.append(miniBoatPart);
    }

    miniBoat.classList.add("mini-boat");

    stats.append(miniBoat);
  });
}

export function paintCoordinates(player, board) {
  cleanCoordinates();
  player.gameboard.ships.forEach((ship) => {
    ship.coordinates.forEach((coordinate) => {
      const x = coordinate[0];
      const y = coordinate[1];
      const coordinateXElem = board.querySelector(`#Row${player.name}${y}`);
      const coordinateYElem = coordinateXElem.querySelector(
        `#Col${player.name}${x}`
      );
      coordinateYElem.classList.add("coordinate-painted");
    });
  });
}

export function showStatistics(player) {
  const missedAttacksElement = document.querySelector(
    `.${player.name}-missed-attacks`
  );
  const missedCoordinatesElement = document.querySelector(
    `.${player.name}-missed-coordinates`
  );
  missedAttacksElement.textContent =
    "Missed attacks: " + player.gameboard.missedAttacks;
  missedCoordinatesElement.textContent =
    "Missed coordinates: " + player.gameboard.missedCoordinates;
}

export function randomCoordinate(player) {
  let x = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
  let y = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);

  let coordinate = JSON.stringify([x, y]);
  while (JSON.stringify(player.gameboard.allAttacks).includes(coordinate)) {
    x = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    y = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    coordinate = JSON.stringify([x, y]);
  }
  return [x, y];
}
