async function callInAttendance() {
    
    
    var current_school = await getCurrentSchool();
   
    if(current_school != null){
        chatWindow.talk(callingInAttendanceLogic({school: current_school.name}), "confirm_school_attendance");
    }else{
        chatWindow.talk(callingInAttendanceLogic({school: ""}), "not_scheduled");
    }
    
    //
    return;
}

function callingInAttendanceLogic({school, time}){
    return {
        
        "confirm_school_attendance": {
            says: [
                `Are you calling in attendance for ${school}?`
            ],
            reply: [
                { question: "Yes", answer: "time_select" },
                { question: "No", answer: "call_out_instead" }
            ]
        },
        "confirm_school_attendance_again": {
            says: [
                `Oops, looks like you didn't pick a time! Are you calling in attendance for ${school}?`
            ],
            reply: [
                { question: "Yes, ready to set my attendance time", answer: "time_select" },
                { question: "No", answer: "call_out_instead" }
            ]
        },
        "call_out_instead": {
            says: [
                `You are scheduled to work at ${school} today.
                <br><br>Are you instead calling out absent?`,
            ],
            reply: [
                { question: "Yes", answer: "reportAbsence" },
                { question: "No", answer: "exit" }
            ]
        },
        
        "not_scheduled": {
            says: [
                `You are not scheduled to work at any school today.<br><br>Please contact your recruiter if you have any questions.`,
            ],
            reply: [
                {question: "Start over", answer: "start_over"},
                {question: "Log out", answer: "log_out"},
            ]
        },
        // "time_select_step": {
        //     says: [
        //         `What time did you arrive at ${school}? (HH:MM)`
        //     ],
        //     reply: [
        //         { question: "Confirm time", answer: "confirm_time" },
        //         { question: "Exit", answer: "exit" }
        //     ]
        // },
        "exit": {
            says: [
                `OK. You have <b>NOT</b> called in attendance for today.
                <br><br>If there is an issue, please contact your recruiter ASAP.`,
            ],
            reply: [
                {question: "Start over", answer: "start_over"},
                {question: "Log out", answer: "log_out"},
         ]
            // End of flow
        },
        "call_in_success": {
            says: [
                `Got it. You have successfully called in attendance at ${school}.
                <br><br>Have a great day!`,
            ],
            reply: [
                {question: "Start over", answer: "start_over"},
                {question: "Log out", answer: "log_out"},
            ]
            // End of flow
        },
    };

    
} 

async function call_out_instead(){
    reportAbsence(today());
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


document.getElementById('confirmTime').addEventListener('click', async function() {
    var time = document.getElementById('timeInput').value;
    storageSet('call_in_time', time);
    close_time_modal();
    var current_school = await getCurrentSchool();
   

    //This is where confirm attendance is
    var result = await callInAttendanceApi(current_school.eWebRecordID, time);

    chatWindow.talk(callingInAttendanceLogic({school: current_school.name}), "call_in_success");
});

document.getElementById('cancelTime').addEventListener('click', async function() {
    close_time_modal();
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

function close_time_modal() {
    document.getElementById('timeModal').classList.remove("show");
}