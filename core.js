
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