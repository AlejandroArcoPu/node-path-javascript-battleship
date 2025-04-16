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

  // test("it should return true if new coordinates of a ship are valid", () => {
  //   expect(
  //     gameboard.areValidCoordinates([
  //       [0, 1],
  //       [0, 2],
  //       [0, 3],
  //     ])
  //   );
  // });

  // test("it should report whether or not all of their ships have been suck", () => {
  //   expect(gameboard.allSunk()).toBeFalsy();
  // });

  //   test("it should place a ship to the proper position", () => {
  //     const ship = new Ship(1);
  //     const spy = jest.spyOn(ship, "coordinate", "set");
  //     gameboard.placeShip(ship, [1, 1]);
  //     expect(spy).toHaveBeenCalled();
  //     expect(gameboard.ships.length).toBe(1);
  //   });

  //   test("it should receive attacks to a ship", () => {
  //     const ship = new Ship(1);
  //     const spy = jest.spyOn(ship, "hit");
  //     gameboard.placeShip(ship, [1, 1]);
  //     gameboard.receiveAttack([1, 1]);
  //     expect(spy).toHaveBeenCalled();
  //   });
  //   test("it should increase missed attacks/coordinates in case of failure", () => {
  //     const ship = new Ship(1);
  //     gameboard.placeShip(ship, [1, 1]);
  //     gameboard.receiveAttack([0, 0]);
  //     expect(gameboard.missedAttacks).toBe(1);
  //     expect(gameboard.missedCoordinates.length).toBe(1);
  //     expect(gameboard.missedCoordinates).toContainEqual([0, 0]);
  //   });
});
