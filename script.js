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

const createTaskButton = document.querySelector(".create-task");

const emptyPageText = document.querySelector(".empty-page");

const closeListPopup = document.querySelector('[data-list-close]')


let listTheme = "ffbd35";
function chooseTheme(theme) {
  for (let i = 0; i < themes.length; i++) {
    if (themes[i].classList.value.includes("selected-theme")) {
      themes[i].classList.remove("selected-theme");
      theme.classList.add("selected-theme");
      return theme.getAttribute("data-theme");
    }
  }
}

themes.forEach((theme) => {
  theme.addEventListener("click", () => {
    listTheme = chooseTheme(theme);
  });
});

let taskPriority = "green";
function choosePriority(priority) {
  for (let i = 0; i < priorities.length; i++) {
    if (priorities[i].classList.value.includes("selected-priority")) {
      priorities[i].classList.remove("selected-priority");
      priority.classList.add("selected-priority");
      return priority.getAttribute("data-priority");
    }
  }
}

priorities.forEach((priority) => {
  priority.addEventListener("click", () => {
    taskPriority = choosePriority(priority);
  });
});

createListButton.addEventListener("click", () => {
  createList(listNameInput.value);
});

let listIndex = 0;
function createList(name) {
  if (name === "") return;

  emptyPageText.style.transform = "translate(-50%,-50%) scale(0)";

  listsContainer.innerHTML += `
  <div class="list" id="list${++listIndex}">
  <div class="header">
  <h4 style="color:#${listTheme}">${name}</h4>
  <div class="icons">
  <button class="new-task-button" data-list-id="list${listIndex}" onclick="showPopupTask(this)" title="Add new task">+</button>
  <button class="delete-list-button" data-list-id="list${listIndex}" onclick="deleteList(this)" title="Delete list">
  <i class="fas fa-trash-alt"></i>
  </button>
  </div>
  </div>
  </div>
  `;
  overlayDiv.classList.remove("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(0)";
  listNameInput.value = "";

  setDefaultColor(themes)
  listTheme = "ffbd35";
}

let deleteListId;
function deleteList(btn) {
  deleteListId = btn.getAttribute("data-list-id");
  document.querySelector(`#${deleteListId}`).remove();
  if (listsContainer.innerText === "") {
    emptyPageText.style.transform = "translate(-50%,-50%) scale(1)";
  }
}

let listId;
function showPopupTask(clickedBtn) {
  createTaskButton.innerText = "Create"
  document.querySelector('.task-popup-h3').innerText = 'Creating your task'
  listId = clickedBtn.getAttribute("data-list-id");
  overlayDiv.classList.add("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(1)";
}

createTaskButton.addEventListener("click", () => {
  createTask();
});

function updateTask() {
  document.querySelector(`#${editedTaskId}`).innerHTML = `
  <div class="header">
  <h4>${taskNameElement.value}</h4>
  <div class="icons">
  <button class="edit-task-button"
  data-task-id="${editedTaskId}" 
  data-task-date="${taskDateElement.value}"
  data-task-name="${taskNameElement.value}"
  data-task-priority="${taskPriority}"
  onclick="editTask(this)" title="Edit task">
  <i class="far fa-edit"></i>
  </button>
  <button class="delete-task-button" data-task-id="${editedTaskId}" onclick="deleteTask(this)" title="Delete task">
  <i class="fas fa-trash-alt"></i>
  </button>
  </div>
  </div>
  <div class="span-container">
  <span style="background-color:${taskPriority}"></span>
  <span class="date">${taskDateElement.value}</span>
  </div>
  `
  taskNameElement.value = ''
  taskDateElement.value = ''
  setDefaultColor(priorities)
  taskPriority = "green";
  
  overlayDiv.classList.remove("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";
}

let taskIndex = 0;
function createTask() {
 
  if (createTaskButton.innerText === "Update") {
    updateTask()
    return
  }

  if (taskNameElement.value === "" || taskDateElement.value === "") return;

  document.querySelector(`#${listId}`).innerHTML += `
    <div class="task" id="task${++taskIndex}">
    <div class="header">
    <h4>${taskNameElement.value}</h4>
    <div class="icons">
    <button class="edit-task-button"
    data-task-id="task${taskIndex}" 
    data-task-date="${taskDateElement.value}"
    data-task-name="${taskNameElement.value}"
    data-task-priority="${taskPriority}"
    onclick="editTask(this)" title="Edit task">
    <i class="far fa-edit"></i>
    </button>
    <button class="delete-task-button" data-task-id="task${taskIndex}" onclick="deleteTask(this)" title="Delete task">
    <i class="fas fa-trash-alt"></i>
    </button>
    </div>
    </div>
    <div class="span-container">
    <span style="background-color:${taskPriority}"></span>
    <span class="date">${taskDateElement.value}</span>
    </div>
    `;
  overlayDiv.classList.remove("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";

  taskNameElement.value = ""
  taskDateElement.value = ""

  setDefaultColor(priorities)
  taskPriority = "green";
}

let deleteTaskId;
function deleteTask(btn) {
  deleteTaskId = btn.getAttribute("data-task-id");
  document.querySelector(`#${deleteTaskId}`).remove();
}

let editedTaskId
function editTask(btn) {
  editedTaskId = btn.getAttribute("data-task-id");
  let taskName = btn.getAttribute("data-task-name");
  let taskDate = btn.getAttribute("data-task-date");
  let taskPriorityColor = btn.getAttribute("data-task-priority");
  
  createTaskButton.innerText = "Update"
  document.querySelector('.task-popup-h3').innerText = 'Edit Task'
  taskNameElement.value = taskName
  taskDateElement.value = taskDate
  taskPriority = taskPriorityColor

  priorities.forEach((priority) => {
    let dataPriority = priority.getAttribute('data-priority')
    if (dataPriority === taskPriorityColor) {
      priority.classList.add('selected-priority')
    } else {
      priority.classList.remove('selected-priority')
    }
  })

  console.log(editedTaskId,taskDate,taskName,taskPriorityColor)

  overlayDiv.classList.add("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(1)";
}

closeTaskPopup.addEventListener("click", () => {
  overlayDiv.classList.remove("overlay-active");
  createTaskDiv.style.transform = "translate(-50%,-50%) scale(0)";
  taskNameElement.value = ""
  taskDateElement.value = ""

  setDefaultColor(priorities)
  taskPriority = "green";
});

closeListPopup.addEventListener("click", () => {
  if (listsContainer.innerText === "") {
    emptyPageText.style.transform = "translate(-50%,-50%) scale(1)";
  }
  overlayDiv.classList.remove("overlay-active");
  createListDiv.style.transform = "translate(-50%,-50%) scale(0)";
  ListNameElement.value = ""

  setDefaultColor(themes)
  listTheme = "ffbd35";
});

function setDefaultColor(colors) {
  let typeOfColors = 'theme'
  if (colors === themes) {
  } else {
    typeOfColors = 'priority'
  }
  colors.forEach((color, index) => {
    if (index === 0) {
      color.classList.add(`selected-${typeOfColors}`);
    } else {
      color.classList.remove(`selected-${typeOfColors}`);
    }
  });
}

newList.addEventListener("click", () => {
    overlayDiv.classList.add("overlay-active");
    createListDiv.style.transform = "translate(-50%,-50%) scale(1)";
});