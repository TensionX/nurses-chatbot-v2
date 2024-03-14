// Function to authenticate user
async function authenticateUserApi(login, password) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/authenticate.php';
    const hashedPassword = md5(password); // Ensure you have an MD5 hash function available
  
    const requestBody = {
      login: login,
      password: hashedPassword
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
  
  // Function to retrieve schedule status
  async function scheduleStatusApi(dateRange) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/scheduleStatus.php';
    const sessionToken = await getUserToken();
  
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
  
      return await response.json();
    } catch (error) {
      console.error('Error during the API request:', error);
      return null;
    }
  }
  
  // Function to retrieve nurse openings
  async function getOpeningsApi(dateRange) {
    const url = 'https://www.ewebstaffing.com/rcm-test/api/getOpenings.php';
    const sessionToken = await getUserToken();
  
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
  
      return await response.json();
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
    const url = 'https://www.ewebstaffing.com/rcm-test/api/callOutAbsence.php';
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
    // This should return the session token from storage
    return 'your-session-token';
  }
  


  async function getCurrentSchool(){
    return {name: "Greenwood Elementary"};
  }