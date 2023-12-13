// Declare chatWindow at the top level so it's accessible throughout the script
let chatWindow;

document.addEventListener('DOMContentLoaded', function() {
    chatWindow = new Bubbles(document.getElementById("chat"), "chatWindow");

    const chatLogic = {
        ice: {
            says: ["Hello, I'm your assistant. What would you like to do today?"],
            reply: [
                {question: "Call in Attendance", answer: "callInAttendance"},
                {question: "Report Absence", answer: "reportAbsence"},
                {question: "Provide Availability", answer: "provideAvailability"}
            ]
        },
        callInAttendance: {
            // Define the logic for Call in Attendance
        },
        reportAbsence: {
            // Define the logic for Report Absence
        },
        provideAvailability: {
            says: ["Would you like to provide availability for a specific date or recurring days?"],
            reply: [
                {question: "Specific Date", answer: "specificDate"},
                {question: "Recurring Days", answer: "recurringDays"}
            ]
        },
        specificDate: {
            // Logic for providing availability for a specific date
            // ...
        },
        recurringDays: {
            // Logic for providing availability for recurring days
            // ...
        }
        // Continue defining other states based on your document
    };

    // Start the conversation
    chatWindow.talk(chatLogic);
});
