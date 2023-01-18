// Getting data from local storage.

/** Gets todo list data from local storage */
function getMonthTodos() {
    clearIcons();
    const allLocalTodos = JSON.parse(localStorage.getItem('localItem'));
    if (allLocalTodos) {
        const openMonthTodos = filterMonthTodos(allLocalTodos);
        renderTodoIcons(openMonthTodos);
    }
}

function clearIcons() {
    const todoIcons = document.querySelectorAll('.todo-icon');
    todoIcons.forEach(todoIcon => todoIcon.remove());
}

/**
 * Filters out current month's todos from all saved locally.
 * @param {Array.<Object>} allLocalTodos List of all todos saved locally.
 * @returns {Array.<Object>} List of all todos in current month.
 */
function filterMonthTodos(allLocalTodos) {
    const openMonthTodos = [];
    for (const todo of allLocalTodos) {
        let splitDate = todo.date.split('-');
        if (parseInt(splitDate[1]) === openMonth.monthNr + 1 && parseInt(splitDate[0]) === openMonth.year) {
            openMonthTodos.push(todo);
        }
    }
    return openMonthTodos;
}

/**
 * Calls functions responsible for rendering todo icons to the calendar.
 * @param {Array.<Object>} openMonthTodos 
 */
function renderTodoIcons(openMonthTodos) {
    const iconArray = createIconArray(openMonthTodos);
    createIconElements(iconArray);
}


// Creating elements and appending to DOM.

/**
 * @typedef {Object} Icon Contains properties of the HTML element to be rendered tot he calendar.
 * @property {number} date The date and daySquare element ID that the element will be appended to.
 * @property {number} number The number of todos assigned to that day.
 * @property {string} class The class to be added to the element upon creation.
 */
class Icon {
    constructor(date, number) {
        this.date = date;
        this.number = number;
    }
    class = 'todo-icon';
}

/**
 * Creates an array of Icon class objects describing the html elements to be rendered.
 * @param {Array.<Object>} openMonthTodos 
 * @returns {Array.<Object>} Array of Icon objects.
 */
function createIconArray(openMonthTodos) {
    const iconArray = [];
    for (todo of openMonthTodos) {
        const todoDate = todo.date.split('-')[2];
        const iconIndex = iconArray.findIndex(icon => icon.date === todoDate);
        if (iconIndex >= 0) {
            iconArray[iconIndex].number += 1;
        } else {
            iconArray.push(new Icon(todoDate, 1));
        }
    }
    return iconArray;
}

/**
 * Creates DOM elements using the data from the Icon array.
 * @param {Array.<Object>} iconArray 
 */
function createIconElements(iconArray) {
    for (const icon of iconArray) {
        const iconDiv = document.createElement('div');
        iconDiv.innerText = icon.number;
        iconDiv.classList.add(icon.class);
        document.getElementById(parseInt(icon.date)).appendChild(iconDiv);
    }
}