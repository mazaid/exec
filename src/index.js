var ExecTask = require('mazaid-exec-task');

var ErrorCodes = {
    INVALID_TASK: 'invalidTask'
};

var error = require('mazaid-error/create')(ErrorCodes);

var execCommand = require('./types/command');
var httpCommand = require('./types/http');

module.exports = (task) => {

    return new Promise((resolve, reject) => {
        if (task instanceof ExecTask === false) {
            return reject(error('task not instanceof ExecTask', ErrorCodes.INVALID_TASK));
        }

        if (task.type === 'exec') {

            execCommand(task)
                .then((task) => {
                    resolve(task);
                })
                .catch((error) => {
                    reject(error);
                });

        } else if (task.type === 'http') {
            httpCommand(task)
                .then((task) => {
                    resolve(task);
                })
                .catch(function (error) {
                    reject(error);
                });

        } else {
            return reject(
                error('unknown ExecTask type = ' + task.type, ErrorCodes.INVALID_TASK)
            );
        }
    });

};
