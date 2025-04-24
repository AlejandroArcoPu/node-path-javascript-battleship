import Gameboard from "./Gameboard";

const TYPE_PLAYERS = ["computer", "human"];

class Player {
  constructor(name, type) {
    this._name = name;
    this._type = type;
    this._gameboard = new Gameboard();
  }

  get name() {
    return this._name;
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
