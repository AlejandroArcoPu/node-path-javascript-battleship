import Gameboard from "./Gameboard";

const TYPE_PLAYERS = ["computer", "human"];

class Player {
  constructor() {
    this._type = "human";
    this._gameboard = new Gameboard();
  }

  get type() {
    return this._type;
  }

  set type(type) {
    if (!TYPE_PLAYERS.includes(type)) {
      throw new Error("Invalid type");
    }
    this._type = type;
  }

  get gameboard() {
    return this._gameboard;
  }
}

export default Player;
