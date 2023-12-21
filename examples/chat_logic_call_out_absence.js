async function callInAttendance() {
    
    
    var current_school = await getCurrentSchool();
   
    chatWindow.talk(callingInAttendanceLogic({school: current_school.name}), "confirm_school_attendance");
    //
    return;
}

function callingInAttendanceLogic({school, time}){
    return {
        
        "not_scheduled": {
            says: [
                `You are not scheduled to work at any school within the next 10 days. Call the school nursing line at xxx-xxx-xxxx if you have any questions.`
            ],
            reply: [
                { question: "Start over", answer: "start_over" }
            ]
        },
        "select_absent_date": {
            says: [
                "Which assignment are you calling out absent?"
            ],
            reply: [
                ...assignments.map(function(assignment, index) {
                    return { 
                        question: assignment.school + ", " + assignment.date, 
                        answer: "absence_option" + index 
                    };
                }),
                { question: "None", answer: "exit" }
            ]
        },
        "exit": {
            says: ["Thank you! If you need anything else, just ask."],
            reply: [{question: "Start over", answer: "start_over"} ]
            // End of flow
        },
        "call_in_success": {
            says: [`Got it. You have successfully called in attendance at ${school}.Have a great day!`],
            reply: [{question: "Start over", answer: "start_over"} ]
            // End of flow
        },
    };

    
} 


async function time_select(){
    // var current_school = await getCurrentSchool();
    // chatWindow.talk(callingInAttendanceLogic({
    //     school: current_school.name
    // }), "time_select_step");
    await forSeconds(1);
    open_time_modal();
    
}




function start_over(){
    chatWindow.talk(chatLogic);
}

async function getCurrentSchool(){
    return {name: "Greenwood Elementary"};
}

document.getElementById('confirmTime').addEventListener('click', async function() {
    var time = document.getElementById('timeInput').value;
    storageSet('call_in_time', time);
    closeModal();
    var current_school = await getCurrentSchool();
   
    chatWindow.talk(callingInAttendanceLogic({school: current_school.name}), "call_in_success");
});

document.getElementById('cancelTime').addEventListener('click', async function() {
    closeModal();
    var current_school = await getCurrentSchool();
   
    chatWindow.talk(callingInAttendanceLogic({school: current_school.name}), "confirm_school_attendance_again");
});

function open_time_modal() {
    document.getElementById('timeModal').classList.add("show");
    // Set default value to current time
    setCurrentTime();
    function setCurrentTime() {
        var now = new Date();
        var hours = String(now.getHours()).padStart(2, '0'); // Add leading 0 if necessary
        var minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading 0 if necessary
        var currentTime = hours + ':' + minutes;
    
        document.getElementById('timeInput').value = currentTime;
    }
}

function closeModal() {
    document.getElementById('timeModal').classList.remove("show");
}