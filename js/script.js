import { List, displayList, insertList, listIdToAddTask, updateList } from "./list.js";
import { Task, insertTask, displayTasks, updateTask, checkValidDate } from "./task.js";
import { hideEmptyPageText, showEmptyPageText } from "./emptyPageText.js";
import {
  hideTaskPopup,
  choosePriority,
  clearTaskPopupValues,
  showTaskValidationText,
} from "./taskPopup.js";
import {
  showListPopup,
  hideListPopup,
  chooseListTheme,
  clearListPopupValues,
  showListValidationText,
} from "./listPopup.js";

// Global

export const listNameInput = document.querySelector("[data-list-name]");
export const themes = document.querySelectorAll(".theme");
export const submitListButton = document.querySelector(".create-list");
export const createListDiv = document.querySelector(".create-list-popup");
export const listsContainer = document.querySelector(".lists");
export const overlayDiv = document.querySelector(".overlay");
export const priorities = document.querySelectorAll(".priority");
export const taskNameElement = document.querySelector("[data-task-name]");
export const taskDescElement = document.querySelector("[data-task-desc]");
export const taskDateElement = document.querySelector("[data-task-date]");
export const createTaskDiv = document.querySelector(".create-task-popup");
export const closeTaskPopup = document.querySelector("[data-close]");
export const newList = document.querySelector("[data-new-list]");
export const submitTaskButton = document.querySelector(".create-task");
export const emptyPageText = document.querySelector(".empty-page");
export const closeListPopup = document.querySelector("[data-list-close]");
export const validationListName = document.querySelector(
  ".validation-list-name"
);
export const validationTaskName = document.querySelector(
  ".validation-task-name"
);

let lists = [];

window.onload = () => {
  reload();
};

export function reload() {
  listsContainer.innerHTML = "";
  lists = []
  let stringLists = JSON.parse(window.localStorage.getItem("lists")) || [];
  if (stringLists.length === 0) showEmptyPageText();
  else {
    hideEmptyPageText();
    stringLists.forEach((l) => {
      let list = new List(l.name, l.themeCode, l.id);
      l.tasks.forEach((task) => {
        list.tasks.push(new Task(task.id, task.name, task.description, task.date, task.priority, task.hidden))
      })
      displayList(list);
      l.tasks.forEach((task) => {
        displayTasks(list, task.id)
      })
      lists.push(list)
    })
    checkValidDate();
  }
}

document.onmouseup = () => {
  document.querySelectorAll(".options").forEach((option) => {
    option.style.transform = "scale(0)";
  });
};

// Lists

newList.onclick = () => {
  submitListButton.textContent = "Create"
  showListPopup();
};

closeListPopup.onclick = () => {
  if (listsContainer.innerText === "") {
    showEmptyPageText();
  }
  hideListPopup();
  clearListPopupValues();
};

listNameInput.oninput = () => {
  showListValidationText();
}

let listTheme = "ffbd35";
themes.forEach((theme) => {
  theme.onclick = () => {
    listTheme = chooseListTheme(themes, theme);
  };
});

submitListButton.onclick = () => {
  let listName = listNameInput.value;
  if (listName === "") {
    showListValidationText();
    return;
  }
  if (submitListButton.textContent === "Save") {
    updateList();
  } else {
    hideEmptyPageText();
    insertList(new List(listName, listTheme));
    hideListPopup();
    clearListPopupValues();
}
};

// Tasks

closeTaskPopup.onclick = () => {
  hideTaskPopup();
  clearTaskPopupValues();
};

  let taskPriority = "green";
  priorities.forEach((priority) => {
    priority.onclick = () => {
      taskPriority = choosePriority(priorities, priority);
    };
  });

  submitTaskButton.onclick = () => {
    if (taskNameElement.value === "") {
      showTaskValidationText();
      return;
    }
    
    if (submitTaskButton.textContent === "Save") {
      updateTask();
    } else {
      let listObj = List.findObjOf(listIdToAddTask);
      insertTask(listObj,
        taskNameElement.value,
        taskDescElement.value,
        taskDateElement.value,
        taskPriority
      );
    }
  
    hideTaskPopup();
    clearTaskPopupValues();
  };

export { lists, taskPriority, listTheme };