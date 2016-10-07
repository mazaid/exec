var exec = require(__dirname + '/../index');
var ExecTask = require('mazaid-exec-task');
var uuid = require('uuid').v4;

var raw = {
    id: uuid(),
    checkTaskId: uuid(),
    type: 'http',
    data: {
        method: 'GET',
        url: 'https://api.github.com/repos/octocat/Hello-World/commits?author=octocat&since=2012-03-06T23:06:50Z'
    }
};

var task = new ExecTask(raw);

task.validate()
    .then(() => {
        return exec(task);
    })
    .then((task) => {
        console.log(require('util').inspect(task, {
            depth: null
        }));
    })
    .catch((error) => {
        console.log(error);
    });
    