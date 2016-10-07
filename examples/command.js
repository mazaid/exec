var exec = require(__dirname + '/../index');
var ExecTask = require('mazaid-exec-task');
var uuid = require('uuid').v4;

var raw = {
    id: uuid(),
    checkTaskId: uuid(),
    type: 'exec',
    data: {
        command: 'ping',
        args: ['-c 1', 'localhost']
    }
};

var task = new ExecTask(raw);

task.validate()
    .then(() => {
        return exec(task);
    })
    .then((task) => {
        console.log(task.result);
        // console.log(task.result.stdout.split('\n'));
    })
    .catch((error) => {
        console.log(error);
    });
