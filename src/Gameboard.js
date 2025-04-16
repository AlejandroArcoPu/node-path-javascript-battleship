import Ship from "./Ship.js";

const GAMEBOARD_SIZE_MIN = 0;
const GAMEBOARD_SIZE_MAX = 9;
const BOATS_MAP = [
  { length: 1, quantity: 4 },
  { length: 2, quantity: 3 },
  { length: 3, quantity: 2 },
  { length: 4, quantity: 1 },
];

class Gameboard {
  constructor() {
    this._missedCoordinates = [];
    this._missedAttacks = 0;
    this._ships = this.createInitialShips();
    this._coordinates = this.plainCoordinates();
  }

  get ships() {
    return this._ships;
  }

  set ships(ship) {
    this._ships.push(ship);
  }

  get missedAttacks() {
    return this._missedAttacks;
  }

  set missedAttacks(missedAttacks) {
    this._missedAttacks = missedAttacks;
  }

  get missedCoordinates() {
    return this._missedCoordinates;
  }

  set missedCoordinates(coordinate) {
    this._missedCoordinates.push(coordinate);
  }

  plainCoordinates() {
    const plainCoordinates = new Set();
    this._ships.forEach((ship) => {
      ship.coordinates.forEach((coordinate) =>
        plainCoordinates.add(JSON.stringify(coordinate))
      );
    });
    return plainCoordinates;
  }

  createInitialShips() {
    let initialShips = [];
    for (let i = 0; i < BOATS_MAP.length; i++) {
      for (let j = 0; j < BOATS_MAP[i].quantity; j++) {
        initialShips.push(new Ship(BOATS_MAP[i].length));
      }
    }
    return initialShips;
  }

  allSunk() {}

  placeShip(ship, coordinates) {}

  placeRandomShips() {
    let newRandomShips = [];
    let copyOfShips = [...this._ships];
    copyOfShips.forEach((ship) => {});
    this._ships = newRandomShips;
  }

  receiveAttack(coordinate) {}

  areValidCoordinates(newCoordinates) {
    return newCoordinates.every((c) => {
      let sumCoordinate = c[0] + c[1];
      return [...this._coordinates].every((coordinate) => {
        let coordinateAsArray = JSON.parse(coordinate);
        let sumCoordinateAsArray = coordinateAsArray[0] + coordinateAsArray[1];
        let result =
          sumCoordinate > sumCoordinateAsArray
            ? sumCoordinate - sumCoordinateAsArray
            : sumCoordinateAsArray - sumCoordinate;
        return result <= 1 ? false : true;
      });
    });
  }

  randomCoordinates(ship, orientation) {
    let newCoordinates = [];
    let x = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    let y = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    for (let i = 0; i < ship.length; i++) {
      if (orientation === "vertical") {
        newCoordinates.push([x, y + i]);
      } else {
        newCoordinates.push([x + i, y]);
      }
    }
    return newCoordinates;
  }
}

// let newGambeboard = new Gameboard();
// console.log(newGambeboard.areValidCoordinates([[0, 9]]));
export default Gameboard;
