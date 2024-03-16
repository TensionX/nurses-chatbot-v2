
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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));

    const suffixes = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];

    return `${months[month - 1]} ${day}${suffix}`;
}
