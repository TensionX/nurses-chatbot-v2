async function reportAbsence() {
    
    
    //temp solution
    var assignments = await get_existing_assignments();
   
    if(Math.random() < 0.5){
        console.log(`Scheduled for the next 10 days`);
        return chatWindow.talk(callingOutAbsenceLogic({assignments}), "select_absent_date");
    }else{
        return chatWindow.talk(callingOutAbsenceLogic({assignments}), "not_scheduled");
    }
    
    //
    return;
}

function callingOutAbsenceLogic({school, time, assignments, date}){
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
                ...(assignments || []).map(function(assignment, index) {
                    return { 
                        question: assignment.name + ", " + assignment.date, 
                        answer: "absence_option" + index 
                    };
                }),
                { question: "None", answer: "exit" }
            ]
        },
        "absence_confirm":{
            says: [`Please confirm that you are calling out absent from ${school} on ${date}`],
            reply: [
                {question: "Yes, I confirm", answer: "confirm_absence"},
                {question: "No, go back", answer: "select_absent_date"}
            ]
        },
        "absence_confirmation_success": {
            says: [
                `You have successfully called out absent from ${school} on ${date}.`,
                `Are you calling out absent for any other dates?`
            ],
            reply: [
                { question: "Yes", answer: "select_absent_date" },
                { question: "No", answer: "exit" }
            ]
        },
        "absence_medical_confirmation_needed": {
            says: [
                `Any sick time extending into a fourth day requires a doctor's note clearing you to return to work.`, 
                `Are you sure you want to call out absent for ${date}?`
            ],
            reply: [
                {question: `Yes, I am ready to provide a reason`, answer: "open_absence_reason_modal"},
                {question: "No", answer: "select_absent_date"}
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

async function confirm_absence(){
    var selected_assignment = storageGet("selected_assignment");

    chatWindow.talk(callingOutAbsenceLogic({
        assignments: await get_existing_assignments(),
        date: selected_assignment.date,
        school: selected_assignment.name,
    }), "absence_confirmation_success");

    
}

async function handle_absence_option(index){

    var assignments = await get_existing_assignments();

    var selected_assignment = assignments[index];

    storageSet("selected_assignment", selected_assignment);


    if(Math.random() < 0.5){
        console.log(`All good, marking as absent`);
        return chatWindow.talk(callingOutAbsenceLogic({
            assignments: await get_existing_assignments(),
            date: selected_assignment.date,
            school: selected_assignment.name,
        }), "absence_confirm");


    }else{
        console.log(`Ask for 4-day details`);
        return chatWindow.talk(callingOutAbsenceLogic({
            assignments: await get_existing_assignments(),
            date: selected_assignment.date,
            school: selected_assignment.name,
        }), "absence_medical_confirmation_needed");

    }


    
}



function start_over(){
    chatWindow.talk(chatLogic);
}




document.getElementById('absenceReasonInput').addEventListener('input', function() {
    var reason = document.getElementById('absenceReasonInput').value.trim();
    document.getElementById('confirmAbsenceReason').disabled = reason === '';
});

document.getElementById('confirmAbsenceReason').addEventListener('click', async function() {
    var reason = document.getElementById('absenceReasonInput').value.trim();
    storageSet('absence_reason', reason);
    close_absence_reason_modal('absenceReasonModal');

    var selected_assignment = storageGet("selected_assignment");
    chatWindow.talk(callingOutAbsenceLogic({
        assignments: await get_existing_assignments(),
        date: selected_assignment.date,
        school: selected_assignment.name,
    }), "absence_confirmation_success");


});

document.getElementById('cancelAbsenceReason').addEventListener('click', async function() {
    close_absence_reason_modal('absenceReasonModal');

    var selected_assignment = storageGet("selected_assignment");
    var assignments = await get_existing_assignments();
    chatWindow.talk(callingOutAbsenceLogic({
        assignments,
        school: selected_assignment.name,
        date: selected_assignment.date,
    }), "absence_confirm");
});

function open_absence_reason_modal() {
    document.getElementById(`absenceReasonModal`).classList.add("show");
}

function close_absence_reason_modal(modalId) {
    document.getElementById(modalId).classList.remove("show");
}


async function get_existing_assignments(){
    return [
        {
            name: "Greenwood Elementary",
            address: "1234 Pine Street",
            startTime: "08:00",
            endTime: "15:00",
            date: "Dec 20th",
        },
        {
            name: "Sunnydale High",
            address: "5678 Oak Avenue",
            startTime: "09:00",
            endTime: "16:00",
            date: "Dec 21st",
        },
        {
            name: "Riverside Middle School",
            address: "9012 Elm Boulevard",
            startTime: "08:30",
            endTime: "15:30",
            date: "Dec 22nd",
        }
    ];
}



function absence_option0(){
    handle_absence_option(0);
}
function absence_option1(){
    handle_absence_option(1);
}
function absence_option2(){
    handle_absence_option(2);
}
function absence_option3(){
    handle_absence_option(3);
}
function absence_option4(){
    handle_absence_option(4);
}
function absence_option5(){
    handle_absence_option(5);
}
function absence_option6(){
    handle_absence_option(6);
}
function absence_option7(){
    handle_absence_option(7);
}
function absence_option8(){
    handle_absence_option(8);
}
function absence_option9(){
    handle_absence_option(9);
}
