import {
    overlayDiv,
    createTaskDiv,
    validationTaskName,
    taskNameElement,
    taskDateElement,
    taskDescElement,
    newList
  } from "./script.js";

  export function choosePriority(priorities, priority) {
    priorities.forEach((prty) => {
        prty.classList.remove(`selected-priority`);
    });
    priority.classList.add(`selected-priority`);
    return priority.getAttribute(`data-priority`);
  }
  
export function showTaskPopup() {
    newList.style.display = "none";
    overlayDiv.classList.add("overlay-active");
    createTaskDiv.style.transform = "translate(-50%,-50%) scale(1)";
  }
  
export function hideTaskPopup() {
    newList.style.display = "block";
    overlayDiv.classList.remove("overlay-active");
    createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";
    validationTaskName.style.transform = "scale(0)";
  }
  export function clearTaskPopupValues() {
    taskNameElement.value = "";
    taskDescElement.value = "";
    taskDateElement.value = "";
  }
  
  export function showTaskValidationText() {
    if (taskNameElement.value === "") {
      validationTaskName.style.transform = "scale(1)";
    } else {
      validationTaskName.style.transform = "scale(0)";
    }
  }
