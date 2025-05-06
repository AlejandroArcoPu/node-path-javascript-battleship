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
}

export function addBoardNumbers(board) {
  // columns and rows number = 2
  for (let i = 0; i < 2; i++) {
    const numberElements = document.createElement("div");
    if (i === 0) numberElements.classList.add("col-number-elements");
    else numberElements.classList.add("row-number-elements");
    for (let j = 0; j <= GAMEBOARD_SIZE_MAX; j++) {
      const numberElement = document.createElement("div");
      numberElement.textContent = j;
      numberElements.append(numberElement);
      if (i === 0) numberElement.classList.add("row-number");
      else numberElement.classList.add("col-number");
    }
    board.append(numberElements);
  }
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
        miniBoatPart.classList.add("not-sunk");
      }
      miniBoat.append(miniBoatPart);
    }

    miniBoat.classList.add("mini-boat");

    stats.append(miniBoat);
  });
}

function removeElements(cls) {
  document.querySelectorAll(cls).forEach((element) => {
    element.remove();
  });
}

export function removeChild(cls) {
  document.querySelector(cls).innerHTML = "";
}

export function paintCoordinates(player, board) {
  player.gameboard.ships.forEach((ship) => {
    for (let i = 0; i < ship.length; i++) {
      const x1 = ship.coordinates[i][0];
      const y1 = ship.coordinates[i][1];
      const coordinateXElem = board.querySelector(`#Row${player.name}${y1}`);
      const coordinateYElem = coordinateXElem.querySelector(
        `#Col${player.name}${x1}`
      );
      coordinateYElem.classList.add("coordinate-painted");
    }
  });
}

export function placeCoordinates(player, board) {
  removeElements(".draggable");
  player.gameboard.ships.forEach((ship) => {
    for (let i = 0; i < ship.length; i++) {
      const x1 = ship.coordinates[i][0];
      const y1 = ship.coordinates[i][1];
      const coordinateXElem = board.querySelector(`#Row${player.name}${y1}`);
      const coordinateYElem = coordinateXElem.querySelector(
        `#Col${player.name}${x1}`
      );
      const initialSize = coordinateYElem.computedStyleMap().get("width").value;
      if (i === 0) {
        const shipElement = document.createElement("div");
        shipElement.setAttribute("position", ship.orientation);
        shipElement.setAttribute("length", ship.length);
        shipElement.classList.add("draggable");
        shipElement.id = ship.id;
        let width = null;
        let height = null;
        if (ship.orientation === "horizontal") {
          width = initialSize * ship.length;
          shipElement.style.width = `${width}px`;
          shipElement.style.height = `${initialSize}px`;
          shipElement.style.top = `${
            (GAMEBOARD_SIZE_MAX - y1) * initialSize
          }px`;
        } else {
          height = initialSize * ship.length;
          shipElement.style.width = `${initialSize}px`;
          shipElement.style.height = `${height}px`;
          shipElement.style.top = `${
            (GAMEBOARD_SIZE_MAX - y1) * initialSize
          }px`;
        }
        shipElement.style.left = `${x1 * initialSize}px`;
        coordinateYElem.append(shipElement); // include the draggable in the div
      }
    }
  });
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
