async function handleRecurringDay(day) {
    
    storageSet("weekday", day);

    var assignments = await getRecurringSchools(day);

    storageSet("assignments", assignments);
    //
    
    console.log(`Any Recurring Assignments?`);

    if(assignments.length){
        

        

        //Go into conflict flow


        if(await haveConflict(assignments)){
            return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "schedule_conflict");
        }else{
            return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "school_select");
        }

        
    }else{
        //No openings
        console.log(`No openings`);
        var date = closestWeekDate(storageGet("weekday"));
        if(await scheduledFor(date)){
            debugger;

            //Already scheduled for next WeekDay
            var school = (await scheduleStatusApi({"from": date, "to": date}))[0].scheduledWork.school_name;
            return chatWindow.talk(recurringAvailability({assignments, school, weekday: weekdays[storageGet("weekday")]}), "already_scheduled");
        }else{

            //Not scheduled for next WeekDay

            var nextWeekdayAvailability = (await scheduleStatusApi({"from": closestWeekDate(storageGet("weekday")), "to": closestWeekDate(storageGet("weekday"))})).length;
            if(nextWeekdayAvailability){
                console.log(`There are openings next weekday`);
                return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "single_date_availability");
            }else{
                return chatWindow.talk(recurringAvailability({assignments, weekday: weekdays[storageGet("weekday")]}), "nothing_available");
            }

        }
    }
    // Logic for handling recurring day
    // 'day' parameter will be the name of the weekday
    console.log("Handling recurring availability for: " + day);

    chatWindow.talk(chatLogic);
    // Implement the logic for what happens when a user selects a recurring day
    // This might include storing their choice, confirming their selection, etc.
}

function recurringAvailability({assignments, weekday, firstDay, address, startTime, endTime, school}){
    return {
        "school_select": {
            says: [`For Every ${weekday}, please select one of the following schools:`],
            reply: [
                
                ...assignments.map(function(school, index) {
                    return { question: school.name, answer: "recurring_option" + index };
                }).reverse(),

                { question: "None", answer: "other_availability" },
                
            ]
        },
        "school_confirm": {
            says: [
                `Great! You are confirmed at ${school} for Every ${weekday} starting ${firstDay}. The address is ${address} and the hours are ${startTime} through ${endTime}. Remember: Calling In Attendance is required when you arrive at the school.`,
                `Would you like to provide availability for any additional recurring assignments?`
            ],
            reply: [
                
                { question: "Yes", answer: "start_recurring" },
                { question: "No", answer: "exit" },
            ]
        },
        "other_availability": {
            says: [`Would you like to provide availability for any additional recurring assignments?`
        ],
        reply: [
            
            { question: "Yes", answer: "start_recurring" },
            { question: "No", answer: "exit" },
        ]
        },

        "schedule_conflict": {
            says: [
                `There are ${assignments.length} recurring assignments available for Every ${weekday}. Unfortunately, your request cannot be completed because you have a scheduling conflict. Please contact the school nursing line at xxx-xxxxxxx to complete your request.`,
                "Would you like to provide availability for any additional recurring assignments?"
            ],
            reply: [
                { question: "Yes", answer: "start_recurring" },
                { question: "No", answer: "exit" }
            ]
        },
        "already_scheduled": {
            says: [
                `There are currently no recurring assignments available for Every ${weekday}.`,
                `You are already scheduled at ${school} this ${weekday}. Please contact the school nursing line at xxx-xxxxxxx if you have any questions.`,
                "Would you like to provide availability for any additional recurring assignments?"
            ],
            reply: [
                { question: "Yes", answer: "start_recurring" },
                { question: "No", answer: "exit" }
            ]
        },
        "nothing_available": {
            says: [
                `There are currently no recurring assignments available for Every ${weekday}.`,
                "We will contact you if something becomes available.",
                "Would you like to provide availability for any additional recurring assignments?"
            ],
            reply: [
                { question: "Yes", answer: "start_recurring" },
                { question: "No", answer: "exit" }
            ]
        },
        "single_date_availability": {
            says: [
                `There are currently no recurring assignments available for Every ${weekday}.`,
                `Would you like to check if there are any assignments available for This ${weekday}?`
            ],
            reply: [
                { question: "Yes", answer: "start_single_weekday"},
                { question: "No", answer: "start_recurring" }
            ]
        },
        "exit": {
            says: ["Thank you! If you need anything else, just ask."],
            reply: [
                {question: "Start over", answer: "start_over"},
                {question: "Log out", answer: "log_out"},
            ]
            // End of flow
        }
    };

    
} 

function start_recurring(){
    chatWindow.talk(chatLogic, "recurringDays");
}
function start_single_weekday(){
    // alert(`Start single date, skip date choice`);
    storageSet("recurring_to_singe", closestWeekDate(storageGet("weekday")));
    chatWindow.talk(chatLogic, "specificDate");
}
function start_over(){
    chatWindow.talk(chatLogic);
}
function recurring_option0(){
    confirm_recurring_school(0);
}
function recurring_option1(){
    confirm_recurring_school(1)
}
function recurring_option2(){
    confirm_recurring_school(2)
}
function recurring_option3(){
    confirm_recurring_school(3)
}
function recurring_option4(){
    confirm_recurring_school(4)
}
function recurring_option5(){
    confirm_recurring_school(5)
}
function recurring_option6(){
    confirm_recurring_school(6)
}
async function confirm_recurring_school(index){
    console.log(`Confirming the school ${index}`);
    var assignments = storageGet("assignments");

    var assignment = storageGet("assignments")[index];
    var date = storageGet("date");

    var confirm_result = await confirmBookingApi(date.value, assignment.eWebRecordID);


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
async function getRecurringSchools(day){

    var weekday = storageGet("weekday");


    //Temp for test only
    var openings = await getOpeningsApi({"from": closestWeekDate(weekday), "to": closestWeekDate(weekday)}, recurring = true);
    // var openings = await getOpeningsApi({"from": today(-356), "to": today()}, recurring = false);

    openings = openings.map(opening =>{
        return {
            name: opening.Openings.School,
            address: opening.Openings.Address,
            startTime: opening.Openings.StartTime,
            endTime: "'to be determined'"

        }
    });
   return openings;
}

async function haveConflict(){

    return false;
}


async function scheduledFor(date){
    var result = await scheduleStatusApi({"from": date, "to": date});
    return result.length ? true : false;
}