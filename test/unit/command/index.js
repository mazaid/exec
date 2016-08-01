var assert = require('chai').assert;

var uuid = require('uuid').v4;

var ExecTask = require('mazaid-exec-task');

var exec = require(__dirname + '/../../../index');

describe('command', function () {

    it('should success exec command task', function (done) {

        var raw = {
            id: uuid(),
            checkTaskId: uuid(),
            type: 'exec',
            data: {
                command: 'ping',
                args: ['-c 1', 'localhost']
            }
        };

        var task = new ExecTask(raw);

        task.validate()
            .then(() => {
                return exec(task);
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
                command: 'pingggg',
                args: ['-c 1', 'localhost']
            }
        };

        var task = new ExecTask(raw);

        task.validate()
            .then(() => {
                return exec(task);
            })
            .then((task) => {
                var result = task.result;

                assert.isNotNull(result.error);
                assert.equal(
                    result.error.message,
                    'Command failed: /bin/sh -c pingggg -c 1 localhost\n/bin/sh: pingggg: command not found\n'
                );
                assert.equal(result.code, 127);
                assert.isString(result.stdout);
                assert.isString(result.stderr);
                assert(result.stdout.length === 0);
                assert(result.stderr.length > 0);
                assert.equal(result.stderr, '/bin/sh: pingggg: command not found\n');

                done();
            })
            .catch((error) => {
                done(error);
            });
    });

});
