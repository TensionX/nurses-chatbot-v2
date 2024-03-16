// Declare chatWindow at the top level so it's accessible throughout the script
var chatWindow;
var chatLogic;
async function init(){
    chatWindow = new Bubbles(document.getElementById("chat"), "chatWindow");

    chatLogic = {
        ice: {
            says: ["Hello, I'm your assistant. What would you like to do today?"],
            reply: [
                {question: "Providing Availability", answer: "provideAvailability"},
                {question: "Calling Out Absent", answer: "reportAbsence"},
                {question: "Calling In Attendance", answer: "callInAttendance"},
                
                
            ]
        },
        provideAvailability: {
            says: ["Would you like to provide availability for a specific date or recurring days?"],
            reply: [
                {question: "Done / Exit", answer: "ice"},
                {question: "Recurring Days", answer: "recurringDays"},
                {question: "Specific Date", answer: "specificDate"},
                
                
            ]
        },
        recurringDays: {
            says: ["Which weekday are you looking for a recurring assignment?"],
            reply: [
                {question: "None/Exit", answer: "exit"},
                {question: "Every Friday", answer: "recurringFriday"},
                {question: "Every Thursday", answer: "recurringThursday"},
                {question: "Every Wednesday", answer: "recurringWednesday"},
                {question: "Every Tuesday", answer: "recurringTuesday"},
                {question: "Every Monday", answer: "recurringMonday"},

            ]
        },
        exit: {
            says: ["Thank you from RCM Health Care Services."],
            reply: [{question: "Start over", answer: "ice"}]
        },
        // Continue defining other states based on your document
    };

    
    
    //Check session
    var active_session = await checkSessionApi();
    console.log(active_session);
    if(active_session){
        // Start the conversation
        var loginModal = document.querySelector("#loginModal");
        loginModal.classList.remove("show");
        chatWindow.talk(chatLogic);
    }else{
        showLogin();
    }
}
document.addEventListener('DOMContentLoaded', init);


function recurringMonday() {
    handleRecurringDay(0);
}

function recurringTuesday() {
    handleRecurringDay(1);
}

function recurringWednesday() {
    handleRecurringDay(2);
}

function recurringThursday() {
    handleRecurringDay(3);
}

function recurringFriday() {
    handleRecurringDay(4);
}



async function sayTemporaryMessage(message) {
    // Temporarily injects a message into the chat
    chatWindow.talk({
        "tempMessage": {
            says: [message]
        }
    }, "tempMessage");
    await forSeconds(1);
    return;
}




async function showLogin(){
    var loginModal = document.querySelector("#loginModal");
    var inputs = {
        login: loginModal.querySelector("#login"),
        password: loginModal.querySelector("#password"),
        button: loginModal.querySelector("#confirmLogin")
    };
    inputs.login.value = inputs.password.value = "";
    loginModal.classList.add("show");

    inputs.button.onclick = async function(){
        if(!inputs.login.value.length || !inputs.password.value.length){
            alert(`Login and password cannot be empty`);
            return;
        }
        var login_result = await authenticateUserApi(inputs.login.value.trim(), inputs.password.value.trim());
        if(login_result == true){
            init();
        }

    };

    
}