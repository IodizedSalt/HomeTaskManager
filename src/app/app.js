const express = require('express');
const app = express();
const path = require("path");
const port = 8000;
const routes = require("./routes");
const fs = require("fs");
const Swal = require('sweetalert2')

const cors = require('cors');


app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(express.static(path.join(__dirname, '../.', '')));
app.set("view_engine", "ejs");
app.set("views", path.join(__dirname, '../.'));

app.options('*', cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/count', (req, res) => {
  // console.log(req.body);
  const options = {};
  fs.readdir(__dirname + '/img/piesku/', (err, files) => {
    var jpg_count = files.filter(ext => ext.split('.').splice(-1) == 'jpg');
    options['file_count'] = jpg_count.length;
    var count = jpg_count.length;
    fs.writeFile(__dirname + '/data/misc_data.json', JSON.stringify(options), (err) => {
      if (err) throw err;
    });
    res.json(options);
  });
});

app.post("/add-new-task", (req, res) => {
  const filePath = path.join(__dirname, 'html', 'modals' ,'add_task.ejs');
  res.render(filePath);
  // https://stackoverflow.com/questions/2159724/how-can-escaping-be-used-to-prevent-xss-attacks
});
app.post('/list-tasks', (req, res) => {
  const current_week_number = req.body.current_week_number;
  const current_year = req.body.current_year;
  const taskData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks.json', 'utf8'));

  // Read and parse status.json
  const statusData = JSON.parse(fs.readFileSync(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8'));

  // const validPeriodicities = ['weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'yearly', 'biennially'];
  var result = {}
  const validPeriodicities = ['weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'biannually', 'yearly', 'biennially'];

  function checkIfPeriodicityLapsed(task) {
    // console.log(task)
      const timepoints = {
          weekly: 1,
          biweekly: 2,
          monthly: 4,
          bimonthly: 8,
          quarterly: 13,
          biannually: 26,
          yearly: 52,
          biennially: 104
      };
  
      const current_date = new Date();
  
      // Calculate the difference in milliseconds
      const differenceInMilliseconds = current_date - new Date(task.completed_time);
      
      // Calculate the expected elapsed time for the periodicity
      const millisecondsElapsedSinceTaskCompletion = timepoints[task.periodicity] * 7 * 24 * 60 * 60 * 1000;
  
      return differenceInMilliseconds <= millisecondsElapsedSinceTaskCompletion;
  }
  
  function checkTasksPeriodicity(tasks, status) {
      // const tasks = JSON.parse(fs.readFileSync(tasksJson));
      // const status = JSON.parse(fs.readFileSync(statusJson));
  
      const result = {}; // Declare result here to prevent the "identifier result has already been declared" error
      validPeriodicities.forEach(current_periodicity => {
          result[current_periodicity] = {
              tasks: {}
          };
          if (tasks.periodicity.hasOwnProperty(current_periodicity)) {
              const taskList = tasks.periodicity[current_periodicity].tasks;
              // console.log(taskList)
              for (let taskId in taskList) {
                  if (taskList.hasOwnProperty(taskId)) {
                      const taskName = taskList[taskId];
                      let taskCompleted = false;
  
                      if (status.completed_tasks) {
                          for (let year in status.completed_tasks) {
                              if (status.completed_tasks.hasOwnProperty(year)) {
                                  for (let week in status.completed_tasks[year]) {
                                      if (status.completed_tasks[year].hasOwnProperty(week)) {
                                          for (let i = 0; i < status.completed_tasks[year][week].length; i++) {
                                              const task = status.completed_tasks[year][week][i];
                                              if (task.task_id === taskId && task.periodicity === current_periodicity) {
                                                  if (checkIfPeriodicityLapsed(task)) {
                                                      taskCompleted = true;
                                                      break;
                                                  }
                                              }
                                          }
                                      }
                                      if (taskCompleted) break;
                                  }
                              }
                              if (taskCompleted) break;
                          }
                      }
  
                      if (!taskCompleted) {
                          result[current_periodicity].tasks[taskId] = taskName;
                      }
                  }
              }
          }
      });
  
      return result;
  }
  
  // Example usage:
  const tasks_list = checkTasksPeriodicity(taskData, statusData);
  res.json(tasks_list)


});

// Returns an array with week numbers based on timepoint from current week
function calculateNumberOfWeeksFromPeriodicity(periodicity, current_week_number){
  const timepoints = {
    weekly: 1,
    biweekly: 2,
    monthly: 4,
    bimonthly: 8,
    quarterly: 13,
    biannually: 26,
    yearly: 52,
    biennially: 104
  };
  // Get the timepoint for the current periodicity
  const timepoint = timepoints[periodicity];
  var adjust_week_num = []
  var factor_year_change = false
  var week_numbers = Array.from({ length: timepoint }, (_, i) => current_week_number - i);
  week_numbers.forEach(week_num =>{
    week_num = parseInt(week_num)
    // We need to do some maths if the task occurs yearly/biennially, because we later need to look at year number in completed tasks
    if(timepoint >52){
      if(week_num < 1 && week_num > -52){
        adjust_week_num.push(52 + parseInt(week_num))
        factor_year_change = true
      }else if(week_num <= -52 && week_num > -104){
        adjust_week_num.push(104 + parseInt(week_num))
        factor_year_change = true
      }else{
        adjust_week_num.push(parseInt(week_num))
      }
    }else{
      if(week_num < 1){
        adjust_week_num.push(52 + parseInt(week_num))
        factor_year_change = true
      }else{
        adjust_week_num.push(parseInt(week_num))
      }
    }
  })
  return {'adjusted_weeks': adjust_week_num, 'factor_year_change': factor_year_change}

}


app.post('/list-tasks-status', (req, res) => {
  fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', (err, tasks) => {
    const tasks_list_status = JSON.parse(tasks);
    res.json(tasks_list_status);
  });
});


app.post('/complete-task', (req, res) => {
  var current_week_number = req.body.current_week_number
  var current_year_number = new Date().getFullYear() 
  var task_id = req.body.task_id
  var periodicity = req.body.periodicity
  var completed_by = req.body.completed_by
  var completed_time = req.body.completed_time
  var device_info = req.body.device_info
  
  fs.readFile(__dirname + '/data/home_maintenance_tasks.json', (err, tasks) => {
    var tasks_list = JSON.parse(tasks);
    var task_to_add =  {
      'task_id': task_id, 
      'task_name': tasks_list.periodicity[periodicity]['tasks'][task_id],
      'periodicity': periodicity,
      'completed_by': completed_by,
      'completed_time': completed_time,
      'device_info': device_info
    }
    fs.readFile(__dirname + '/data/home_maintenance_tasks_status.json', 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return;
      }
  
      try {
          const jsonData = JSON.parse(data);
          var completedTasks = jsonData.completed_tasks[current_year_number];
          if (completedTasks === undefined){
            // Happy new year
            completedTasks = jsonData.completed_tasks
            completedTasks[current_year_number] = {}
            completedTasks[current_year_number][current_week_number] = [task_to_add];
          }else{
            if (completedTasks.hasOwnProperty(current_week_number)) {
                completedTasks[current_week_number].push(task_to_add);
            } else {
                completedTasks[current_week_number] = [task_to_add];
            }
          }
  
          // Write the updated JSON back to the file.
          fs.writeFile(__dirname + '/data/home_maintenance_tasks_status.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
              if (err) {
                  console.error('Error writing file:', err);
              } else {
                  res.json({status: 0, task_id: task_id, periodicity: periodicity})
              }
          });
      } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
      }
  });
  });

});

app.post('/get-notepad', (req, res) => {
  fs.readFile(__dirname + '/data/notepad.txt', (err, text) => {
    res.send(text);
  });
});

app.post('/save-notepad', (req, res) => {
  fs.writeFile(__dirname + '/data/notepad.txt', req.body['notepad_text'], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error writing to the file.");
    }
    res.send({ response_text: "File has been written successfully.", notepad_text: req.body['notepad_text'] });
  });
});

const command = process.env.SCRIPT_TYPE;

app.use("/routes", routes);

app.listen(port, function(){
  if (command == 'start') {
    console.log("IF YOU ARE DEVELOPING LOCALLY, YOU'VE RUN THE WRONG COMMAND (npm run start_local_dev) :)\n" + `Example app listening on port ${port}!`);
  } else if (command == 'start_local_dev') {
    console.log(`Example app listening on port ${port}!`);
  } else {
    console.log("Please use one of the npm commands (start, start_local_dev) \n" + `Example app listening on port ${port}!`);
  }
});
