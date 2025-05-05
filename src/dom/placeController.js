import Player from "../classes/Player.js";
import { GAMEBOARD_SIZE_MAX } from "../classes/Gameboard.js";
import {
  display,
  notDisplay,
  createBoard,
  placeCoordinates,
  addBoardNumbers,
  removeChild,
} from "./utils.js";
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
      column.addEventListener("touchmove", (event) => {
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
      column.addEventListener("touchend", (event) => {
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

function randomCoordinates(player, board, playButton) {
  playButton.disabled = false;
  player.gameboard.placeRandomShips();
  placeCoordinates(player, board);
  const sourcesDrag = document.querySelectorAll(".draggable");
  sourcesDrag.forEach((draggable) => {
    draggable.addEventListener("touchstart", (event) =>
      initDrag(event, player)
    );
  });
}

function placeControllerComputer() {
  removeChild(".board");
  notDisplay(".mode");
  display(".place");

  let player1 = new Player("player1", "human");
  const board = document.querySelector(".board");
  createBoard(board, player1);
  addBoardNumbers(board);

  const randomizeButton = document.querySelector(".randomize-button");
  const playButton = document.querySelector(".play-button");

  function handleRandomizeClick() {
    randomCoordinates(player1, board, playButton);
  }

  function handlePlayClick() {
    randomizeButton.removeEventListener("click", handleRandomizeClick);
    playControllerComputer(player1);
    playButton.removeEventListener("click", handlePlayClick);
  }

  randomizeButton.addEventListener("click", handleRandomizeClick);
  playButton.addEventListener("click", handlePlayClick);
}

function placeControllerTwoPlayerSecond(player1) {
  removeChild(".board1-place");
  removeChild(".board2-place");

  notDisplay(".place1");
  display(".place2");

  let player2 = new Player("player2", "human");
  const board = document.querySelector(".board2-place");
  createBoard(board, player2);
  addBoardNumbers(board);

  const randomizeButton = document.querySelector(".randomize-place2-button");
  const play2Button = document.querySelector(".play2-button");

  function handleRandomizeClick() {
    randomCoordinates(player2, board, play2Button);
  }

  randomizeButton.addEventListener("click", handleRandomizeClick);

  function handlePlayClick() {
    randomizeButton.removeEventListener("click", handleRandomizeClick);
    playControllerTwoPlayers(player1, player2);
    play2Button.removeEventListener("click", handlePlayClick);
  }

  play2Button.addEventListener("click", handlePlayClick);
}

function placeControllerTwoPlayerFirst() {
  notDisplay(".mode");
  display(".place1");

  let player1 = new Player("player1", "human");
  const board = document.querySelector(".board1-place");
  createBoard(board, player1);
  addBoardNumbers(board);

  const randomizeButton = document.querySelector(".randomize-place1-button");
  const player2Button = document.querySelector(".player2-button");

  function handleRandomizeClick() {
    randomCoordinates(player1, board, player2Button);
  }

  randomizeButton.addEventListener("click", handleRandomizeClick);

  function handlePlayer2Click() {
    randomizeButton.removeEventListener("click", handleRandomizeClick);
    placeControllerTwoPlayerSecond(player1);
    player2Button.removeEventListener("click", handlePlayer2Click);
  }

  player2Button.addEventListener("click", handlePlayer2Click);
}

export { placeControllerComputer, placeControllerTwoPlayerFirst };
