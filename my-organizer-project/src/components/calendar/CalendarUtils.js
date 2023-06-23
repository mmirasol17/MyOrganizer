// * function to convert military time to regular time
export function convertToRegularTime(time) {
  let hours = parseInt(time.slice(0, 2));
  let minutes = time.slice(3, 5);
  let suffix = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${hours}:${minutes}${suffix}`;
}

// * function to shorten the time
export function shortenTime(time) {
  // get rid of :00 if it's there
  if (time.includes(":00")) {
    time = time.replace(":00", "");
  }
  // return the time
  return time;
}
