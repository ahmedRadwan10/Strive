import { Task, taskIdDragged, taskDraggedFrom } from "./task.js";
import { lists, listsContainer, submitTaskButton } from "./script.js";
import { showTaskPopup } from "./taskPopup.js";
import { showEmptyPageText } from "./emptyPageText.js";

export class List {
  constructor(name, color, id = this.generateIdFromDate(), tasks = []) {
    this.id = id;
    this.name = name;
    this.themeCode = color;
    this.tasks = tasks;
  }
  generateIdFromDate() {
    let formatedDate = Date().slice(0, 24).split(" ").join("");
    return formatedDate.replaceAll(":", "");
  }
  addTask(name, date, priority) {
    this.tasks.push(new Task(this.generateIdFromDate(), name, date, priority));
  }
  findTaskIndex(taskId) {
    let taskIndex;
    this.tasks.forEach((task, i) => {
      if (task.id === taskId) taskIndex = i;
    });
    return taskIndex;
  }
  deleteTask(taskId) {
    let taskIndex = this.findTaskIndex(taskId);
    this.tasks.splice(taskIndex, 1);
  }
  hideTask(taskId) {
    let taskIndex = this.findTaskIndex(taskId);
    let taskObj = this.tasks[taskIndex];
    taskObj.hidden = true;
  }
  showTask(taskId) {
    let taskIndex = this.findTaskIndex(taskId);
    let taskObj = this.tasks[taskIndex];
    taskObj.hidden = false;
  }
  duplicateTask(taskId) {
    let taskIndex = this.findTaskIndex(taskId);
    let taskObj = this.tasks[taskIndex];
    this.tasks.push(
      new Task(
        this.generateIdFromDate(),
        taskObj.name,
        taskObj.date,
        taskObj.priority
      )
    );
  }
  static find(listId) {
    let listIndex;
    lists.forEach((list, i) => {
      if (list.id === listId) listIndex = i;
    });
    return listIndex;
  }
}

export function insertList(listObj) {
  lists.push(listObj);
  window.localStorage.setItem("lists", JSON.stringify(lists));
  displayList(listObj);
}

let listIdToAddTask;
let listDraggedOver;
export function displayList(listObj) {
  let list = document.createElement("div");
  list.className = "list";
  list.id = `${listObj.id}`;
  list.innerHTML = `
    <div class="header">
    <h4 style="color:#${listObj.themeCode}">${listObj.name}</h4>
    <div class="icons">
    <button class="new-task-button"
     title="Add new task" data-list-id="${listObj.id}">+</button>
    <button class="delete-list-button"
     title="Delete list" data-list-id="${listObj.id}">
    <i class="fas fa-trash-alt"></i>
    </button>
    </div>
    </div>
    <div class="shown-tasks"></div>
    <div class="hidden-tasks">
    <div class="hidden-tasks-header">
    <p>Hidden</p>
    <div><img class="show-and-hide" src="/images/eye.png" alt="hide"><span class="hidden-number">0</span></div>
    </div>
    <div class="tasks"></div>
    </div>
    `;
  listsContainer.appendChild(list);
  let numOfHidden = 0;
    listObj.tasks.forEach((task) => {
      if (task.hidden === true) {
        numOfHidden++;
      }
    })
    list.querySelector(".hidden-number").innerHTML = numOfHidden;
  if (numOfHidden > 0) {
    list.querySelector(".show-and-hide").style.transform = "scale(1)"
  }
  let addTaskBtn = list.querySelector(".new-task-button");
  addTaskBtn.onclick = () => {
    showTaskPopup();
    listIdToAddTask = listObj.id;
    submitTaskButton.textContent = "Add";
  };

  let deleteListBtn = list.querySelector(".delete-list-button");
  deleteListBtn.onclick = () => {
    list.remove();
    if (!listsContainer.innerHTML) showEmptyPageText();
    let listIndex = List.find(listObj.id);
    lists.splice(listIndex, 1);
    window.localStorage.setItem("lists", JSON.stringify(lists));
  };
  let showAndHideBtn = list.querySelector(".show-and-hide");
  let show = true;
  showAndHideBtn.onclick = () => {
    if (show) {
      list.querySelector(".hidden-tasks .tasks").style.display = "block";
      list.querySelector(".show-and-hide").src = "./images/visibility.png"
      show = false;
    } else {
      list.querySelector(".hidden-tasks .tasks").style.display = "none";
      list.querySelector(".show-and-hide").src = "./images/eye.png"
      show = true;
    }
  };

  list.ondragover = (e) => {
    e.preventDefault();
    listDraggedOver = list.id;
    showTheLine(list.id);
  };
}

function showTheLine(listId) {
  let taskElements = document.querySelectorAll(".tasks .task");
  taskElements.forEach((taskElement) => {
    taskElement.querySelector(".line-after").style.transform = "scale(0)";
    taskElement.querySelector(".line-before").style.transform = "scale(0)";
  });

  let listIndex = List.find(listId);
  let listObj = lists[listIndex];

  let listIndexOfDraggedT = List.find(taskDraggedFrom);
  let listObjOfDraggedT = lists[listIndexOfDraggedT];

  let draggedTaskIndex = listObjOfDraggedT.findTaskIndex(taskIdDragged);
  let draggedTaskObj = listObjOfDraggedT.tasks[draggedTaskIndex]
  let draggedTaskPriority = draggedTaskObj.priority;

  if (listId !== taskDraggedFrom) {
    let samePriorityTasks = [draggedTaskObj];
    listObj.tasks.forEach((task) => {
      if (task.priority === draggedTaskPriority) {
        samePriorityTasks.push(task)
      }
    });
    if (listObj.tasks.length === 0) return;
    if (samePriorityTasks.length === 1) {
      if (draggedTaskObj.priority === "red") {
        document.querySelector(`#${listObj.tasks[0].id}`).querySelector(".line-before").style.transform = "scale(1)"
        return;
      }
      if (draggedTaskObj.priority === "orange") {
        let redTasks = [];
        let greenTasks = [];
        listObj.tasks.forEach((task) => {
          if (task.priority === "red") redTasks.push(task);
          if (task.priority === "green") greenTasks.push(task);
        })
        if (redTasks.length > 0) {
          document.querySelector(`#${redTasks[redTasks.length - 1].id}`).querySelector(".line-after").style.transform = "scale(1)"
          return;
        }
        if (greenTasks.length > 0) {
          document.querySelector(`#${greenTasks[0].id}`).querySelector(".line-before").style.transform = "scale(1)"
          return;
        }
      }
      if (draggedTaskObj.priority === "green") {
        document.querySelector(`#${listObj.tasks.at(-1).id}`).querySelector(".line-after").style.transform = "scale(1)"
        return;
      }
    }
  
    let samePriorityTasksSorted = bubbleSort(samePriorityTasks)
    // task index after sorting the samePriorityTasks.
    if (samePriorityTasksSorted.length > 1) {   
      samePriorityTasksSorted.forEach((task, i) => {
        if (task.id === draggedTaskObj.id) {
          if (i !== 0) {
            document.querySelector(`#${samePriorityTasksSorted[i - 1].id}`).querySelector(".line-after").style.transform = "scale(1)"
          }
          if (i === 0 && samePriorityTasksSorted[i + 1].date === draggedTaskObj.date) {
            document.querySelector(`#${samePriorityTasksSorted[i + 1].id}`).querySelector(".line-after").style.transform = "scale(1)"
          }
          if (i === 0 && samePriorityTasksSorted[i + 1].date !== draggedTaskObj.date) {
            document.querySelector(`#${samePriorityTasksSorted[i + 1].id}`).querySelector(".line-before").style.transform = "scale(1)"
          }
        }
      })
    }
  }
}
  


export function sortListTasks(listId) {
  let greenTasks = [];
  let orangeTasks = [];
  let redTasks = [];
  lists.forEach((list) => {
    if (list.id === listId) {
      list.tasks.forEach((task) => {
          if (task.priority === "green") greenTasks.push(task)
          if (task.priority === "orange") orangeTasks.push(task)
          if (task.priority === "red") redTasks.push(task)
      })
      list.tasks = [...bubbleSort(redTasks), ...bubbleSort(orangeTasks), ...bubbleSort(greenTasks)];
    }
  });
}

// Sort tasks based on DATE.
function bubbleSort(arr){
  let noSwaps;
  for(let i = arr.length; i > 0; i--){
    noSwaps = true;
    for (let j = 0; j < i - 1; j++){
      let currentDate = new Date(
        arr[j].date.slice(0, 4),
        arr[j].date.slice(5, 7) - 1,
        arr[j].date.slice(8, 10)
      );
      let comparedDate = new Date(
        arr[j+1].date.slice(0, 4),
        arr[j+1].date.slice(5, 7) - 1,
        arr[j+1].date.slice(8, 10)
      );
      if (currentDate > comparedDate) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
        noSwaps = false;         
      }
    }
    if(noSwaps) break;
  }
  let counter = 0; 
  arr.forEach((el) => {
    if (el.date === "") counter++;
  })
  if (counter === 0) return arr;
  else return [...arr.slice(counter), ...arr.slice(0, counter)];
}

export { listIdToAddTask, listDraggedOver };
