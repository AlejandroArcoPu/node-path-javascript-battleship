import Gameboard from "./Gameboard";
import Ship from "./Ship";
describe("Gameboard", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
    jest.restoreAllMocks();
  });

  test("it should return 10 boats at the init", () => {
    expect(gameboard.ships.length).toBe(10);
  });

  test("it should return a valid random boats coordinates", () => {
    gameboard.placeRandomShips();
    expect(gameboard.ships.length).toBe(10);
  });

  test("it should throw an error if coordinates are not board size", () => {
    let inputCases = [[[0, 10]], [[-1, 0]]];
    inputCases.forEach((input) => {
      expect(() => gameboard.placeShip(gameboard.ships[0], input)).toThrow(
        "Invalid coordinates"
      );
    });
  });

  test("it should throw an error if coordinates are not in the valid distance", () => {
    gameboard.placeShip(gameboard.ships[0], [[0, 9]]);
    expect(() => gameboard.placeShip(gameboard.ships[1], [[1, 9]])).toThrow();
  });

  test("it should set new coordinates if they are valid", () => {
    let inputCases = [
      { ship: 0, coordinates: [[0, 9]] },
      { ship: 1, coordinates: [[2, 9]] },
      {
        ship: 9,
        coordinates: [
          [6, 1],
          [6, 2],
          [6, 3],
          [6, 4],
        ],
      },
    ];

    inputCases.forEach((input) => {
      gameboard.placeShip(gameboard.ships[input.ship], input.coordinates);
      expect(gameboard.ships[input.ship].coordinates).toEqual(
        input.coordinates
      );
    });
  });

  test("it should increase missed attacks/missed coordinates/all attacks in case of failed attack", () => {
    gameboard.receiveAttack([0, 9]);
    expect(gameboard.missedAttacks).toBe(1);
    expect(gameboard.allAttacks).toEqual([[0, 9]]);
    expect(gameboard.missedCoordinates).toEqual([[0, 9]]);
  });

  test("it should receive attacks to a ship", () => {
    const ship = gameboard.ships[0];
    const spy = jest.spyOn(ship, "hit");
    gameboard.placeShip(ship, [[1, 9]]);
    gameboard.receiveAttack([1, 9]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("it should return falsy if all sunk at the beginning", () => {
    expect(gameboard.allSunk()).toBeFalsy();
  });

  test("it should return truthy if all are sunk", () => {
    for (let i = 0; i < gameboard.ships.length; i++) {
      for (let j = 0; j < gameboard.ships[i].length; j++) {
        gameboard.ships[i].hit();
      }
    }
    expect(gameboard.allSunk()).toBeTruthy();
  });
});
