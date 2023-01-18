/**
 * Function creates and outputs time, date, day, month and year using the new Date()-function
 * toLocaleDatestring and ToLocaleTimeString makes it possible to use options for what kind of
 * output you want, and in what language/time zone.
 */
function createTimeDateMonthMsg() {
  const date = new Date().toLocaleDateString("en-SE", {
    day: "numeric",
    month: "short",
  });

  const englishDayName = new Date().toLocaleDateString("en-SE", {
    weekday: "long",
  });

  const time = new Date().toLocaleTimeString("sv-SE", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const today = new Date();
  const year = today.getFullYear();

  document.getElementById("displayCurrentTime").textContent = time;

  document.getElementById(
    "displayTodaysDay"
  ).textContent = `Today ${englishDayName}`;

  document.getElementById("displayTodaysDateMonth").textContent = ` ${date}`;
  document.getElementById("displayCurrentYear").textContent = year;
}
