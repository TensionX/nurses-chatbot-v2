// Function to authenticate user
async function authenticateUserApi(login, password) {
  console.log(login, password);
    const url = 'https://www.ewebstaffing.com/rcm-test/api/authenticate.php';
    const hashedPassword = md5(password); // Ensure you have an MD5 hash function available

    const requestBody = {
      login: login,
      password: hashedPassword
    };
  
    // //Imigate success
    // storageSet("session_token", "b1ff876046b9f95c5f2a7f4dfa57600d");
    // return true;


    try {
      var response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        alert(`Login or password is incorrect, please try again`);
        showLogin();

        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      response = await response.json();
      storageSet("session_token", response.sessionToken);
      storageSet("user_name", response.name || null);
      return true;
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to retrieve schedule status
  async function scheduleStatusApi(dateRange) {


    const url = 'https://www.ewebstaffing.com/rcm-test/api/scheduleStatus.php';
    const sessionToken = await getUserToken();
    console.log(`Session token: ${sessionToken}`);
    const requestBody = {
      sessionToken,
      dateRange
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return (await response.json()).sort((b, a) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to retrieve nurse openings
  async function getOpeningsApi(dateRange, recurring = false) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/getOpenings.php';
    const sessionToken = await getUserToken();
  
    const requestBody = {
      sessionToken,
      dateRange
    };
  
    try {
      var response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      response = await response.json();

      if(recurring){
        response.filter(el => el.Openings.WeeklyRecurring == true);
      }

      return response;
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to record call-in attendance
  async function callInAttendanceApi(eWebRecordID, callInTime) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/callInAttendance.php';
    const sessionToken = await getUserToken();
  
    const requestBody = {
      sessionToken,
      eWebRecordID,
      callInTime
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to record call-out absence
  async function callOutAbsenceApi(date, reason) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/callOutAbsent.php';
    const sessionToken = await getUserToken();
  
    const requestBody = {
      sessionToken,
      date,
      reason
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to confirm booking
  async function confirmBookingApi(date, eWebID) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/confirmBooking.php';
    const sessionToken = await getUserToken();
  
    const requestBody = {
      sessionToken,
      date,
      eWebID
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Placeholder for the getUserToken function
  // Implement this function based on your token management strategy
  async function getUserToken() {

    var token = storageGet("session_token");
    // This should return the session token from storage
    return token;
  }
  


  async function getCurrentSchool(){

    debugger;
    // //Placeholder
    // return {name: "Greenwood Elementary", address: "123 Street", eWebRecordID: 123152346};


    // Retrieve the "current_school" object from localStorage
    let currentSchool = storageGet("current_school");

    // Get today's date formatted as "yyyy-mm-dd"

    // Check if the currentSchool object is valid and if the date matches today
    if (currentSchool && currentSchool.date) {
        if (currentSchool.date !== today()) {
            // If the date is different, fetch the new current school data
            currentSchool = await get_current_school();
            // Update the localStorage with the new value
            storageSet("current_school", currentSchool);
        }
    } else {
        // If no valid currentSchool object exists, fetch and store it
        currentSchool = await get_current_school();
        storageSet("current_school", currentSchool);
    }

    // Return the current or updated school information
    console.log(currentSchool);
    currentSchool = currentSchool?.school || null;
    return currentSchool;


    async function get_current_school(){
      var schedule = await scheduleStatusApi({"from": today(), "to": today()});
      console.log(schedule);
      if(!schedule.length){
        return null;
      }

      var current_schedule = schedule[0];
      return {date: today(), school: {name: current_schedule.scheduledWork.school_name, address: current_schedule.scheduledWork.school_address, eWebRecordID: current_schedule.scheduledWork.eWebRecordID}};
    }
    
  }





  async function checkSessionApi() {

    // await forSeconds(0.5);
    // return true;
    try {
      // Attempt to fetch the schedule status as a way to check the session token's validity.
      // Note: Assume scheduleStatus is already defined and properly implemented.
      var result = await scheduleStatusApi({"from": "2024-01-01", "to": "2024-01-02"}); // Passing an empty object assuming the function can handle it or expects certain parameters.
  
      // If the request was successful, the session is considered valid.
      return result;
    } catch (error) {
      // Inspect the error to see if it was a 401 Unauthorized error.
      if (error instanceof Error && error.message.includes('401')) {
        // Token is expired or incorrect.
        return false;
      }
  
      // If the error is not a 401, it might be another issue (network error, server error, etc.).
      // Depending on your application's needs, you can choose to return false or handle this differently.
      throw error; // Or return false; based on how you want to treat other errors.
    }
  }