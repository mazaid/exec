var ExecTask = require('mazaid-exec-task');

var ErrorCodes = {
    INVALID_TASK: 'invalidTask'
};

var error = require('mazaid-error/create')(ErrorCodes);

var execCommand = require('./types/command');
var httpCommand = require('./types/http');

module.exports = (logger, task) => {

    return new Promise((resolve, reject) => {

        if (task.constructor.name !== 'ExecTask') {
            return reject(error('task not instanceof ExecTask', ErrorCodes.INVALID_TASK));
        }

        if (task.type === 'exec') {

            execCommand(logger, task)
                .then((task) => {
                    resolve(task);
                })
                .catch((error) => {
                    reject(error);
                });

        } else if (task.type === 'http') {
            httpCommand(logger, task)
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
