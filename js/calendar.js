/** Tracks open month and contains data. */
const openMonth = {
  /**
   * Number of the current month 0-11.
   * @type {number}
   */
  monthNr: 0,
  /**
   * Name of th current month.
   * @type {string}
   */
  monthName: "",
  /**
   * Number of the current year.
   * @type {number}
   */
  year: 0,
  /**
   * Array of days of days of the month.
   * @type {array}
   */
  days: [],
  /**
   * Weekday number of the first day of the month, 1-7.
   * @type {number}
   */
  firstWeekday: 0,
  /**
   * Weekday number of the last day of the month, 1-7.
   * @type {number}
   */
  lastWeekday: 0,
};

/** Calls rendeer function for the first month and event listener functions. */
function runCalendar(month, year) {
    openMonth.monthNr = month;
    openMonth.year = year;
    renderMonth();
}

/**
 * Sets new open month and calls functions for getting data and adding functionality.
 * Adds month change listeners.
 */
async function renderMonth() {
    removeMonthChangeListeners();
    getMonthData();
    await getHols();
    clearDays();
    renderHead();
    renderDays();
    getMonthTodos();
    addMonthChangeListeners();
}

/** Clears current days of the month from page. */
function clearDays() {
  document.getElementById("calendarWrapper").innerHTML = "";
}

// FUNCTIONS POPULATING THE MONTH OBJECT WITH DATA

/** Calls functions which populate the openMonth object with data to be rendered. */
function getMonthData() {
  openMonth.monthName = getMonthName();
  getDays();
  getFirstDay();
  getLastDay();
}

/** Gets the month's name from an array. */
function getMonthName() {
  const monthsList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthsList[openMonth.monthNr];
}

/** Creates an array of dates in the open month and assigns it to the days property */
function getDays() {
  let date = new Date(openMonth.year, openMonth.monthNr, 1);
  const days = [];
  while (date.getMonth() === openMonth.monthNr) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  openMonth.days = days;
}

/* Gets the weekday number of the first day of the month. Used for border-drawing functions below */
function getFirstDay() {
  let firstWeekday = openMonth.days[0].getDay();
  firstWeekday = makeSundaySevenAgain(firstWeekday);
  openMonth.firstWeekday = firstWeekday;
}

/* Gets the weekday number of the last day of the month. Used for border-drawing functions below */
function getLastDay() {
  let lastWeekday = openMonth.days[openMonth.days.length - 1].getDay();
  lastWeekday = makeSundaySevenAgain(lastWeekday);
  openMonth.lastWeekday = lastWeekday;
}

/** Converts number for Sunday from 0 to 7 */
function makeSundaySevenAgain(dayNr) {
  if (dayNr === 0) {
    dayNr = 7;
  }
  return dayNr;
}

// RENDERING FUNCTIONS

/** Renders month name and year to calendar head. */
function renderHead() {
  document.getElementById("open-month").innerText = openMonth.monthName;
  document.getElementById("open-year").innerText = openMonth.year;
}

/** Renders days of the open month to the screen. */
function renderDays() {
  const calendarWrapper = document.getElementById("calendarWrapper");
  renderBlanks(calendarWrapper);
  createDaySquares(calendarWrapper);
  addLastBorder(calendarWrapper);
}

/**
 * Renders invisible squares to the screen to place the first day of the month in the right column.
 * @param {HTMLDivElement} calendarWrapper
 */
function renderBlanks(calendarWrapper) {
  for (let i = 0; i < openMonth.firstWeekday - 1; i++) {
    const blankDay = document.createElement("div");
    blankDay.classList.add("blank");
    blankDay.classList.add("border-bottom");
    calendarWrapper.append(blankDay);
  }
}

/**
 * Creates a square on the calendar for each day of the months with dynamic borders.
 * @param {HTMLDivElement} calendarWrapper
 */
function createDaySquares(calendarWrapper) {
  for (let i = 0; i < openMonth.days.length; i++) {
    const daySquare = document.createElement("div");
    daySquare.innerText = i + 1;
    daySquare.classList.add('day',);
    daySquare.id = i + 1;
    renderHoliday(i, daySquare);
    setBorder(i, daySquare);
    calendarWrapper.append(daySquare);

    // Adds eventlistener to all days that are generated
    daySquare.addEventListener("click", activeDay);
    // Sets date-data for each day
    daySquare.dataset.todaysDate = openMonth.days[i];
  }
}

/**
 * Adds borders to calendar days dynamically
 * @param {number} i The iteration of the square construction loop.
 * @param {HTMLDivElements} daySquare The calendar square currently under construction.
 */
function setBorder(i, daySquare) {
  if (i >= 0 && openMonth.days[i].getDay() != 1) {
    daySquare.classList.add("border-left");
  }
  const lengthMinusLastRow = openMonth.days.length - openMonth.lastWeekday;
  if (i < lengthMinusLastRow) {
    daySquare.classList.add("border-bottom");
  }
}

/**
 * Adds a closing border if needed.
 * @param {HTMLDivElement} calendarWrapper
 */
function addLastBorder(calendarWrapper) {
  if (openMonth.lastWeekday != 7) {
    const lastSquare = document.createElement("div");
    lastSquare.classList.add("blank");
    lastSquare.classList.add("border-left");
    calendarWrapper.append(lastSquare);
  }
}

// NAVIGATION FUNCTIONS

/** Adds listeners for changing month to previous and next. */
function addMonthChangeListeners() {
    const previousMonth = document.getElementById('previous-month-button');
    const nextMonth = document.getElementById('next-month-button');
    previousMonth.addEventListener('click', monthDown);
    nextMonth.addEventListener('click', monthUp);
    previousMonth.setAttribute('data-cy', 'prev-month');
    nextMonth.setAttribute('data-cy', 'next-month');
    addEventListener('keydown', keyMonthChange);
}

/** Removes listeners while page is loading. */
function removeMonthChangeListeners() {
    const previousMonth = document.getElementById('previous-month-button');
    const nextMonth = document.getElementById('next-month-button');
    previousMonth.removeEventListener('click', monthDown);
    nextMonth.removeEventListener('click', monthUp);
    previousMonth.removeAttribute('data-cy');
    nextMonth.removeAttribute('data-cy');
    removeEventListener('keydown', keyMonthChange);
}

/**
 * Checks keypress and calls month changing function with appropriate increment.
 * @param {KeyboardEvent} e
 */
function keyMonthChange(e) {
    if (e.key === 'ArrowLeft') {
        monthDown();
    } else if (e.key === 'ArrowRight') {
        monthUp();
    };
}

/**
 * Changes month up or down according to the increment parameter.
 * @param {number} increment
 */
function monthDown() {
    openMonth.monthNr -= 1;
    if (openMonth.monthNr < 0) {
        openMonth.year -= 1;
        openMonth.monthNr = 11;
    }
    renderMonth();
}

/**
 * Changes month up or down according to the increment parameter.
 * @param {number} increment
 */
function monthUp() {
    openMonth.monthNr += 1;
    if (openMonth.monthNr > 11) {
        openMonth.year += 1;
        openMonth.monthNr = 0;
    }
    renderMonth();
}
