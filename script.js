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
const loadingBullets = document.querySelector(".loading");

let lists = [];
window.onload = () => {
  reload();
};

function reload() {
  lists = JSON.parse(window.localStorage.getItem("lists")) || [];
  hideEmptyPageText();
  loadingBullets.style.display = "none";
  if (lists.length) {
    dispalyDataFromLocalStorage();
  } else {
    showEmptyPageText();
  }
  // setTimeout(function () {
  //   loadingBullets.style.display = "none";
  //   if (lists.length) {
  //     dispalyDataFromLocalStorage();
  //   } else {
  //     showEmptyPageText();
  //   }
  // }, 1500);
}

function updateLocalStorage() {
  window.localStorage.setItem("lists", JSON.stringify(lists));
}

document.onmouseup = () => {
  document.querySelectorAll(".options").forEach((option) => {
    option.style.transform = "scale(0)";
  });
};

function dispalyDataFromLocalStorage() {
  lists.forEach((list) => {
    dispalyList(list);
    list.tasks.forEach((task) => {
      displayTasks(list, task);
    });
  });
}

function dispalyList(listObj) {
  let list = document.createElement("div");
  list.className = "list";
  list.id = `${listObj.id}`;
  list.setAttribute("ondragover", "listDragOver(event, this)");
  list.innerHTML = `
  <div class="header">
  <h4 style="color:#${listObj.themeColorCode}">${listObj.name}</h4>
  <div class="icons">
  <button class="new-task-button"
  onclick="addTask(this)" title="Add new task">+</button>
  <button class="delete-list-button"
  onclick="deleteList(this)" title="Delete list">
  <i class="fas fa-trash-alt"></i>
  </button>
  </div>
  </div>
  `;
  listsContainer.appendChild(list);
}

function displayTasks(list, task) {
  let taskId = task.id;
  let listId = list.id;

  let taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.id = `${taskId}`;
  taskDiv.draggable = "true";
  taskDiv.setAttribute("ondragstart", "taskDragStart(this)");
  taskDiv.setAttribute("ondragover", "taskDragOver(event,this)");
  taskDiv.setAttribute("ondragleave", "taskDragLeave(this)");
  taskDiv.setAttribute("ondrop", "taskDroppedOn(this)");
  taskDiv.setAttribute("ondragend", "taskDragEnd(this)");

  taskDiv.innerHTML = `
        <div class="header">
        <h4>${task.taskName}</h4>
        <button onclick="showOptionsPopup(this)"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="span-container">
        <span class="priority" style="background-color:${
          task.taskPriority
        }"></span>
        <span class="date">${task.taskDate ? task.taskDate : "no-date"}</span>
        </div>
        <div class="options">
        <button class="edit-task-button"
        onclick="editTask(this)">
        Edit<i class="far fa-edit"></i> 
        </button>
        <button class="duplicate-task-button"
        onclick="duplicateTask(this)">
        Duplicate<i class="far fa-clone"></i>
        </button>
        <button class="delete-task-button" onclick="deleteTask(this)">
        Delete<i class="fas fa-trash-alt"></i> 
        </button>
        </div>
        `;
  document.querySelector(`#${listId}`).appendChild(taskDiv);
}

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
  for (let i in colors) {
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

function sortListTasks(listId) {
  lists.forEach((list) => {
    if (list.id === listId) {
      let greenTasks = [];
      let orangeTasks = [];
      let redTasks = [];
      list.tasks.forEach((task) => {
        if (task.taskPriority === "green") greenTasks.push(task);
        if (task.taskPriority === "orange") orangeTasks.push(task);
        if (task.taskPriority === "red") redTasks.push(task);
      });
      // console.log(redTasks, orangeTasks, greenTasks)
      list.tasks = [...redTasks, ...orangeTasks, ...greenTasks];
      // console.log(list)
    }
  });
}

createListButton.onclick = () => {
  createList(listNameInput.value);
};

function createList(name) {
  if (name === "") {
    showListValidationText();
    return;
  }
  hideEmptyPageText();
  addToListsContainer(name, listTheme);
  hideListPopup();
  clearListPopupValues();
}

function generateIdFromDate() {
  let formatedDate = Date().slice(0, 24).split(" ").join("");
  return formatedDate.replaceAll(":", "");
}

function addToListsContainer(name, theme) {
  let listId = generateIdFromDate();
  let list = document.createElement("div");
  list.className = "list";
  list.id = `${listId}`;
  list.setAttribute("ondragover", "listDragOver(event, this)");
  list.innerHTML = `
  <div class="header">
  <h4 style="color:#${theme}">${name}</h4>
  <div class="icons">
  <button class="new-task-button"
  onclick="addTask(this)" title="Add new task">+</button>
  <button class="delete-list-button"
  onclick="deleteList(this)" title="Delete list">
  <i class="fas fa-trash-alt"></i>
  </button>
  </div>
  </div>
  `;
  listsContainer.appendChild(list);
  lists.push({
    id: listId,
    name: name,
    themeColorCode: theme,
    tasks: [],
  });
  updateLocalStorage();
}
let listDraggedOver;
function listDragOver(e, listDiv) {
  e.preventDefault();
  listDraggedOver = listDiv.getAttribute("id");
}
let listIdToAddTask;
function addTask(btn) {
  listIdToAddTask = btn.parentElement.parentElement.parentElement.id;
  submitTaskButton.textContent = "Create";
  document.querySelector(".task-popup-h3").textContent = "Creating your task";
  showTaskPopup();
}

function deleteList(btn) {
  let listId = btn.parentElement.parentElement.parentElement.id;
  document.querySelector(`#${listId}`).remove();
  if (listsContainer.innerText === "") {
    showEmptyPageText();
  }
  lists.forEach((list, i) => {
    if (list.id === listId) lists.splice(i, 1);
  });
  updateLocalStorage();
}

submitTaskButton.onclick = () => {
  if (submitTaskButton.textContent === "Update") {
    updateTask();
  } else {
    createTask();
  }
};

function createTask() {
  if (taskNameElement.value === "") {
    showTaskValidationText();
    return;
  }
  let taskId = generateIdFromDate();
  let listId = listIdToAddTask;

  let taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.id = `${taskId}`;
  taskDiv.draggable = "true";
  taskDiv.setAttribute("ondragstart", "taskDragStart(this)");
  taskDiv.setAttribute("ondragover", "taskDragOver(event,this)");
  taskDiv.setAttribute("ondragleave", "taskDragLeave(this)");
  taskDiv.setAttribute("ondrop", "taskDroppedOn(this)");
  taskDiv.setAttribute("ondragend", "taskDragEnd(this)");

  taskDiv.innerHTML = `
        <div class="header">
        <h4>${taskNameElement.value}</h4>
        <button onclick="showOptionsPopup(this)"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="span-container">
        <span class="priority" style="background-color:${taskPriority}"></span>
        <span class="date">${
          taskDateElement.value ? taskDateElement.value : "no-date"
        }</span>
        </div>
        <div class="options">
        <button class="edit-task-button"
        onclick="editTask(this)">
        Edit<i class="far fa-edit"></i> 
        </button>
        <button class="duplicate-task-button"
        onclick="duplicateTask(this)">
        Duplicate<i class="far fa-clone"></i>
        </button>
        <button class="delete-task-button" onclick="deleteTask(this)">
        Delete<i class="fas fa-trash-alt"></i> 
        </button>
        </div>
        `;
  document.querySelector(`#${listId}`).appendChild(taskDiv);
  lists.forEach((list) => {
    if (list.id === listId) {
      list.tasks.push({
        id: taskId,
        taskName: taskNameElement.value,
        taskDate: taskDateElement.value,
        taskPriority: taskPriority,
      });
    }
  });
  sortListTasks(listId);
  updateLocalStorage();
  listsContainer.innerHTML = ""
  reload();
  hideTaskPopup();
  clearTaskPopupValues();
}

let taskIdDragged;
let taskDraggedFrom;
function taskDragStart(taskDiv) {
  taskIdDragged = taskDiv.getAttribute("id");
  taskDraggedFrom = taskDiv.parentElement.id;
}

function taskDragOver(e, taskDiv) {
  e.preventDefault();
  taskDiv.classList.add("drag-over");
}

function taskDragLeave(taskDiv) {
  taskDiv.classList.remove("drag-over");
}

let taskIdDroppedOn;
function taskDroppedOn(taskDiv) {
  taskIdDroppedOn = taskDiv.getAttribute("id");
}

function taskDragEnd(taskDiv) {
  document.querySelectorAll(".task").forEach((task) => {
    task.classList.remove("drag-over");
  });
  if (taskDraggedFrom !== listDraggedOver) {
    dropTaskToNewList();
  }
}

function dropTaskToNewList() {
  //[1] add dragged task to listDraggedOver.
  let newList = document.querySelector(`#${listDraggedOver}`);
  let oldList = document.querySelector(`#${taskDraggedFrom}`);
  let task = document.querySelector(`#${taskIdDragged}`);
  newList.appendChild(task);
  //[2] remove dragged task from old list.
  oldList.remove(task);
  //[3] update lists.
  lists.forEach((list) => {
    if (list.id === listDraggedOver) newList = list;
    if (list.id === taskDraggedFrom) oldList = list;
  })
  oldList.tasks.forEach((t, i) => {
    if (t.id === taskIdDragged) {
      oldList.tasks.splice(i, 1)
      newList.tasks.push(t)
      sortListTasks(listDraggedOver)
    } 
  })
  //[4] update local storage.
  updateLocalStorage();
  //[5] refresh the page.
  listsContainer.innerHTML = ""
  reload();
}

function updateTask() {
  if (taskNameElement.value === "") return;

  let taskObj = findTask(taskToEdit.id);
  taskToEdit.querySelector("h4").innerHTML = taskNameElement.value;
  taskToEdit.querySelector(".date").innerHTML = taskDateElement.value
    ? taskDateElement.value
    : "no-date";
  taskToEdit
    .querySelector(".priority")
    .setAttribute("style", `background-color:${taskPriority}`);

  taskObj.taskName = taskNameElement.value;
  taskObj.taskDate = taskDateElement.value;
  taskObj.taskPriority = taskPriority;
  sortListTasks(taskToEdit.parentElement.id);
  updateLocalStorage();
  listsContainer.innerHTML = ""
  reload();
  hideTaskPopup();
  clearTaskPopupValues();
}

function deleteTask(btn) {
  // find task id
  let taskId = btn.parentElement.parentElement.id;
  document.querySelector(`#${taskId}`).remove();
  lists.forEach((list) => {
    list.tasks.forEach((t, i) => {
      if (t.id === taskId) list.tasks.splice(i, 1);
    });
  });
  updateLocalStorage();
}

function findTask(taskId) {
  let taskObj;
  lists.forEach((list) => {
    list.tasks.forEach((t) => {
      if (t.id === taskId) taskObj = t;
    });
  });
  return taskObj;
}

function duplicateTask(btn) {
  let taskId = btn.parentElement.parentElement.id;
  listIdToAddTask = document.querySelector(`#${taskId}`).parentElement.id;
  let taskObj = findTask(taskId);
  taskNameElement.value = taskObj.taskName;
  taskDateElement.value = taskObj.taskDate;
  taskPriority = taskObj.taskPriority;
  createTask();
}

let taskToEdit;
function editTask(btn) {
  submitTaskButton.textContent = "Update";
  document.querySelector(".task-popup-h3").textContent = "Edit Task";
  let taskId = btn.parentElement.parentElement.id;
  taskToEdit = document.querySelector(`#${taskId}`);
  let taskObj = findTask(taskId);

  taskNameElement.value = taskObj.taskName;
  taskDateElement.value = taskObj.taskDate;
  taskPriority = taskObj.taskPriority;
  priorities.forEach((priority) => {
    let dataPriority = priority.getAttribute("data-priority");
    if (dataPriority === taskPriority) {
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
    showEmptyPageText();
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

function showOptionsPopup(btn) {
  let taskId = btn.parentElement.parentElement.id;
  document.querySelector(`#${taskId}`).lastElementChild.style.transform =
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
