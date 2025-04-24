import "./styles.css";
import {
  placeControllerComputer,
  placeControllerTwoPlayerFirst,
} from "./modules/placeController";

const placeButton = document.querySelector(".place-button");

function getModeSelected() {
  const inputsMode = document.querySelectorAll('input[name="mode"]');
  const arrayMode = [...inputsMode];
  const inputModeChecked = arrayMode.find((input) => input.checked);
  const gameMode = inputModeChecked.value;
  return gameMode;
}

placeButton.addEventListener("click", () => {
  const gameMode = getModeSelected();
  if (gameMode === "computer") {
    placeControllerComputer();
  } else {
    placeControllerTwoPlayerFirst();
  }
});
