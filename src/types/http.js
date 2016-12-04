var request = require('superagent');

var joi = require('joi');

var dataSchema = {
    method: joi.string().required().valid(['GET']),
    url: joi.string().required(),
    timeout: joi.number().min(1).default(3),
    data: joi.object(),
    options: joi.object().keys({withRawResponseBody: joi.boolean().default(false)}).default({
        withRawResponseBody: false
    })
};

var ErrorCodes = {
    INVALID_DATA: 'invalidData'
};

var mazaiError = require('mazaid-error/create')(ErrorCodes);

module.exports = (logger, task) => {

    return new Promise((resolve, reject) => {

        task.started();

        logger.trace('task started');

        var rawData = task.data;

        logger.trace(rawData);

        var joiOptions = {
            convert: true,
            abortEarly: false,
            allowUnknown: false
        };

        joi.validate(rawData, dataSchema, joiOptions, function (error, data) {
            if (error) {

                logger.debug(error);

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

            logger.trace('valid data');
            logger.trace(data);

            var result = {
                error: null,
                responseTime: null,
                code: null,
                headers: null,
                body: null,
                rawBody: false
            };

            switch (data.method) {
                case 'GET':
                    var startTime = (new Date()).getTime();

                    request.get(data.url)
                        .timeout(data.timeout * 1000)
                        .end(function (error, res) {

                            logger.trace('task finished', error, (res) ? res.body : null);

                            task.finished();

                            var endTime = (new Date()).getTime();

                            result.responseTime = endTime - startTime;

                            if (res === null || typeof res === 'undefined') {
                                res = {status: null, headers: null, body: null, text: null};
                            }

                            result.code = res.status;
                            result.headers = res.headers;
                            result.body = res.body;

                            if (data.options.withRawResponseBody) {
                                result.rawBody = res.text;
                            }

                            if (error) {
                                result.error = error.message;
                            }

                            task.result = result;

                            resolve(task);
                        });
                    break;

                default:
                    reject(
                        mazaiError(
                            'unknown http method ' + data.method,
                            ErrorCodes.INVALID_DATA
                        )
                    );
                    break;
            }

        });
    });

};
