var exec = require(__dirname + '/../index');
var ExecTask = require('mazaid-exec-task');
var uuid = require('uuid').v4;

var logger = require('log4js').getLogger('ping');

logger.setLevel('DEBUG');

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
        return exec(logger, task);
    })
    .then((task) => {
        // fs.writeFileSync('/tmp/exec.txt', JSON.stringify(task.result));
        // console.log(task.result);
        // console.log(task.result.stdout.split('\n'));
    })
    .catch((error) => {
        console.log(error);
    });
