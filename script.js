const app = document.querySelector(".app");
const listNameInput = document.querySelector("[data-list-name]");
const themes = document.querySelectorAll(".theme");
const createListButton = document.querySelector(".create-list");
const createListDiv = document.querySelector(".create-list-popup");
const listsContainer = document.querySelector(".lists");
const overlayDiv = document.querySelector(".overlay");
const priorities = document.querySelectorAll(".priority");
const taskNameElement = document.querySelector("[data-task-name]");
const taskDateElement = document.querySelector("[data-task-date]");
const createTaskDiv = document.querySelector(".create-task-popup");
const closeTaskPopup = document.querySelector("[data-close]");
const newList = document.querySelector("[data-new-list]");
const submitTaskButton = document.querySelector(".create-task");
const emptyPageText = document.querySelector(".empty-page");
const closeListPopup = document.querySelector("[data-list-close]");
const validationListName = document.querySelector(".validation-list-name");
const validationTaskName = document.querySelector(".validation-task-name");

function showListValidationText() {
  if (listNameInput.value === "") {
    validationListName.style.transform = "scale(1)";
  } else {
    validationListName.style.transform = "scale(0)";
  }
}

function showTaskValidationText() {
  if (taskNameElement.value === "") {
    validationTaskName.style.transform = "scale(1)";
  } else {
    validationTaskName.style.transform = "scale(0)";
  }
}

function chooseColor(colors, color) {
  let typeOfColors = "theme";
  if (colors === priorities) {
    typeOfColors = "priority";
  }
  for (let i = 0; i < colors.length; i++) {
    if (colors[i].classList.contains(`selected-${typeOfColors}`)) {
      colors[i].classList.remove(`selected-${typeOfColors}`);
      color.classList.add(`selected-${typeOfColors}`);
      return color.getAttribute(`data-${typeOfColors}`);
    }
  }
}

let listTheme = "ffbd35";
themes.forEach((theme) => {
  theme.onclick = () => {
    listTheme = chooseColor(themes, theme);
  };
});

let taskPriority = "green";
priorities.forEach((priority) => {
  priority.onclick = () => {
    taskPriority = chooseColor(priorities, priority);
  };
});

createListButton.onclick = () => {
  createList(listNameInput.value);
};

function createList(name) {
  if (name === "") return;
  hideEmptyPageText()
  addToListsContainer(name, listTheme);
  hideListPopup();
  clearListPopupValues();
}

function generateIdFromDate() {   
  let formatedDate = Date().slice(0, 24).split(" ").join("");
  return formatedDate.replaceAll(':', "");
}

function addToListsContainer(name, theme) {
  let listId = generateIdFromDate()
  listsContainer.innerHTML += `
  <div class="list" id="${listId}">
  <div class="header">
  <h4 style="color:#${theme}">${name}</h4>
  <div class="icons">
  <button class="new-task-button" data-list-id="${listId}"
  onclick="addTask(this)" title="Add new task">+</button>
  <button class="delete-list-button" data-list-id="${listId}"
  onclick="deleteList(this)" title="Delete list">
  <i class="fas fa-trash-alt"></i>
  </button>
  </div>
  </div>
  </div>
  `;
}

let listIdToAddTask;
function addTask(clickedBtn) {
  submitTaskButton.textContent = "Create";
  document.querySelector(".task-popup-h3").textContent = "Creating your task";
  listIdToAddTask = clickedBtn.getAttribute("data-list-id");
  showTaskPopup();
}


function deleteList(btn) {
  let listIdToDelete = btn.getAttribute("data-list-id");
  document.querySelector(`#${listIdToDelete}`).remove();
  if (listsContainer.innerText === "") {
    showEmptyPageText()
  }
}


submitTaskButton.onclick = () => {
  if (submitTaskButton.textContent === "Update") {
    updateTask();
  } else {
    createTask();
  }
};

function updateTask() {
  if (taskNameElement.value === "") return;
  
  let taskId = document.querySelector(`#${ToEditTaskId}`)
  
  taskId.children[0].firstElementChild.textContent = `${taskNameElement.value}`;
  taskId.children[1].lastElementChild.textContent = `${
    taskDateElement.value ? taskDateElement.value : "no-date"
  }`;
  taskId.children[1].firstElementChild.style.backgroundColor = `${taskPriority}`;
  taskId.children[2].children[0].setAttribute(
    "data-task-date",
    `${taskDateElement.value}`
    );
    taskId.children[2].children[0].setAttribute(
      "data-task-name",
      `${taskNameElement.value}`
      );
      taskId.children[2].children[0].setAttribute(
        "data-task-priority",
        `${taskPriority}`
        );
        hideTaskPopup();
        clearTaskPopupValues();
      }
      
      function createTask() {
        if (taskNameElement.value === "") return;
        let taskId = generateIdFromDate()
        document.querySelector(`#${listIdToAddTask}`).innerHTML += `
        <div class="task" id="${taskId}">
        <div class="header">
        <h4>${taskNameElement.value}</h4>
        <button data-task-id="${taskId}" onclick="showOptionsPopup(this)"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="span-container">
        <span style="background-color:${taskPriority}"></span>
        <span class="date">${
          taskDateElement.value ? taskDateElement.value : "no-date"
        }</span>
        </div>
        <div class="options">
        <button class="edit-task-button"
        data-task-id="${taskId}" 
        data-task-date="${taskDateElement.value}"
        data-task-name="${taskNameElement.value}"
        data-task-priority="${taskPriority}"
        onclick="editTask(this)">
        Edit<i class="far fa-edit"></i> 
        </button>
        <button class="duplicate-task-button" data-list-id="${listIdToAddTask}" data-task-id="${taskId}"
        onclick="duplicateTask(this)">
        Duplicate<i class="far fa-clone"></i>
        </button>
        <button class="delete-task-button" data-task-id="${taskId}" onclick="deleteTask(this)">
        Delete<i class="fas fa-trash-alt"></i> 
        </button>
        </div>
        </div>
        `;
        
        hideTaskPopup();
        clearTaskPopupValues();
      }
      
function deleteTask(btn) {
  let ToDeleteTaskId = btn.getAttribute("data-task-id");
  document.querySelector(`#${ToDeleteTaskId}`).remove();
}

function duplicateTask(btn) {
  let listId = btn.getAttribute('data-list-id')
  let originalTaskId = btn.getAttribute('data-task-id')
  let originalTask = document.querySelector(`#${originalTaskId}`).outerHTML
  let duplicatedTaskId = generateIdFromDate()
  let duplicatedTask = originalTask.replaceAll(`${originalTaskId}`,`${duplicatedTaskId}`)
  document.querySelector(`#${listId}`).innerHTML += duplicatedTask
} 

let ToEditTaskId;
function editTask(btn) {
  ToEditTaskId = btn.getAttribute("data-task-id");
  submitTaskButton.textContent = "Update";
  document.querySelector(".task-popup-h3").textContent = "Edit Task";
  taskNameElement.value = btn.getAttribute("data-task-name");
  taskDateElement.value = btn.getAttribute("data-task-date");
  taskPriority = btn.getAttribute("data-task-priority");
  priorities.forEach((priority) => {
    let dataPriority = priority.getAttribute("data-priority");
    if (dataPriority === btn.getAttribute("data-task-priority")) {
      priority.classList.add("selected-priority");
    } else {
      priority.classList.remove("selected-priority");
    }
  });
  showTaskPopup();
}

closeTaskPopup.onclick = () => {
  hideTaskPopup();
  clearTaskPopupValues();
};

closeListPopup.onclick = () => {
  if (listsContainer.innerText === "") {
    showEmptyPageText()
  }
  hideListPopup();
  clearListPopupValues();
};

newList.onclick = () => {
  showListPopup();
};

function setDefaultColor(colors) {
  let typeOfColors = "theme";
  if (colors === priorities) {
    typeOfColors = "priority";
  }
  colors.forEach((color, index) => {
    if (index === 0) {
      color.classList.add(`selected-${typeOfColors}`);
    } else {
      color.classList.remove(`selected-${typeOfColors}`);
    }
  });
}

document.onmouseup = () => {
  document.querySelectorAll(".options").forEach((option) => {
    option.style.transform = "scale(0)";
  });
};

function showOptionsPopup(btn) {
  let optionsTaskId = btn.getAttribute("data-task-id");
  document.querySelector(`#${optionsTaskId}`).lastElementChild.style.transform =
    "scale(1)";
}

function clearTaskPopupValues() {
  taskNameElement.value = "";
  taskDateElement.value = "";
  setDefaultColor(priorities);
  taskPriority = "green";
}

function clearListPopupValues() {
  listNameInput.value = "";
  setDefaultColor(themes);
  listTheme = "ffbd35";
}

function showTaskPopup() {
  overlayDiv.classList.add("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(1)";
}

function showListPopup() {
  overlayDiv.classList.add("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(1)";
}

function hideTaskPopup() {
  overlayDiv.classList.remove("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";
  validationTaskName.style.transform = "scale(0)";
}

function hideListPopup() {
  overlayDiv.classList.remove("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(0)";
  validationListName.style.transform = "scale(0)";
}

function hideEmptyPageText() {
  emptyPageText.style.transform = "translate(-50%,-50%) scale(0)";
}

function showEmptyPageText() {
  emptyPageText.style.transform = "translate(-50%,-50%) scale(1)";
}
