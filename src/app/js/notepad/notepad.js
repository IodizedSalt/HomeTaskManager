function getText() {
    fetch(API_PREFIX + "/get-notepad", {
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
            response.text().then(notepad_text => {
                document.getElementById("notepad_text").value = notepad_text;
                sessionStorage.setItem("notepad_text", notepad_text);
            });
        }
    });
}

var saveInProgress = false;

function saveText() {
    if (!saveInProgress) {
        var notepad_text_payload = document.getElementById("notepad_text").value;
        saveInProgress = true;
        fetch(API_PREFIX + "/save-notepad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            },
            mode: 'cors',
            body: JSON.stringify({
                notepad_text: notepad_text_payload
            })
        }).then((response) => {
            if (response.ok) {
                document.getElementById("save_success_message").style.display = 'block';
                setTimeout(function () {
                    document.getElementById("save_success_message").style.display = 'none';
                }, 3000);
                response.json().then(response => {
                    document.getElementById("notepad_text").value = response['notepad_text'];
                    saveInProgress = false;
                });
            } else if (!response.ok) {
                saveInProgress = false;
                document.getElementById("save_error_message").style.display = 'block';
                setTimeout(function () {
                    document.getElementById("save_error_message").style.display = 'none';
                }, 3000);
            }
        }).catch(error => {
            saveInProgress = false;
            document.getElementById("save_error_message").style.display = 'block';
            setTimeout(function () {
                document.getElementById("save_error_message").style.display = 'none';
            }, 3000);
        });
    }
}
