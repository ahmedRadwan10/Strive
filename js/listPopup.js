import {
  overlayDiv,
  createListDiv,
  validationListName,
  listNameInput,
} from "./script.js";


export function chooseListTheme(themes, theme) {
  themes.forEach((th) => {
        th.classList.remove(`selected-theme`);
    });
    theme.classList.add(`selected-theme`);
    return theme.getAttribute(`data-theme`);
}

export function clearListPopupValues() {
  listNameInput.value = "";
}

export function showListPopup() {
  overlayDiv.classList.add("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(1)";
}

export function hideListPopup() {
  overlayDiv.classList.remove("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(0)";
  validationListName.style.transform = "scale(0)";
}

export function showListValidationText() {
  if (listNameInput.value === "") {
    validationListName.style.transform = "scale(1)";
  } else {
    validationListName.style.transform = "scale(0)";
  }
}
