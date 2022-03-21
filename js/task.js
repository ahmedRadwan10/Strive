import { sortListTasks, listDraggedOver } from "./list.js";
import {
  lists,
  taskNameElement,
  taskDateElement,
  priorities,
  submitTaskButton,
  reload,
  taskDescElement,
} from "./script.js";
import { choosePriority, showTaskPopup } from "./taskPopup.js";

export class Task {
  constructor(id, name, desc, date, priority, hidden = false) {
    this.id = id;
    this.name = name;
    this.description = desc;
    this.date = date;
    this.priority = priority;
    this.hidden = hidden;
  }
  edit(name, desc, date, priority) {
    this.name = name;
    this.description = desc;
    this.date = date;
    this.priority = priority;
  }
  getDateObj() {
    return new Date(
      this.date.slice(0, 4),
      this.date.slice(5, 7) - 1,
      this.date.slice(8, 10)
    );
  }
}

export function insertTask(listObj, taskName, taskDesc, taskDate, taskPriority) {
  listObj.addTask(taskName, taskDesc, taskDate, taskPriority);
  displayTasks(listObj);
  sortListTasks(listObj.id);
  window.localStorage.setItem("lists", JSON.stringify(lists));
  reload();
}

let listObjToEditTask;
let taskIndexToEdit;
let taskIdDragged;
let taskDraggedFrom;
export function displayTasks(listObj, taskID = listObj.generateIdFromDate()) {
  let taskId = taskID;
  let listId = listObj.id;
  let taskIndex = listObj.findTaskIndex(taskId);
  let taskObj = listObj.tasks[taskIndex];

  let taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.id = `${taskId}`;
  taskDiv.draggable = "true";
  taskDiv.innerHTML = `
          <div class="header">
          <h4>${taskObj.name.length > 17 ? taskObj.name.slice(0, 17) + " ..." : taskObj.name}</h4>
          <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
          </div>
          <div class="span-container">
          <span class="priority" style="background-color:${
            taskObj.priority
          }"></span>
          <span class="date">${taskObj.date}</span>
          </div>
          <div class="options">
          <button class="hide-task-button">
          Hide<i class="fa-solid fa-eye-slash"></i>
          </button>
          <button class="duplicate-task-button">
          Duplicate<i class="far fa-clone"></i>
          </button>
          <button class="delete-task-button">
          Delete<i class="fas fa-trash-alt"></i> 
          </button>
          </div>
          <div class="line-before"></div>
          <div class="line-after"></div>
          `;
  if (taskObj.date === "") taskDiv.querySelector(".date").remove()
  if (taskObj.hidden === false) document.querySelector(`#${listId}`).querySelector(".shown-tasks").appendChild(taskDiv);
  if (taskObj.hidden === true) {
    document.querySelector(`#${listId} .hidden-tasks .tasks`).appendChild(taskDiv);
    document.querySelector(`#${taskObj.id} .options .hide-task-button`).innerHTML = 'Show<i class="fa-solid fa-eye"></i>'
  }

  let optionsBtn = taskDiv.querySelector(".options-btn");
  optionsBtn.onclick = () => {
    taskDiv.querySelector(".options").style.transform = "scale(1)";
  };

  let hideTaskBtn = taskDiv.querySelector(".hide-task-button");
  hideTaskBtn.onclick = () => {
    if (!taskObj.hidden) {
      listObj.hideTask(taskId);
      window.localStorage.setItem("lists", JSON.stringify(lists));
      reload();
    } else {
      listObj.showTask(taskId);
      window.localStorage.setItem("lists", JSON.stringify(lists));
      reload();
    }
  };
  let duplicateTaskBtn = taskDiv.querySelector(".duplicate-task-button");
  duplicateTaskBtn.onclick = () => {
    listObj.duplicateTask(taskId);
    sortListTasks(listObj.id);
    window.localStorage.setItem("lists", JSON.stringify(lists));
    reload();
  };

  let deleteTaskBtn = taskDiv.querySelector(".delete-task-button");
  deleteTaskBtn.onclick = () => {
    listObj.deleteTask(taskId);
    window.localStorage.setItem("lists", JSON.stringify(lists));
    reload();
  };

  taskDiv.querySelector(".header h4").onclick = () => {
    taskNameElement.value = taskObj.name;
    taskDescElement.value = taskObj.description;
    taskDateElement.value = taskObj.date;
    let priorityElement = document.querySelector(
      `[data-priority=${taskObj.priority}]`
    );
    choosePriority(priorities, priorityElement);
    submitTaskButton.textContent = "Save";
    showTaskPopup();
    listObjToEditTask = listObj;
    taskIndexToEdit = taskIndex;
  };

  taskDiv.ondragstart = () => {
    taskIdDragged = taskDiv.id;
    taskDraggedFrom = taskDiv.parentElement.parentElement.id;
  };

  taskDiv.ondragover = (e) => {
    e.preventDefault();
  };

  taskDiv.ondragend = () => {
    if (taskDraggedFrom !== listDraggedOver) {
      dropTaskToNewList();
    }
  };
}
export function updateTask() {
  let taskObj = listObjToEditTask.tasks[taskIndexToEdit];
  let currentPriority = document.querySelector(".selected-priority").getAttribute("data-priority");
  taskObj.edit(taskNameElement.value, taskDescElement.value, taskDateElement.value, currentPriority);
  sortListTasks(listObjToEditTask.id);
  window.localStorage.setItem("lists", JSON.stringify(lists));
  reload();
}

export function checkValidDate() {
  let currentDate = new Date();
  lists.forEach((list) => {
    list.tasks.forEach((task) => {
      let comparedDate = task.getDateObj();
      if (currentDate > comparedDate && task.date !== "") {
        document
          .querySelector(`#${task.id} .date`).classList.add("not-valid");
        if (
          currentDate.getDate() === comparedDate.getDate() &&
          currentDate.getMonth() === comparedDate.getMonth() &&
          currentDate.getFullYear() === comparedDate.getFullYear()
        ) {
          document
            .querySelector(`#${task.id} .date`).classList.remove("not-valid");
        }
      }
    });
  });
}

function dropTaskToNewList() {
  let newList;
  let oldList;
  lists.forEach((list) => {
    if (list.id === listDraggedOver) newList = list;
    if (list.id === taskDraggedFrom) oldList = list;
  });
  oldList.tasks.forEach((t, i) => {
    if (t.id === taskIdDragged) {
      oldList.tasks.splice(i, 1);
      newList.tasks.push(t);
      sortListTasks(listDraggedOver);
    }
  });
  //update local storage.
  window.localStorage.setItem("lists", JSON.stringify(lists));
  //refresh the DOM.
  reload();
}


export { taskIdDragged, taskDraggedFrom };