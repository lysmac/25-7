// Initialize event listeners
function runTodo() {
  const newEventButton = document.getElementById("new-event-button");
  const saveTaskButton = document.getElementById("save-task-button");
  const cancelEventButton = document.getElementById("cancel-event-button");
  const formInput = document.getElementById("input-form");

  window.addEventListener("load", () => {
    showItem();
  });
  newEventButton.addEventListener("click", toggleCreateEventCanvas);
  saveTaskButton.addEventListener("click", createTodo);
  cancelEventButton.addEventListener("click", toggleCreateEventCanvas);
  formInput.addEventListener(
    "input",
    () => (saveTaskButton.innerHTML = "Save Task")
  );
}

// Toggle show and hide on new-event-creator
function toggleCreateEventCanvas() {
  const newEventCanvas = document.getElementById("new-event-canvas");
  const saveTaskButton = document.getElementById("save-task-button");
  if (newEventCanvas.style.display === "block") {
    newEventCanvas.style.display = "none";
  } else {
    newEventCanvas.style.display = "block";
  }
  saveTaskButton.innerHTML = "Save Task";
  const dateInput = newEventCanvas.querySelector("#date-input");
  if (dateInput) {
    const date = localStorage.getItem("activeDay");
    dateInput.valueAsDate = date ? new Date(date) : undefined;
  }
}

function createTodo() {
  let uniqueId = self.crypto.randomUUID();

  const newEventCanvas = document.getElementById("new-event-canvas");
  const saveTaskButton = document.getElementById("save-task-button");

  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const startTimeInput = document.getElementById("start-time-input");
  const endTimeInput = document.getElementById("end-time-input");

  // creating task-object
  let task = {
    title: titleInput.value,
    date: dateInput.value,
    startTime: startTimeInput.value,
    endTime: endTimeInput.value,
    id: uniqueId,
  };

  // close create event canvas when new task is created
  toggleCreateEventCanvas();

  // checking if there exist user-input
  const hasValue = !Object.values(task).every((x) => x === null || x === "");

  // if user-input exists, give to local-storage item "localItem"
  if (hasValue) {
    let taskList = getTaskList(true);
    // push task-object to taskList array and set localStorage-item
    taskList.push(task);
    saveTaskList(taskList);
  } else {
    newEventCanvas.style.display = "block";
    saveTaskButton.innerHTML = "add atleast one value";
  }
  // resetting input-fields
  resetForm();

  //displaying task
  showItem();
  getMonthTodos();
}

function showItem() {
  const taskList = getTaskList();

  let html = "";
  let itemShow = document.getElementById("tasks-canvas");

  // create an unordered task list to hold all task
  html += `<ul data-cy="todo-list">`;
  taskList.forEach((task) => {
    const todoId = task.id;
    // add a new list item for each task
    html += `<li class="event-block">`;
    html += `${task.title}</br>`;
    html += `${task.date}</br>`;
    html += `${task.startTime}</br>`;
    html += `${task.endTime}`;


    // add a delete and an edit button for each task
    html += `<div id="position-button"><button data-cy="delete-todo-button" onclick="removeTodo('${todoId}')"> X </button>`;
    html += `<button data-cy="edit-todo-button" onclick="editTodo('${todoId}')">Edit</button></div>`;
    // close the list item, done with current task
    html += "</li>";
  });
  // close the unordered task list
  html += "</ul>";

  // give list to tasks-canvas div
  itemShow.innerHTML = html;
}

// remove item
function removeTodo(todoId) {
  const taskList = getTaskList(true);
  const taskIndex = taskList.findIndex((task) => task.id === todoId);
  taskList.splice(taskIndex, 1);
  saveTaskList(taskList);
  showItem();
  getMonthTodos();
}

function editTodo(todoId) {
  toggleCreateEventCanvas();
  let taskList = getTaskList(true);
  const index = taskList.findIndex((task) => task.id === todoId);

  const saveTaskButton = document.getElementById("save-task-button");
  saveTaskButton.innerHTML = "Edit Task";
  saveTaskButton.removeEventListener("click", createTodo);

  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const startTimeInput = document.getElementById("start-time-input");
  const endTimeInput = document.getElementById("end-time-input");

  titleInput.value = taskList[index].title;
  dateInput.value = taskList[index].date;
  startTimeInput.value = taskList[index].startTime;
  endTimeInput.value = taskList[index].endTime;

  saveTaskButton.onclick = function () {
    saveEdit(index);
    saveTaskButton.onclick = createTodo;
  };
}

function saveEdit(index) {
  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const startTimeInput = document.getElementById("start-time-input");
  const endTimeInput = document.getElementById("end-time-input");

  let taskList = getTaskList(true);
  taskList[index].title = titleInput.value;
  taskList[index].date = dateInput.value;
  taskList[index].startTime = startTimeInput.value;
  taskList[index].endTime = endTimeInput.value;

  saveTaskList(taskList);
  showItem();
  toggleCreateEventCanvas();
  resetForm();
}

function getTaskList(skipFilter) {
  const activeDay = localStorage.getItem("activeDay");

  const taskList = JSON.parse(localStorage.getItem("localItem")) || [];
  if (skipFilter) {
    return taskList;
  }
  if (activeDay) {
    return taskList.filter(
      (item) => new Date(item.date).toLocaleDateString("sv-SE") === activeDay
    );
  }
  return taskList;
}

function saveTaskList(taskList) {
  localStorage.setItem("localItem", JSON.stringify(taskList));
}

function resetForm() {
  const titleInput = document.getElementById("title-input");
  const dateInput = document.getElementById("date-input");
  const startTimeInput = document.getElementById("start-time-input");
  const endTimeInput = document.getElementById("end-time-input");
  titleInput.value = "";
  dateInput.value = "";
  startTimeInput.value = "";
  endTimeInput.value = "";
}
