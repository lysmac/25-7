/** Coordinates functions responsible for fetching data on national holidays and rendering it to the screen. */
async function getHols() {
    const month = await getAllDays();
    getHolArray(month.dagar);
}


/**
 * Fetches a data on each day of the month from the Svenska Helgdagar API.
 * @returns {Array.<Object>} All day objects in the month.
 */
function getAllDays() {
    return month = fetch(`https://sholiday.faboul.se/dagar/v2.1/${openMonth.year}/${openMonth.monthNr + 1}`)
        .then((response) => response.json());
}

/**
 * Filters out holiday day objects from days of the month.
 * @param {Array.<Object>} allDays All day objects in the month.
 * @returns {Array.<Object>} An array of holiday day objects.
 */
function getHolArray(allDays) {
    const hollibobs = [];
    for (const day of allDays) {
        if (day.hasOwnProperty('helgdag')) {
            hollibobs.push(day);
        }
    }
    openMonth.holidays = hollibobs;
}

/**
 * Renders holiday names to the relevent day on screen.
 * Called by day createDaySquares in calendar.js.
 * @param {number} i
 * @param {HTMLDivElement} daySquare
 */
function renderHoliday(i, daySquare) {
    for (const day of openMonth.holidays) {
    const splitDate = day.datum.split('-');
    const holidate = parseInt(splitDate[2]);
    if (holidate === i + 1) {
        const holidiv = document.createElement('div');
        holidiv.innerText = day.helgdag;
        holidiv.classList.add('holidiv');
        daySquare.appendChild(holidiv);
    }
    }
}