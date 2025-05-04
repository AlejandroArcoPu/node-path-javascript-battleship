import Ship from "./Ship.js";

const GAMEBOARD_SIZE_MIN = 0;
export const GAMEBOARD_SIZE_MAX = 9;
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
    this._allreceivedattacks = [];
    this._ships = this.createInitialShips();
  }

  getShipById(id) {
    let result = this._ships.find((ship) => ship.id === id);
    return result;
  }

  get allAttacks() {
    return this._allreceivedattacks;
  }

  set allAttacks(coordinate) {
    this._allreceivedattacks.push(coordinate);
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

  calcDistance(coordinate1, coordinate2) {
    const x = coordinate1[0] - coordinate2[0];
    const y = coordinate1[1] - coordinate2[1];
    return Math.sqrt(x * x + y * y);
  }

  plainCoordinates(ships) {
    const plainCoordinates = new Set();
    ships.forEach((ship) => {
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

  randomCoordinates(ship) {
    let newCoordinates = [];
    let orientation = Math.round(Math.random());
    let x = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    let y = Math.floor(Math.random() * GAMEBOARD_SIZE_MAX + 1);
    ship.orientation = orientation === 0 ? "vertical" : "horizontal";
    for (let i = 0; i < ship.length; i++) {
      if (orientation === 0) {
        newCoordinates.push([x, y - i]);
      } else {
        newCoordinates.push([x + i, y]);
      }
    }
    return newCoordinates;
  }

  isInTheBoardSize(newCoordinates) {
    return newCoordinates.every(
      (newCoordinate) =>
        newCoordinate[0] <= GAMEBOARD_SIZE_MAX &&
        newCoordinate[0] >= GAMEBOARD_SIZE_MIN &&
        newCoordinate[1] <= GAMEBOARD_SIZE_MAX &&
        newCoordinate[1] >= GAMEBOARD_SIZE_MIN
    );
  }

  isAtSafeDistance(newCoordinates, currentCoordinates) {
    return newCoordinates.every((newCoordinate) => {
      return [...currentCoordinates].every((currentCoordinate) => {
        let coordinateAsArray = JSON.parse(currentCoordinate);
        let distance = this.calcDistance(newCoordinate, coordinateAsArray);
        return distance >= 2;
      });
    });
  }

  areValidCoordinates(newCoordinates, currentCoordinates) {
    let plainCoordinates = this.plainCoordinates(currentCoordinates);
    return (
      this.isInTheBoardSize(newCoordinates) &&
      this.isAtSafeDistance(newCoordinates, plainCoordinates)
    );
  }

  placeRandomShips() {
    let newRandomShips = [];
    let attempts = 0;
    const MAX_TRIES = 30;
    for (let i = 0; i < BOATS_MAP.length; i++) {
      for (let j = 0; j < BOATS_MAP[i].quantity; j++) {
        attempts = 0;
        let newShip = new Ship(BOATS_MAP[i].length);
        let newCoordinates = this.randomCoordinates(newShip);
        while (
          !this.areValidCoordinates(newCoordinates, newRandomShips) &&
          attempts < MAX_TRIES
        ) {
          newCoordinates = this.randomCoordinates(newShip);
          attempts++;
        }
        if (attempts === MAX_TRIES) {
          i = 0;
          j = -1;
          newRandomShips = [];
        } else {
          newShip.coordinates = newCoordinates;
          newRandomShips.push(newShip);
        }
      }
    }
    this._ships = newRandomShips;
  }

  generateCoordinatesBasedOnInit(coordinate, ship) {
    let coordinates = [];
    let coordinateX = Number(coordinate[0]);
    let coordinateY = Number(coordinate[1]);

    for (let i = 0; i < ship.length; i++) {
      if (ship.orientation === "horizontal") {
        coordinates.push([coordinateX + i, coordinateY]);
      } else {
        coordinates.push([coordinateX, coordinateY - i]);
      }
    }
    return coordinates;
  }

  placeShip(ship, coordinate) {
    let coordinates = this.generateCoordinatesBasedOnInit(coordinate, ship);
    let newShips = [...this._ships];
    let filteredShips = newShips.filter((newShip) => newShip.id !== ship.id);
    if (!this.areValidCoordinates(coordinates, filteredShips)) {
      throw new Error("Invalid coordinates");
    }
    ship.coordinates = coordinates;
    filteredShips.push(ship);
    this._ships = filteredShips;
  }

  receiveAttack(coordinate) {
    let attackedShip = this._ships.find((ship) =>
      ship.coordinates.find(
        (c) => c[0] === coordinate[0] && c[1] === coordinate[1]
      )
    );
    if (!attackedShip) {
      let oldMissedAttacks = this.missedAttacks;
      oldMissedAttacks++;
      this.missedAttacks = oldMissedAttacks;
      this.missedCoordinates = coordinate;
    } else {
      attackedShip.hit();
    }
    this.allAttacks = coordinate;
  }

  allSunk() {
    return this._ships.every((ship) => ship.hits === ship.length);
  }
}
export default Gameboard;
