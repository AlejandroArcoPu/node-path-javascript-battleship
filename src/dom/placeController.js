import Player from "../classes/Player.js";
import { GAMEBOARD_SIZE_MAX } from "../classes/Gameboard.js";
import { display, notDisplay, createBoard, placeCoordinates } from "./utils.js";
import {
  playControllerComputer,
  playControllerTwoPlayers,
} from "./playController.js";

function validBoardPlace(length, event, position, player, shipId) {
  if ([...event.target.classList].includes("draggable")) {
    return false;
  }
  let result = null;
  let coordinateX = Number(event.target.id.match(/\d+/)[0][1]);
  let coordinateY = Number(event.target.parentNode.id.match(/\d+/)[0][1]);
  let ship = player.gameboard.ships.find((ship) => ship.id === shipId);
  let coordinates = player.gameboard.generateCoordinatesBasedOnInit(
    [coordinateX, coordinateY],
    ship
  );
  let isValidCoordinate = player.gameboard.areValidCoordinates(
    coordinates,
    player.gameboard.ships.filter((ship) => shipId !== ship.id)
  );
  if (position === "horizontal") {
    result =
      coordinateX <= GAMEBOARD_SIZE_MAX + 1 - length && isValidCoordinate;
  } else {
    result = coordinateY >= length - 1 && isValidCoordinate;
  }
  return result;
}

function initDrag(event, player) {
  if ([...event.target.classList].includes("draggable")) {
    let dragged = event.target;
    let shipId = event.target.id;
    let initialX = event.target.offsetLeft;
    let initialY = event.target.offsetTop;
    let length = event.target.getAttribute("length");
    let position = event.target.getAttribute("position");

    const columnBoards = document.querySelectorAll(".column-board");
    columnBoards.forEach((column) => {
      column.addEventListener("mouseover", (event) => {
        event.preventDefault();
        if (dragged) {
          dragged.style.top = `${event.target.offsetTop}px`;
          dragged.style.left = `${event.target.offsetLeft}px`;
          dragged.style.zIndex = "-1"; // to get the column where we do the up
          if (validBoardPlace(length, event, position, player, shipId)) {
            dragged.classList.add("valid");
            dragged.classList.remove("invalid");
          } else {
            dragged.classList.add("invalid");
            dragged.classList.remove("valid");
          }
        }
      });
      column.addEventListener("mouseup", (event) => {
        event.preventDefault();
        if (dragged) {
          if (validBoardPlace(length, event, position, player, shipId)) {
            event.target.append(dragged);
            const endY = event.target.parentNode.id.match(/\d+/)[0][1];
            const endX = event.target.id.match(/\d+/)[0][1];
            const coordinate = [endX, endY];
            player.gameboard.placeShip(
              player.gameboard.getShipById(shipId),
              coordinate
            );
          } else {
            dragged.style.left = `${initialX}px`;
            dragged.style.top = `${initialY}px`;
          }
          dragged.classList.remove("invalid");
          dragged.classList.remove("valid");

          dragged.style.zIndex = "2";
          dragged = null;
          initialX = null;
          initialY = null;
          length = null;
          position = null;
        }
      });
    });
  }
}

function placeControllerComputer() {
  notDisplay(".mode");
  display(".place");

  let player1 = new Player("player1", "human");
  const board = document.querySelector(".board");
  createBoard(board, player1);

  const randomizeButton = document.querySelector(".randomize-button");
  const playButton = document.querySelector(".play-button");

  randomizeButton.addEventListener("click", () => {
    playButton.disabled = false;
    player1.gameboard.placeRandomShips();
    placeCoordinates(player1, board);
    const sourcesDrag = document.querySelectorAll(".draggable");
    sourcesDrag.forEach((draggable) => {
      draggable.addEventListener("mousedown", (event) =>
        initDrag(event, player1)
      );
    });
  });

  playButton.addEventListener("click", () => {
    if (!playButton.disabled) {
      playControllerComputer(player1);
      // sourcesDrag.forEach((draggable) => {
      //   draggable.removeEventListener()
      // }) remove event listener of drag
    }
  });
}

function placeControllerTwoPlayerSecond(player1) {
  notDisplay(".place1");
  display(".place2");

  let player2 = new Player("player2", "human");
  const board = document.querySelector(".board2-place");
  createBoard(board, player2);

  const randomizeButton = document.querySelector(".randomize-place2-button");
  const play2Button = document.querySelector(".play2-button");

  randomizeButton.addEventListener("click", () => {
    play2Button.disabled = false;
    player2.gameboard.placeRandomShips();
    placeCoordinates(player2, board);
    const sourcesDrag = document.querySelectorAll(".draggable");
    sourcesDrag.forEach((draggable) => {
      draggable.addEventListener("mousedown", (event) =>
        initDrag(event, player2)
      );
    });
  });

  play2Button.addEventListener("click", () =>
    playControllerTwoPlayers(player1, player2)
  );
}

function placeControllerTwoPlayerFirst() {
  notDisplay(".mode");
  display(".place1");

  let player1 = new Player("player1", "human");
  const board = document.querySelector(".board1-place");
  createBoard(board, player1);

  const randomizeButton = document.querySelector(".randomize-place1-button");
  const player2Button = document.querySelector(".player2-button");

  randomizeButton.addEventListener("click", () => {
    player2Button.disabled = false;
    player1.gameboard.placeRandomShips();
    placeCoordinates(player1, board);
    const sourcesDrag = document.querySelectorAll(".draggable");
    sourcesDrag.forEach((draggable) => {
      draggable.addEventListener("mousedown", (event) =>
        initDrag(event, player1)
      );
    });
  });

  player2Button.addEventListener("click", () =>
    placeControllerTwoPlayerSecond(player1)
  );
}

export { placeControllerComputer, placeControllerTwoPlayerFirst };
