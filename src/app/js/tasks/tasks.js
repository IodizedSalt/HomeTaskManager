function getISOWeekNumber(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  
function getTasks() {
    fetch(API_PREFIX + "/list-tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
            current_week_number: current_week_number,
            current_year: new Date().getFullYear(),
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(tasks_list => {
                // console.log(tasks_list)
                sessionStorage.setItem("tasks_list", JSON.stringify(tasks_list));
                const weekDifference = getCurrentWeekDifference(start_date, current_date)
                getTasksWeekly();
                getTasksBiWeekly(weekDifference);
                getTasksMonthly(weekDifference);
                getTasksBiMonthly(weekDifference);
                getTasksQuarterly(weekDifference);
                getTasksBiannually(weekDifference);
                getTasksYearly(weekDifference);
                getTasksBiennialy(weekDifference);
            });
        }
    });
}


function getTasksPeriodicity(periodicity) {
    return JSON.parse(sessionStorage.getItem("tasks_list"))[periodicity];
}

function getTasksWeekly() {
    var tasks = getTasksPeriodicity('weekly');
    appendTaskToDom('weekly', tasks);
}

function getTasksBiWeekly(weekDifference) {
    var tasks = getTasksPeriodicity('biweekly');
    // console.log(weekDifference)
    // if (weekDifference >= 2) {
        appendTaskToDom('biweekly', tasks);
    // }
}

function getTasksMonthly(weekDifference) {
    var tasks = getTasksPeriodicity('monthly');
    // if (weekDifference >= 4) {
        appendTaskToDom('monthly', tasks);
    // }
}

function getTasksBiMonthly(weekDifference) {
    var tasks = getTasksPeriodicity('bimonthly');
    // console.log(weekDifference)
    // if (weekDifference >= 8) {
        appendTaskToDom('bimonthly', tasks);
    // }
}

function getTasksQuarterly(weekDifference) {
    var tasks = getTasksPeriodicity('quarterly');
    
    // if (weekDifference >= 13) {
        appendTaskToDom('quarterly', tasks);
    // }
}

function getTasksBiannually(weekDifference) {
    var tasks = getTasksPeriodicity('biannually');
    
    // if (weekDifference >= 26) {
        appendTaskToDom('biannually', tasks);
    // }
}

function getTasksYearly(weekDifference) {
    var tasks = getTasksPeriodicity('yearly');
    
    // if (weekDifference >= 52) {
        // if (new Date(current_date).getFullYear() - new Date(start_date).getFullYear() > 0) {
            appendTaskToDom('yearly', tasks);
        // }
    // }
}

function getTasksBiennialy(weekDifference) {
    var tasks = getTasksPeriodicity('biennially');
    // if ((current_week_number - start_date_week_number) % 52 === 0) {
    //     if ((new Date(current_date).getFullYear() - new Date(start_date).getFullYear()) % 2 === 0) {
            appendTaskToDom('biennially', tasks);
        // }
    // }
}

function getCurrentWeekDifference(){
    // Calculate the difference in milliseconds between the two dates
    const timeDifference = current_date - start_date;
    
    // Calculate the difference in weeks
    const weekDifference = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    
    return weekDifference;
}



function completeTask(task_id, periodicity) {
    var user_name = prompt("Who are you?");
    if (user_name == null) {
        return; // Cancel click
    } else if (user_name.toUpperCase() == 'COM' || user_name.toUpperCase() == '4414') { // Mis wants numbers instead
        fetch(API_PREFIX + "/complete-task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            body: JSON.stringify({
                "current_week_number": current_week_number, 
                "task_id": task_id, 
                "periodicity": periodicity,
                "completed_by": user_name,
                "completed_time": new Date(),
                "device_info": window.navigator.userAgent
            })
        }).then((response) => {
            if (response.ok) {
                response.text().then(complete_task_status => {
                    complete_task_status = JSON.parse(complete_task_status)
                    if(complete_task_status.status == 0){
                        if(parseInt(complete_task_status.task_id) == parseInt(task_id) && complete_task_status.periodicity == periodicity){
                            const selector = `[task_id="${complete_task_status.task_id}"][task_periodicity="${complete_task_status.periodicity}"]`;
                            document.querySelector(selector).parentNode.remove();
                            if(document.getElementsByClassName("task_element").length == 0){
                                var img_relax = document.createElement("img")
                                img_relax.src = '/app/img/misc/beer.png'
                                document.getElementById("current_tasks").appendChild(document.createElement("br"))
                                document.getElementById("current_tasks").appendChild(img_relax);
                            }
                        }
                    }
                });
            }
        });

    } else {
        location.href = URL_PREFIX + '/error';
    }
}



function appendTaskToDom(periodicity, task_list) {
    if(task_list.length == 0){
        var img_relax = document.createElement("img")
        img_relax.src = '/app/img/misc/beer.png'
        document.getElementById("current_tasks").appendChild(document.createElement("br"))
        document.getElementById("current_tasks").appendChild(img_relax);
    }else{
        Object.entries(task_list['tasks']).forEach(task => {
            const [task_id, task_text] = task;
            const node = document.createElement("div");
            node.className = 'task_element';
            const button = document.createElement("button");
            button.innerHTML = task_text;
            button.setAttribute('task_id', task_id);
            button.setAttribute('task_periodicity', periodicity);
            
            button.className = "btn btn-primary" + " " + periodicity;
            button.onclick = function () {
                completeTask(task_id, periodicity);
            };
            node.appendChild(button);
            node.appendChild(document.createElement("br"));
            node.appendChild(document.createElement("br"));
            document.getElementById("current_tasks").appendChild(node);
        });
        }
    }
    
function appendFutureTaskToDom(task_list) {
    Object.entries(task_list).forEach(task => {
        const [task_id, task_text] = task;
        const node = document.createElement("div");
        const textnode = document.createTextNode(task_text);
        node.appendChild(textnode);
        document.getElementById("upcoming_tasks").appendChild(node);
    });
}