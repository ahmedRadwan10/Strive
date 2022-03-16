import { sortListTasks, listDraggedOver } from "./list.js";
import { lists, taskNameElement, taskDateElement, priorities, submitTaskButton, reload, listsContainer } from "./script.js";
import { choosePriority, showTaskPopup } from "./taskPopup.js";

export class Task {
    constructor(id, name, date, priority) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.priority = priority;
    }
    edit(name, date, priority) {
        this.name = name;
        this.date = date;
        this.priority = priority;
    }
}

export function insertTask(listObj, taskName, taskDate, taskPriority) {
    listObj.addTask(taskName, taskDate, taskPriority)
    displayTasks(listObj);
    sortListTasks(listObj.id)
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
          <h4>${taskObj.name}</h4>
          <button class="options-btn"><i class="fas fa-ellipsis-h"></i></button>
          </div>
          <div class="span-container">
          <span class="priority" style="background-color:${
            taskObj.priority
          }"></span>
          <span class="date">${taskObj.date ? taskObj.date : "no-date"}</span>
          </div>
          <div class="options">
          <button class="edit-task-button">
          Edit<i class="far fa-edit"></i> 
          </button>
          <button class="duplicate-task-button">
          Duplicate<i class="far fa-clone"></i>
          </button>
          <button class="delete-task-button">
          Delete<i class="fas fa-trash-alt"></i> 
          </button>
          </div>
          `;
    document.querySelector(`#${listId}`).appendChild(taskDiv);

    let optionsBtn = taskDiv.querySelector(".options-btn");
    optionsBtn.onclick = () => {
         taskDiv.lastElementChild.style.transform = "scale(1)";
    }

    let editTaskBtn = taskDiv.querySelector(".edit-task-button");
    editTaskBtn.onclick = () => {
        taskNameElement.value = taskObj.name;
        taskDateElement.value = taskObj.date;
        let priorityElement = document.querySelector(`[data-priority=${taskObj.priority}]`)
        choosePriority(priorities, priorityElement)
        submitTaskButton.textContent = "Save";
        showTaskPopup();
        listObjToEditTask = listObj;
        taskIndexToEdit = taskIndex;
    }

    let duplicateTaskBtn = taskDiv.querySelector(".duplicate-task-button");
    duplicateTaskBtn.onclick = () => {
        listObj.duplicateTask(taskId);
        sortListTasks(listObj.id)
        window.localStorage.setItem("lists", JSON.stringify(lists));
        reload();
    }

    let deleteTaskBtn = taskDiv.querySelector(".delete-task-button");
    deleteTaskBtn.onclick = () => {
        listObj.deleteTask(taskId);
        window.localStorage.setItem("lists", JSON.stringify(lists));
        reload();
    }


    taskDiv.ondragstart = () => {
        taskIdDragged = taskDiv.id;
        taskDraggedFrom = taskDiv.parentElement.id;
    }

    taskDiv.ondragover = (e) => {
        e.preventDefault();
    }

    taskDiv.ondragend = () => {
        if (taskDraggedFrom !== listDraggedOver) {
            dropTaskToNewList();
        }
    }

}
export function updateTask(taskPriority) {
    let taskObj = listObjToEditTask.tasks[taskIndexToEdit];
    taskObj.edit(
        taskNameElement.value,
        taskDateElement.value,
        taskPriority
    )
    sortListTasks(listObjToEditTask.id)
    window.localStorage.setItem("lists", JSON.stringify(lists));
    reload();
}

export function checkValidDate() {
  let currentDate = new Date();
  let tempLists = JSON.parse(window.localStorage.getItem("lists"));
  tempLists.forEach((list) => {
    list.tasks.forEach((task) => {
      let comparedDate = new Date(
        task.date.slice(0, 4),
        task.date.slice(5, 7) - 1,
        task.date.slice(8, 10)
      );
      if (currentDate > comparedDate && task.date !== "") {
        document
          .querySelector(`#${task.id}`)
          .querySelector(".date")
          .classList.add("not-valid");
        if (
          currentDate.getDate() === comparedDate.getDate() &&
          currentDate.getMonth() === comparedDate.getMonth() &&
          currentDate.getFullYear() === comparedDate.getFullYear()
        ) {
          document
            .querySelector(`#${task.id}`)
            .querySelector(".date")
            .classList.remove("not-valid");
        }
      } else {
        document
          .querySelector(`#${task.id}`)
          .querySelector(".date")
          .classList.remove("not-valid");
      }
    });
  });
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
  });
  oldList.tasks.forEach((t, i) => {
    if (t.id === taskIdDragged) {
      oldList.tasks.splice(i, 1);
      newList.tasks.push(t);
      sortListTasks(listDraggedOver);
    }
  });
  //[4] update local storage.
  window.localStorage.setItem("lists", JSON.stringify(lists));
  //[5] refresh the page.
  reload();
}



