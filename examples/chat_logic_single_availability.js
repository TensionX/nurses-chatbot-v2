async function specificDate() {
    
    

    

    storageSet("assignments", assignments);
    //
    
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

function specificDateAvailability({dates, boroughs, assignments, date, address, startTime, endTime, school}){
    return {
        "date_select": {
            says: [`Select one of the dates you are providing availability.`],
            reply: [
                { question: "None", answer: "other_availability" },
                ...dates.map(function(date, index) {
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
                ...boroughs.map(function(borough, index) {
                return { question: borough.name, answer: "borough_option" + index };
                })
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
async function confirm_specific_date(index){
    console.log(`Confirming the school ${index}`);
    var assignments = storageGet("assignments");
    chatWindow.talk(recurringAvailability(
        {assignments: [], 
            school: assignments[index].name, 
            address: assignments[index].address, 
            startTime: assignments[index].startTime, 
            endTime: assignments[index].endTime, 
            weekday: weekdays[storageGet("weekday")], 
            firstDay: assignments[index].firstDay }
        ), "school_confirm");
}
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

var next10Days = getNext10Days();
console.log(next10Days);
