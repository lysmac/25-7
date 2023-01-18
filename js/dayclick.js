function activeDay(event) {
  const target = event.currentTarget;

  // Makes an array from all days in a month.
  Array.from(document.querySelectorAll(".day"))
    // Removes the toggle class from all days except the one that is clicked
    .filter((day) => day !== target)
    .forEach((day) => day.classList.remove("active"));

  const wasActive = target.classList.contains("active");

  // Puts toggle on the targeted day
  target.classList.toggle("active");

  if (wasActive) {
    localStorage.removeItem("activeDay");
  } else {
    const date = new Date(target.dataset.todaysDate);
    localStorage.setItem("activeDay", date.toLocaleDateString("sv-SE"));
  }
  showItem();
}
