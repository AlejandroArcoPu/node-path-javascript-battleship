import Ship from "./Ship.js";

describe("Ship", () => {
  let length = 4;
  let ship;
  beforeEach(() => {
    ship = new Ship(length);
  });

  test("it should store length when valid", () => {
    expect(ship.length).toBe(length);
  });

  test("it should return error when length is lower than 0 or greater than 4", () => {
    let inputs = [() => new Ship(-1), () => new Ship(5), () => new Ship(0)];
    inputs.forEach((input) => expect(input).toThrow("Invalid length"));
  });

  test("it should return hits when calling getter hits", () => {
    expect(ship.hits).toBe(0);
  });

  test("it should increase hits when calling hit function", () => {
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("it should return false if hit < length", () => {
    expect(ship.isSunk()).toBeFalsy();
  });

  test("it should return true if hit is equal to length", () => {
    for (let i = 0; i < length; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBeTruthy();
  });

  test("it should has same number of coordinates than length", () => {
    expect(ship.coordinates.length).toBe(ship.length);
  });

  test("it should throw an error if we pass more or less coordinates than length of the ship", () => {
    let inputs = [
      () => (new Ship(1).coordinates = []),

      () => (new Ship(2).coordinates = [[0, 1]]),
      () =>
        (new Ship(2).coordinates = [
          [0, 1],
          [0, 2],
          [0, 3],
        ]),
    ];
    inputs.forEach((input) =>
      expect(input).toThrow("Invalid length of coordinates")
    );
  });

  test("it should throw error if the new coordinates has a difference of more or less than 1", () => {
    let inputs = [
      () =>
        // same values
        (new Ship(2).coordinates = [
          [0, 1],
          [0, 1],
        ]),
      () =>
        // in diagonal
        (new Ship(2).coordinates = [
          [1, 1],
          [2, 2],
        ]),
      () =>
        // greater than 1 the difference
        (new Ship(3).coordinates = [
          [0, 1],
          [1, 1],
          [1, 4],
        ]),
    ];

    inputs.forEach((input) => {
      expect(input).toThrow("Invalid coordinates");
    });
  });

  test("it should set coordinates when they are consecutive and not in diagonal", () => {
    ship.coordinates = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ];
    expect(ship.coordinates).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ]);
  });

  test("it should return orientation", () => {
    expect(ship.orientation).toBe("horizontal");
  });

  test("it should set orientation", () => {
    ship.orientation = "vertical";
    expect(ship.orientation).toBe("vertical");
  });

  test("it should throw an error if orientation is not horizontal or vertical", () => {
    expect(() => (ship.orientation = "diagonal")).toThrow();
  });

  test("it should return a good to string", () => {
    expect(ship.toString()).toBe(
      `Ship: { length: ${ship.length}, hits: ${ship.hits}, orientation: ${ship.orientation}, coordinates: [ ${ship.coordinates}] }`
    );
  });
});
