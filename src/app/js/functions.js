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
