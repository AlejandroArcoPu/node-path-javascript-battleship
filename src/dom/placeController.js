import Player from "../classes/Player.js";
import { display, notDisplay, createBoard, paintCoordinates } from "./utils.js";
import {
  playControllerComputer,
  playControllerTwoPlayers,
} from "./playController.js";

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
    paintCoordinates(player1, board);
  });

  playButton.addEventListener("click", () => {
    if (!playButton.disabled) {
      playControllerComputer(player1);
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
    paintCoordinates(player2, board);
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
    paintCoordinates(player1, board);
  });

  player2Button.addEventListener("click", () =>
    placeControllerTwoPlayerSecond(player1)
  );
}

export { placeControllerComputer, placeControllerTwoPlayerFirst };
