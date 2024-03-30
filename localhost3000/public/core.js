
async function forSeconds(seconds){
    return new Promise((resolve) => {setTimeout(function(){resolve();}, seconds * 1000)});
}

/**
 * Saves data to localStorage.
 * @param {string} key - The key under which to store the data.
 * @param {*} value - The data to be stored.
 */
function storageSet(key, value) {
    try {
        var valueString = JSON.stringify(value);
        localStorage.setItem(key, valueString);
    } catch (err) {
        console.error("Error saving to localStorage", err);
    }
}

/**
 * Retrieves data from localStorage.
 * @param {string} key - The key of the data to retrieve.
 * @return {*} The retrieved data.
 */
function storageGet(key) {
    try {
        var valueString = localStorage.getItem(key);
        return JSON.parse(valueString);
    } catch (err) {
        console.error("Error retrieving from localStorage", err);
        return null;
    }
}

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
]


function today(days=0) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    
    const year = today.getFullYear();
    // Add 1 because getMonth() returns a zero-based value (0-11)
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}




function prettyDate(dateStr) {
    if (!dateStr || !dateStr.split("-").length) {
        return dateStr;
    }

    // Get the current date components
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Note: January is 0, February is 1, and so on.
    const currentDay = currentDate.getDate();

    // Calculate tomorrow's date components
    const tomorrowDate = new Date(currentDate);
    tomorrowDate.setDate(currentDate.getDate() + 1);
    const tomorrowYear = tomorrowDate.getFullYear();
    const tomorrowMonth = tomorrowDate.getMonth();
    const tomorrowDay = tomorrowDate.getDate();

    // Parse the input date string
    const [inputYear, inputMonth, inputDay] = dateStr.split('-').map(num => parseInt(num, 10));

    // Check for "TODAY"
    if (inputYear === currentYear && inputMonth === currentMonth + 1 && inputDay === currentDay) {
        return "TODAY";
    }
    // Check for "TOMORROW"
    else if (inputYear === tomorrowYear && inputMonth === tomorrowMonth + 1 && inputDay === tomorrowDay) {
        return "TOMORROW";
    }

    // If not today or tomorrow, proceed with the original logic
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const v = inputDay % 100;

    return `${months[inputMonth - 1]} ${inputDay}`;
}


function structuredDate(dateStr) {
    const currentDate = new Date();
    let formattedDate;
  
    // Handle "TODAY" and "TOMORROW" cases
    if (dateStr.toUpperCase() === "TODAY") {
      formattedDate = currentDate;
    } else if (dateStr.toUpperCase() === "TOMORROW") {
      // Create a date for tomorrow
      formattedDate = new Date(currentDate);
      formattedDate.setDate(currentDate.getDate() + 1);
    } else {
      // Attempt to parse the date string for any other case
      const currentYear = currentDate.getFullYear();
      formattedDate = new Date(`${dateStr} ${currentYear}`);
    }
  
    // Ensuring the date is valid
    if (isNaN(formattedDate)) {
      return 'Invalid date';
    }
  
    // Formatting to yyyy-mm-dd
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  
  
  function dateDiff(initialDate, daysToMove) {
    // Convert the initialDate string to a Date object
    const date = new Date(initialDate);

    // Add the daysToMove to the date
    date.setDate(date.getDate() + daysToMove);

    // Format the new date into yyyy-mm-dd format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Return the formatted date
    return `${year}-${month}-${day}`;
}


function closestWeekDate(weekday) {
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = new Date();
    const todayIndex = (today.getDay() + 6) % 7; // Adjusting so that Monday is 0, Tuesday is 1, ..., Sunday is 6
    const targetIndex = weekdays.indexOf(weekday);
    let daysToAdd = targetIndex - todayIndex;

    // If the day is today or before today in the week, move to the next week
    if (daysToAdd <= 0) {
        daysToAdd += 7;
    }

    // Calculate the date of the next desired weekday
    const resultDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd + 1); // +1 to start from tomorrow

    // Format the date into yyyy-mm-dd
    const year = resultDate.getFullYear();
    const month = String(resultDate.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(resultDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function daysBetween(date1, date2) {
    // Parse the dates from strings to Date objects
    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = parsedDate2 - parsedDate1;

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // Return the absolute value to avoid negative results
    return Math.abs(differenceInDays);
}

function isDate(value) {
    return value instanceof Date && !isNaN(value.getTime());
}