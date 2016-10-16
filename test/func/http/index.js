var assert = require('chai').assert;

var uuid = require('uuid').v4;

var ExecTask = require('mazaid-exec-task');

var logger = require('log4js').getLogger();
logger.setLevel('FATAL');

var exec = require(__dirname + '/../../../index');

describe('http', function () {

    it('should success http command task', function (done) {

        var raw = {
            id: uuid(),
            checkTaskId: uuid(),
            type: 'http',
            data: {
                method: 'GET',
                url: 'https://api.github.com/'
            }
        };

        var task = new ExecTask(raw);

        task.validate()
            .then(() => {
                return exec(logger, task);
            })
            .then((task) => {
                var result = task.result;

                assert.isNull(result.error);
                assert.equal(result.code, 200);
                assert.isObject(result.body);
                assert.isFalse(result.rawBody);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    return;

    it('should error in result', function (done) {

        var raw = {
            id: uuid(),
            checkTaskId: uuid(),
            type: 'http',
            data: {
                method: 'GET',
                url: 'https://api.github.commm'
            }
        };

        var task = new ExecTask(raw);

        task.validate()
            .then(() => {
                return exec(logger, task);
            })
            .then((task) => {
                var result = task.result;

                assert.isNotNull(result.error);
                assert.equal(result.code, null);

                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('should error on non ExecTask object', function (done) {
        exec(logger, {})
            .then(() => {
                done(new Error('not here'));
            })
            .catch((error) => {
                assert(error.checkable);
                assert.equal(error.message, 'task not instanceof ExecTask');
                assert.equal(error.code, 'invalidTask');
                done();
            });
    });

    it('should error on unknown ExecTask type', function (done) {
        exec(logger, new ExecTask({type: 'abcdef'}))
            .then(() => {
                done(new Error('not here'));
            })
            .catch((error) => {
                assert(error.checkable);
                assert.equal(error.message, 'unknown ExecTask type = abcdef');
                assert.equal(error.code, error.ErrorCodes.INVALID_TASK);
                done();
            });
    });

    it('should error on invalid ExecTask Command data', function (done) {
        exec(logger, new ExecTask({type: 'http', data: {shit: 'false'}}))
            .then(() => {
                done(new Error('not here'));
            })
            .catch((error) => {
                assert.equal(error.code, error.ErrorCodes.INVALID_DATA);
                assert.equal(error.message, 'invalid data');
                done();
            });
    });

});
