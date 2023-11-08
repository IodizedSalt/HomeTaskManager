// Example Post
// function examplePost() {
//     fetch("http://localhost:8000/some-api-endpoint", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         },
//         mode: 'cors',
//         body: JSON.stringify({
//             test: "test123"
//         })
//     }).then((response) => {
//         if (response.ok) {
//             response.json().then(jsonresponse => {
//                 // 'asdf'
//                 console.log(jsonresponse);
//             });
//         }
//     });
// }

const ENV_TYPE = document.currentScript.getAttribute('env_type');

if (ENV_TYPE == 'LOCAL') {
    var API_PREFIX = 'http://localhost:8000';
    var URL_PREFIX = 'http://localhost:8000/routes';
} else if (ENV_TYPE == 'DEV') {
    var API_PREFIX = 'http://192.168.1.160:49160';
    var URL_PREFIX = 'http://192.168.1.160:49160/routes';
}
console.log(URL_PREFIX)

// Initial start date that will be forever used to calculate when tasks need to be accomplished
// ヽ༼ຈل͜ຈ༽ﾉ All hail ISO 8601 ヽ༼ຈل͜ຈ༽ﾉ
var start_date = new Date("2023-08-11T00:00:00.000Z")
var start_date_week_number = getISOWeekNumber(start_date);

var current_date = new Date()
var current_week_number = getISOWeekNumber(new Date())
// var current_week_number = 1
// console.log(current_week_number)

function godMode(){
    const elementsToRemove = document.querySelectorAll('.task_element');

    elementsToRemove.forEach(element => {
        element.remove();
        if(document.getElementsByClassName("task_element").length == 0){
            var img_relax = document.createElement("img")
            img_relax.src = '/app/img/misc/beer.png'
            document.getElementById("current_tasks").appendChild(document.createElement("br"))
            document.getElementById("current_tasks").appendChild(img_relax);
        }
    });
}
