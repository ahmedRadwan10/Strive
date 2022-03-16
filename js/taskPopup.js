import {
    overlayDiv,
    createTaskDiv,
    validationTaskName,
    taskNameElement,
    taskDateElement,
  } from "./script.js";

  export function choosePriority(priorities, priority) {
    priorities.forEach((prty) => {
        prty.classList.remove(`selected-priority`);
    });
    priority.classList.add(`selected-priority`);
    return priority.getAttribute(`data-priority`);
  }
  
  export function showTaskPopup() {
    overlayDiv.classList.add("overlay-active");
    createTaskDiv.style.transform = "translate(-50%,-50%) scale(1)";
  }
  
  export function hideTaskPopup() {
    overlayDiv.classList.remove("overlay-active");
    createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";
    validationTaskName.style.transform = "scale(0)";
  }
  export function clearTaskPopupValues() {
    taskNameElement.value = "";
    taskDateElement.value = "";
  }
  
  export function showTaskValidationText() {
    if (taskNameElement.value === "") {
      validationTaskName.style.transform = "scale(1)";
    } else {
      validationTaskName.style.transform = "scale(0)";
    }
  }
