async function specificDate() {
    
    

    var dates = getNext10Days();
    console.log(dates);
    chatWindow.talk(specificDateAvailability({dates}), "date_select");
    //
    return;
    console.log(`Any Recurring Assignments?`);

    if(Math.random() < 0.5){
        console.log(`yes`);

        console.log(`has conflict?`);

        //Go into conflict flow


        if(Math.random() < 0.5){
            console.log(`Schedule conflict`);
            // alert("Schedule conflict");
            return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "schedule_conflict");
        }else{
            console.log(`No schedule conflict`);
            return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "school_select");
        }
    }else{
        console.log(`No openings`);
        if(Math.random() < 0.5){
            console.log(`Already scheduled for next Weekday`);
            return chatWindow.talk(recurringAvailability({assignments, school: "[[Scheduled School]]", weekday: weekdays[storageGet("weekday")]}), "already_scheduled");
        }else{
            console.log(`Not scheduled for next weekday`);
            if(Math.random() < 0.5){
                console.log(`There are openings next weekday`);
                return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "single_date_availability");
            }else{
                return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "nothing_available");
                console.log(`No openings next weekday`);
            }

        }
    }
}

function specificDateAvailability({dates, boroughs, borough, assignments, date, address, startTime, endTime, school}){
    return {
        "date_select": {
            says: [`Select one of the dates you are providing availability.`],
            reply: [
                { question: "None", answer: "other_availability" },
                ...(dates || []).map(function(date, index) {
                    return { question: date.name, answer: "single_option" + index };
                }).reverse(),
                
            ]
        },
        "boroughs_select": {
            says: [
                `There are openings on ${date} available in the following boroughs. Which borough would you like to check?`
            ],
            reply: [
                {question: "None", answer: "exit"}, 
                ...(boroughs || []).map(function(borough, index) {
                return { question: borough.name, answer: "borough_option" + index };
                })
            ]
        },
        "schools_select": {
            says: [
                `OK. I found ${(assignments || []).length} openings available for ${date} on ${borough}.`,
                `Are you available to work at one of the schools listed below?`
            ],
            reply: [
                {question: "No / Exit", answer: "exit"},
                {question: "No / Change Boroughs", answer: "boroughs_select"},
                ...(assignments || []).map(function(assignment, index) {
                return { question: assignment.name, answer: "school_option" + index };
            })
            ]
        },
        "school_confirm": {
            says: [
                `Great! You are confirmed at ${school} for ${date}. The address is ${address} and the hours are ${startTime} through ${endTime}. Remember, Calling In Attendance is required when you arrive at the school.`,
                `Would you like to provide availability for another date?`
            ],
            reply: [
                { question: "Yes", answer: "date_select" },
                { question: "No", answer: "exit" }
            ]
        },
        "already_scheduled": {
            says: [
                `You are already scheduled at ${school} on ${date}. Please contact the school nursing line at xxx-xxxxxxx`,
                `Would you like to provide availability for another SPECIFIC DATE?`
            ],
            reply: [
                { question: "Yes", answer: "ice" },
                { question: "No", answer: "exit" }
            ]
        },
        "nothing_available": {
            says: [
                "Thank you for providing your availability.",
                `We currently don't have any openings available for you on ${date}. Someone will contact you if an open shift becomes available.`
            ],
            reply: [
                { question: "Start Over", answer: "start_over" }
            ]
        },
        "exit": {
            says: ["Thank you! If you need anything else, just ask."],
            reply: [{question: "Start over", answer: "start_over"} ]
            // End of flow
        }
    };

    
} 

async function confirm_specific_date(index){
    storageSet("date", getNext10Days()[index]);
    
    var boroughs = await getBoroughs();
    chatWindow.talk(specificDateAvailability(
        {
            boroughs,
            date: getNext10Days()[index].name,
            // school: assignments[index].name, 
            // address: assignments[index].address, 
            // startTime: assignments[index].startTime, 
            // endTime: assignments[index].endTime, 
            // weekday: weekdays[storageGet("weekday")], 
            // firstDay: assignments[index].firstDay 
        }
        ), "boroughs_select");
}

async function confirm_borough(index){
    storageSet("borough_index", index);
    var assignments = await get_borough_assignments();
    var boroughs = await getBoroughs();
    console.log(storageGet("date").name);
    var dates = getNext10Days();
    console.log(storageGet("date"));
    chatWindow.talk(specificDateAvailability(
        {
            date: storageGet("date").name,
            assignments,
            boroughs,
            dates,
            borough: boroughs[index].name
            // school: assignments[index].name, 
            // address: assignments[index].address, 
            // startTime: assignments[index].startTime, 
            // endTime: assignments[index].endTime, 
            // weekday: weekdays[storageGet("weekday")], 
            // firstDay: assignments[index].firstDay 
        }
        ), "schools_select");
};


async function confirm_school(index){
    var assignments = await get_borough_assignments();
    var boroughs = await getBoroughs();
    chatWindow.talk(specificDateAvailability(
        {
            date: storageGet("date").name,

            assignments,
            boroughs,
            borough: boroughs[index].name,
            school: assignments[index].name,
            // school: assignments[index].name, 
            address: assignments[index].address, 
            startTime: assignments[index].startTime, 
            endTime: assignments[index].endTime, 
            // weekday: weekdays[storageGet("weekday")], 
            // firstDay: assignments[index].firstDay 
        }
        ), "school_confirm");

};
function getNext10Days() {
    var days = [];
    for (var i = 0; i <= 9; i++) {
        var date = new Date();
        date.setDate(date.getDate() + i);
        
        var dayName = date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }); // e.g., "Dec 20"
        var dayValue = date.toISOString().split('T')[0]; // Format: "2023-12-20"

        days.push({ name: dayName, value: dayValue });
    }
    return days;
}



async function getBoroughs(){
    return [{name: `Manhattan`},{name: `Staten Island`},{name: `The Bronx`}
    ]
}

async function get_borough_assignments(index){
    return [
        {
            name: "Greenwood Elementary",
            address: "1234 Pine Street",
            startTime: "08:00",
            endTime: "15:00",
            firstDay: "Dec 20th",
        },
        {
            name: "Sunnydale High",
            address: "5678 Oak Avenue",
            startTime: "09:00",
            endTime: "16:00",
            firstDay: "Dec 21st",
        },
        {
            name: "Riverside Middle School",
            address: "9012 Elm Boulevard",
            startTime: "08:30",
            endTime: "15:30",
            firstDay: "Dec 22nd",
        }
    ];
}

function start_over(){
    chatWindow.talk(chatLogic);
}
function single_option0(){
    confirm_specific_date(0);
}
function single_option1(){
    confirm_specific_date(1)
}
function single_option2(){
    confirm_specific_date(2)
}
function single_option3(){
    confirm_specific_date(3)
}
function single_option4(){
    confirm_specific_date(4)
}
function single_option5(){
    confirm_specific_date(5)
}
function single_option6(){
    confirm_specific_date(6)
}
function single_option7(){
    confirm_specific_date(7)
}
function single_option8(){
    confirm_specific_date(8)
}
function single_option9(){
    confirm_specific_date(9)
}


function borough_option0(){
    confirm_borough(0);
}
function borough_option1(){
    confirm_borough(1);
}
function borough_option2(){
    confirm_borough(2);
}
function borough_option3(){
    confirm_borough(3);
}
function borough_option4(){
    confirm_borough(4);
}
function borough_option5(){
    confirm_borough(5);
}
function borough_option6(){
    confirm_borough(6);
}
function borough_option7(){
    confirm_borough(7);
}
function borough_option8(){
    confirm_borough(8);
}

function school_option0(){
    confirm_school(0);
}
function school_option1(){
    confirm_school(1);
}
function school_option2(){
    confirm_school(2);
}
function school_option3(){
    confirm_school(3);
}
function school_option4(){
    confirm_school(4);
}
function school_option5(){
    confirm_school(5);
}
function school_option6(){
    confirm_school(6);
}
function school_option7(){
    confirm_school(7);
}
function school_option8(){
    confirm_school(8);
}
