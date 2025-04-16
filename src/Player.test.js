import Player from "./Player";
describe("Player", () => {
  let player;
  beforeEach(() => {
    player = new Player();
  });
  test("it should return type of human by default", () => {
    expect(player.type).toBe("human");
  });

  test("it should throw an error if the type of player is not human or computer", () => {
    expect(() => (new Player().type = "dog")).toThrow("Invalid type");
  });
});
