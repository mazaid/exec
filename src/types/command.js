var exec = require('child_process').exec;

var joi = require('joi');

var dataSchema = {
    command: joi.string().required(),
    args: joi.array().items(joi.string())
};

var ErrorCodes = {
    INVALID_DATA: 'invalidData'
};

var mazaiError = require('mazaid-error/create')(ErrorCodes);

module.exports = (logger, task) => {

    return new Promise((resolve, reject) => {

        task.started();

        var data = task.data;

        logger.debug('task started', data);

        var joiOptions = {
            convert: true,
            abortEarly: false,
            allowUnknown: false
        };

        joi.validate(task.data, dataSchema, joiOptions, function (error, valid) {
            if (error) {

                logger.trace(error);

                if (error.name === 'ValidationError') {
                    return reject(
                        mazaiError(
                            'invalid data',
                            ErrorCodes.INVALID_DATA
                        )
                        .setList(error.details)
                    );
                } else {
                    return reject(error);
                }
            }

            logger.trace('valid data', valid);

            var cmd = valid.command;

            if (valid.args) {
                cmd += ' ' + valid.args.join(' ');
            }

            var result = {
                error: null,
                code: 0,
                stdout: null,
                stderr: null
            };

            logger.debug('cmd', cmd);

            var timeouted = false;

            var timeout = setTimeout(() => {
                timeouted = true;

                reject(mazaiError(`[mazai-exec] timeout exceed ${task.timeout}s`));
            }, task.timeout * 1000);

            exec(cmd, {maxBuffer: 5 * 1024 * 1024}, (error, stdout, stderr) => {

                if (timeouted) {
                    return;
                }

                clearTimeout(timeout);

                task.finished();

                logger.debug('task finished');

                logger.trace('task finished', error, stdout, stderr);

                result.stdout = stdout;
                result.stderr = stderr;

                if (error) {
                    result.error = error.message;
                    result.code = error.code;
                }

                task.result = result;

                resolve(task);
            });

        });
    });

};
