var ExecTask = require('mazaid-exec-task');
var error = require('mazaid-error');

var execCommand = require('./types/command');

module.exports = (task) => {

    return new Promise((resolve, reject) => {
        if (!task instanceof ExecTask) {
            return reject(error('task not instanceof ExecTask'));
        }

        if (task.type == 'exec') {

            execCommand(task)
                .then((task) => {
                    resolve(task);
                })
                .catch((error) => {
                    reject(error);
                });

        } else {
            return reject(error('unknown ExecTask type = ' + task.type));
        }
    });

};
