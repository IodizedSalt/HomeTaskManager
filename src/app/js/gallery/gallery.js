function setImgNum(num){
    var file_name = document.getElementById('current_img').src.toString().split('/').slice(-1)[0];
    var current_img_num = parseInt(file_name.split('.')[0])
    if (!isNaN(num) && num != null && num != '') {
        if(num <= parseInt(JSON.parse(sessionStorage.getItem("img_count")))){
            document.querySelector("#current_img").src = '/app/img/piesku/' + num + '.jpg'
        }else{
            var alert_text = "There are only " + parseInt(JSON.parse(sessionStorage.getItem("img_count"))) + " images" 
            alert(alert_text)
            document.querySelector('#stefan_img_input').value =  current_img_num
        }
    }    
}

function randomImg(){
    const img_count = JSON.parse(sessionStorage.getItem("img_count"));
    var randomWholeNumber = Math.floor(Math.random() * img_count) + 1;
    setImgNum(randomWholeNumber)
}

function forceCycle(image_type, increment_amnt) {
    var images = [];
    const img_count = JSON.parse(sessionStorage.getItem("img_count"));
    
    if (image_type == 'stefan') {
        var file_path_array = document.getElementById('current_img').src.toString().split('/');
        var file_name = document.getElementById('current_img').src.toString().split('/').slice(-1)[0];
        file_name = file_name.split('.')[0];
        var updated_file = parseInt(file_name) + parseInt(increment_amnt);
        
        if (parseInt(updated_file) > img_count) {
            updated_file = 1;
        } else if (parseInt(updated_file) <= 0) {
            updated_file = img_count;
        }
        
        updated_file = updated_file.toString() + '.jpg';
        file_path_array.pop();
        file_path_array.push(updated_file.toString());
        var new_file = file_path_array.join('/');
        document.getElementById('current_img').src = new_file;
    }
}

function beginCycle(image_type) {
    const data = { test: "123" };
}

function getImgCount() {
    fetch(API_PREFIX + "/count", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
            test: "test"
        })
    }).then((response) => {
        if (response.ok) {
            response.json().then(img_count_res => {
                sessionStorage.setItem("img_count", parseInt(img_count_res['file_count']));
                // Set the max attribute based on the result of the getImgCount() function

                document.querySelector('#stefan_img_input').setAttribute('placeholder',  "Choose a specific img number. There are only " + parseInt(img_count_res['file_count']) + " images!!");
                document.querySelector('#stefan_img_input').setAttribute('max',  parseInt(img_count_res['file_count']));
                document.querySelector('#stefan_img_input').setAttribute('min',  1);
            });
        }
    });
}
