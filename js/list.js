import { Task, taskIdDragged, taskDraggedFrom } from "./task.js";
import { listNameInput, lists, listsContainer, submitTaskButton, themes, listTheme, submitListButton, reload } from "./script.js";
import { showTaskPopup } from "./taskPopup.js";
import { showEmptyPageText } from "./emptyPageText.js";
import { showListPopup, chooseListTheme, hideListPopup} from "./listPopup.js";

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
  addTask(name, desc, date, priority) {
    this.tasks.push(new Task(this.generateIdFromDate(), name, desc, date, priority));
  }
  findTaskIndex(taskId) {
    let taskIndex;
    this.tasks.forEach((task, i) => {
      if (task.id === taskId) taskIndex = i;
    });
    return taskIndex;
  }
  findTaskObj(taskId) {
    let taskObj;
    this.tasks.forEach((task) => {
      if (task.id === taskId) taskObj = task;
    });
    return taskObj;
  }
  deleteTask(taskId) {
    let taskIndex = this.findTaskIndex(taskId);
    this.tasks.splice(taskIndex, 1);
  }
  hideTask(taskId) {
    let taskObj = this.findTaskObj(taskId);
    taskObj.hidden = true;
  }
  showTask(taskId) {
    let taskObj = this.findTaskObj(taskId);
    taskObj.hidden = false;
  }
  duplicateTask(taskId) {
    let taskObj = this.findTaskObj(taskId);
    this.tasks.push(
      new Task(
        this.generateIdFromDate(),
        taskObj.name,
        taskObj.description,
        taskObj.date,
        taskObj.priority
      )
    );
  }
  getRedTasks() {
    let redTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "red") redTasks.push(task);
    })
    return redTasks;
  }
  getOrangeTasks() {
    let orangeTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "orange") orangeTasks.push(task);
    })
    return orangeTasks;
  }
  getGreenTasks() {
    let greenTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "green") greenTasks.push(task);
    })
    return greenTasks;
  }
  shownRedTasks() {
    let shownRedTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "red" && task.hidden === false) shownRedTasks.push(task);
    })
    return shownRedTasks;
  }
  shownOrangeTasks() {
    let shownOrangeTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "orange" && task.hidden === false) shownOrangeTasks.push(task);
    })
    return shownOrangeTasks;
  }
  shownGreenTasks() {
    let shownGreenTasks = [];
    this.tasks.forEach((task) => {
      if (task.priority === "green" && task.hidden === false) shownGreenTasks.push(task);
    })
    return shownGreenTasks;
  }
  getNumOfHiddenTasks() {
    let numOfHidden = 0;
    this.tasks.forEach((task) => {
      if (task.hidden === true) {
        numOfHidden++;
      }
    })
    return numOfHidden;
  }
  edit(listName, listColor) {
    this.name = listName;
    this.themeCode = listColor;
  }
  static findIndexOf(listId) {
    let listIndex;
    lists.forEach((list, i) => {
      if (list.id === listId) listIndex = i;
    });
    return listIndex;
  }
  static findObjOf(listId) {
    let listObj;
    lists.forEach((list) => {
      if (list.id === listId) listObj = list;
    });
    return listObj;
  }
}

export function insertList(listObj) {
  lists.push(listObj);
  window.localStorage.setItem("lists", JSON.stringify(lists));
  displayList(listObj);
}

let listIdToAddTask;
let listDraggedOver;
let listIdToEdit;
export function displayList(listObj) {
  let list = document.createElement("div");
  list.className = "list";
  list.id = `${listObj.id}`;
  list.innerHTML = `
    <div class="header">
    <h4 class="list-name" style="color:#${listObj.themeCode}">${listObj.name.length > 17 ? listObj.name.slice(0, 17) + " ..." : listObj.name}</h4>
    <div class="icons">
    <button class="new-task-button"
     title="Add new task">+</button>
    <button class="delete-list-button"
     title="Delete list">
    <i class="fas fa-trash-alt"></i>
    </button>
    <button class="list-options-button"
     title="List options">
     <i class="fa-solid fa-gear"></i>
    </button>
    </div>
    </div>
    <div class="shown-tasks"></div>
    <div class="hidden-tasks">
    <div class="hidden-tasks-header">
    <p>Hidden</p>
    <div><span class="show-and-hide"><i class="fa-solid fa-eye"></i></span><span class="hidden-number">0</span></div>
    </div>
    <div class="tasks"></div>
    </div>
    `;
  listsContainer.appendChild(list);

  let numOfHidden = listObj.getNumOfHiddenTasks();
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

  let listName = list.querySelector(".list-name");
  listName.onclick = () => {
    listNameInput.value = listObj.name;
    let themeElement = document.querySelector(`[data-theme="${listObj.themeCode}"]`);
    chooseListTheme(themes, themeElement);
    submitListButton.textContent = "Save";
    listIdToEdit = listObj.id;
    showListPopup();
  }

  let deleteListBtn = list.querySelector(".delete-list-button");
  deleteListBtn.onclick = () => {
    list.remove();
    if (!listsContainer.innerHTML) showEmptyPageText();
    let listIndex = List.findIndexOf(listObj.id);
    lists.splice(listIndex, 1);
    window.localStorage.setItem("lists", JSON.stringify(lists));
  };
  let showAndHideBtn = list.querySelector(".show-and-hide");
  let show = true;
  showAndHideBtn.onclick = () => {
    if (show) {
      list.querySelector(".hidden-tasks .tasks").style.display = "block";
      list.querySelector(".show-and-hide").innerHTML = '<i class="fa-solid fa-eye-slash"></i>'
      show = false;
    } else {
      list.querySelector(".hidden-tasks .tasks").style.display = "none";
      list.querySelector(".show-and-hide").innerHTML = '<i class="fa-solid fa-eye"></i>'
      show = true;
    }
  };

  list.ondragover = (e) => {
    e.preventDefault();
    listDraggedOver = list.id;
    showTheLine(list.id);
  };
}
export function updateList() {
  let listObj = List.findObjOf(listIdToEdit);
  let currentTheme = document.querySelector(".selected-theme").getAttribute("data-theme");
  listObj.edit(listNameInput.value, currentTheme)
  window.localStorage.setItem("lists", JSON.stringify(lists));
  reload();
  hideListPopup();
}

function showTheLine(listId) {
  let taskElements = document.querySelectorAll(".task");
  taskElements.forEach((taskElement) => {
    taskElement.querySelector(".line-after").style.transform = "scale(0)";
    taskElement.querySelector(".line-before").style.transform = "scale(0)";
  });

  // Currently dragging over listObj.
  let listObj = List.findObjOf(listId);

  // listObj of dragged task.
  let listObjOfDraggedT = List.findObjOf(taskDraggedFrom);

  let draggedTaskObj = listObjOfDraggedT.findTaskObj(taskIdDragged);
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
        let redTasks = listObj.getRedTasks();
        let greenTasks = listObj.getGreenTasks();
    
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
  let listObj = List.findObjOf(listId);

  let redTasks = listObj.getRedTasks();
  let orangeTasks = listObj.getOrangeTasks();
  let greenTasks = listObj.getGreenTasks();
  
  listObj.tasks = [...bubbleSort(redTasks), ...bubbleSort(orangeTasks), ...bubbleSort(greenTasks)];

}

// Sort tasks based on DATE.
function bubbleSort(arr){
  let noSwaps;
  for(let i = arr.length; i > 0; i--){
    noSwaps = true;
    for (let j = 0; j < i - 1; j++){
      let currentDate = arr[j].getDateObj();
      let comparedDate = arr[j + 1].getDateObj();
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

export { listIdToAddTask, listDraggedOver};
