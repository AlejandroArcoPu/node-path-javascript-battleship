const BOAT_SIZE_MIN = 1;
const BOAT_SIZE_MAX = 4;
const BOAT_ORIENTATION = ["vertical", "horizontal"];

class Ship {
  constructor(length) {
    if (length < BOAT_SIZE_MIN || length > BOAT_SIZE_MAX) {
      throw new Error("Invalid length");
    }
    this._length = length;
    this._hits = 0;
    this._orientation = "horizontal";
    this._coordinates = this.initCoordinates();
  }

  initCoordinates() {
    let initCoordinates = [];
    for (let i = 0; i < this._length; i++) {
      initCoordinates.push([1, i]);
    }
    return initCoordinates;
  }

  get orientation() {
    return this._orientation;
  }

  set orientation(orientation) {
    if (!BOAT_ORIENTATION.includes(orientation)) {
      throw new Error("Invalid orientation");
    }
    this._orientation = orientation;
  }

  get length() {
    return this._length;
  }

  get coordinates() {
    return this._coordinates;
  }

  set coordinates(coordinates) {
    if (coordinates.length !== this._length) {
      throw new Error("Invalid length of coordinates");
    }

    let increasingCoordinates = coordinates.every((elem, idx, array) => {
      if (!idx) return true;
      let prev = array[idx - 1];
      let prevRow = prev[0];
      let prevCol = prev[1];
      let row = elem[0];
      let col = elem[1];
      return (
        row + col - (prevRow + prevCol) === 1 &&
        (prevRow === row || prevCol === col)
      );
    });
    if (!increasingCoordinates) {
      throw new Error("Invalid coordinates");
    }
    this._coordinates = coordinates;
  }

  get hits() {
    return this._hits;
  }

  set hits(hits) {
    this._hits = hits;
  }

  hit() {
    this._hits++;
  }

  isSunk() {
    return this._length === this._hits;
  }

  toString() {
    let output =
      "Ship: { length: " +
      this._length +
      ", hits: " +
      this.hits +
      ", orientation: " +
      this._orientation +
      ", coordinates: [ ";

    this._coordinates.forEach((coordinate, idx) => {
      if (idx === this._coordinates.length - 1) {
        output += coordinate;
      } else {
        output += coordinate + ",";
      }
    });
    output += "] }";
    return output;
  }
}

export default Ship;
