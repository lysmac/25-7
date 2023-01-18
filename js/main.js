addEventListener("DOMContentLoaded", main);

/** Creates a date object for the current date and passes it to the functions
 * that runs the various elements of the page.
 */
function main() {
  const date = new Date();
  runCalendar(date.getMonth(), date.getFullYear());
  runTodo();

  /** Creates welcome message and refreshes it every second.
   *  createTimeDateMonthMsg(); is run alone first so it's not
   *  a one second delay to load in the message.
   */
  createTimeDateMonthMsg();
  setInterval(createTimeDateMonthMsg, 1000);
}
