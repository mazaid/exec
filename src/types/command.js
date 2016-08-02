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

module.exports = (task) => {

    return new Promise((resolve, reject) => {

        task.started();

        var data = task.data;

        var joiOptions = {
            convert: true,
            abortEarly: false,
            allowUnknown: false
        };

        joi.validate(task.data, dataSchema, joiOptions, function (error, valid) {
            if (error) {
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

            exec(cmd, (error, stdout, stderr) => {

                task.finished();

                result.stdout = stdout;
                result.stderr = stderr;

                if (error) {
                    result.error = error;
                    result.code = error.code;
                }

                task.result = result;

                resolve(task);
            });

        });
    });

};
