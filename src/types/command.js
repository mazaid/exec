var exec = require('child_process').exec;

var joi = require('joi');

var dataSchema = {
    command: joi.string().required(),
    args: joi.array().items(joi.string())
};

module.exports = (task) => {

    return new Promise((resolve, reject) => {
        var data = task.data;

        var joiOptions = {
            convert: true,
            abortEarly: false,
            allowUnknown: false
        };

        joi.validate(task.data, dataSchema, joiOptions, function (err, valid) {
            if (err) {
                // TODO mazaid-error
                return reject(err);
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
