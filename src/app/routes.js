const express = require("express");
const router = express.Router();
const app = express()
const path = require("path") 
const fs = require("fs")


// app.use(express.static(path.join(__dirname, '/.', '')));
// app.use(express.static(path.join(__dirname, 'js')));
// app.use(express.static(path.join(__dirname, 'css')));
const command =  process.env.SCRIPT_TYPE
var env_type = ""
if(command == 'start'){
    env_type = 'DEV'
}else if(command == 'start_local_dev'){
    env_type = 'LOCAL'
}else{
    env_type = 'LOCAL'
}


// notepad
router.get("/notepad", function (req, res) {
    res.render(__dirname + '/html/notepad.ejs', {env_type});
});


// house maintenance tasks.
router.get("/homemaintenance", function (req, res) {
    res.render(__dirname + '/html/homemaintenance.ejs', {env_type});
});
// house maintenance tasks.
router.get("/gallery", function (req, res) {
    res.render(__dirname + '/html/gallery.ejs', {env_type});
});

// error route.
router.get("/error", function (req, res) {
    res.sendFile(__dirname + '/img/blocked/PageBlocked.png');
});

module.exports = router;