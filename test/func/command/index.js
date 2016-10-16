var assert = require('chai').assert;

var uuid = require('uuid').v4;

var ExecTask = require('mazaid-exec-task');

var logger = require('log4js').getLogger();
logger.setLevel('FATAL');

var exec = require(__dirname + '/../../../index');

describe('command', function () {

    it('should success exec command task', function (done) {

        var raw = {
            id: uuid(),
            checkTaskId: uuid(),
            type: 'exec',
            data: {
                command: 'echo',
                args: ['test']
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
                assert.equal(result.code, 0);
                assert.isString(result.stdout);
                assert.isString(result.stderr);
                assert(result.stdout.length > 0);
                assert.equal(result.stderr.length, 0);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });

    it('should error in result', function (done) {

        var raw = {
            id: uuid(),
            checkTaskId: uuid(),
            type: 'exec',
            data: {
                command: 'echooo',
                args: ['test']
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
                assert.equal(result.code, 127);
                assert.isString(result.stdout);
                assert.isString(result.stderr);
                assert(result.stdout.length === 0);
                assert(result.stderr.length > 0);
                // assert.equal(result.stderr, '/bin/sh: echooo: command not found\n');

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
        exec(logger, new ExecTask({type: 'exec', data: {shit: 'false'}}))
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
