var fs = require('fs');

var exec = require(__dirname + '/../index');
var ExecTask = require('mazaid-exec-task');
var uuid = require('uuid').v4;

var logger = require('log4js').getLogger('ping');

logger.setLevel('DEBUG');

var curlTimeFormat = {
    dns: '%{time_namelookup}',
    connect: '%{time_connect}',
    appconnect:  '%{time_appconnect}',
    pretransfer: '%{time_pretransfer}',
    redirect: '%{time_redirect}',
    starttransfer: '%{time_starttransfer}',
    total: '%{time_total}'
};

var curlTimeFormatString = '\n\n\n' + JSON.stringify(curlTimeFormat);

var raw = {
    id: uuid(),
    checkTaskId: uuid(),
    type: 'exec',
    data: {
        command: 'curl',
        args: ['-s', '-v', `-w '${curlTimeFormatString}'`, 'https://ngs.ru']
    }
};

var task = new ExecTask(raw);

task.validate()
    .then(() => {
        return exec(logger, task);
    })
    .then((task) => {
        // fs.writeFileSync('/tmp/exec.txt', JSON.stringify(task.result));
        // console.log(task.result.stderr);
        var b = task.result.stdout.split('\n');
        console.log(JSON.parse(b[b.length - 1]));
    })
    .catch((error) => {
        console.log(error);
    });
