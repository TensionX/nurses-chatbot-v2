// Declare chatWindow at the top level so it's accessible throughout the script
var chatWindow;
var chatLogic;
var scheduled_today;
async function init(){
    storageSet("provided_availability", false);
    chatWindow = new Bubbles(document.getElementById("chat"), "chatWindow");


    //Check session
    var active_session = await checkSessionApi();
    console.log(active_session);
    if(active_session){
        // Start the conversation
        var loginModal = document.querySelector("#loginModal");
        loginModal.classList.remove("show");

        var scheduled = await scheduledFor(today());
        var scheduledText = "";
        if(scheduled){
            scheduled_today = true;
            var data = (await scheduleStatusApi({"from":  today(), "to": today()}))[0];
            scheduledText = `You are confirmed at ${data.scheduledWork.school_name} today. <br><br>The address is ${data.scheduledWork.school_address} and the hours are ${data.scheduledWork.StartTime || "unknown"} through ${data.scheduledWork.EndTime || "unknown"}.<br><br>`
        }else{
            scheduled_today = false;
            scheduledText = `You are <b>NOT</b> scheduled to work at any school today. <br><br>`;
        }


        chatLogic = {
            ice: {
                says: [`Hello, ${storageGet("user_name") || "Dear User"}! <br><br>${scheduledText}
                    
                    Please select from the following:`],
                reply: [
                    {question: "Calling In Attendance", answer: "callInAttendance"},
                    {question: "Calling Out Absent", answer: "reportAbsence"},
                    {question: "Providing Availability", answer: "specificDate"},
                    
                    
                    {question: "Done / Exit", answer: "exit"},
                    
                    
                ]
            },
            provideAvailability: {
                says: ["Are you providing availability for a SPECIFIC DATE or RECURRING ASSIGNMENT?"],
                reply: [
                    {question: "Specific Date", answer: "specificDate"},
                    {question: "Recurring Days", answer: "recurringDays"},
                    {question: "Done / Exit", answer: "ice"},
                    
                    
                    
                    
                ]
            },
            provideAvailability_notscheduled: {
                says: [
                    `Hello, ${storageGet("user_name") || "Dear User"}!<br></br>You are <b>NOT</b> scheduled to work at any school today. <br><br>`,
                    "Are you providing availability for a SPECIFIC DATE?"
                ],
                reply: [
                    {question: "Yes", answer: "specificDate"},
                    // {question: "Recurring Days", answer: "recurringDays"},
                    {question: "No / Exit", answer: "exit_end"},
                    
                    
                    
                    
                ]
            },

            recurringDays: {
                says: ["Which weekday are you looking for a recurring assignment?"],
                reply: [
                    {question: "Every Monday", answer: "recurringMonday"},
                    {question: "Every Tuesday", answer: "recurringTuesday"},
                    {question: "Every Wednesday", answer: "recurringWednesday"},
                    {question: "Every Thursday", answer: "recurringThursday"},
                    {question: "Every Friday", answer: "recurringFriday"},
                    {question: "None/Exit", answer: "exit"},
                    
                    
                    
                    
                    
    
                ]
            },
            exit: {
                says: ["Thank you from RCM Health Care Services."],
                reply: [
                    {question: "Start over", answer: "ice"},
                    {question: "Log out", answer: "log_out"},
                
                ]
            },
            exit_end: {
                says: ["Thank you from RCM Health Care Services."],
                
            },
            // Continue defining other states based on your document
        };

        if(scheduled_today){
            chatWindow.talk(chatLogic);    
        }else{
            chatWindow.talk(chatLogic, "provideAvailability_notscheduled");
        }
        
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



function thankYouExit(){

}


function log_out(){
    storageSet("session_token", null);
    location.reload();
}