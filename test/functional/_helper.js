var assert = require('assert');
var fs = require('fs');
var path = require('path');

var ictx = require('../../lib/InterpreterContext');
var parser = require('../../lib/parser');


function globEach(path_, ext, callback) {
    fs.readdirSync(path_).forEach(function(file) {
        file = path.resolve(path_, file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            globEach(file, ext, callback);
        } else {
            // If it's got the right extension, add it to the list.
            if (path.extname(file) === ext) {
                callback(path.normalize(file));
            }
        }
    });
}

describe('Compile tests', function() {

    globEach(
        path.resolve(__dirname, 'compiletests'),
        '.brz',
        function(btPath) {
            var source = fs.readFileSync(btPath).toString();
            var expected = source;
            if (fs.existsSync(btPath + '.txt')) {
                expected = fs.readFileSync(btPath + '.txt').toString();
            }

            describe(btPath, function() {
                it('parses', function parseTest() {
                    var ctx = new ictx({
                        foo: 'Foo',
                        bar: 'Bar',
                    });

                    var asHTML = parser(source).asHTML(ctx);
                    assert.equal(asHTML, expected);
                });
            });
        }
    );

});

describe('Failure tests', function() {

    globEach(
        path.resolve(__dirname, 'failtests'),
        '.brz',
        function(btPath) {
            var source = fs.readFileSync(btPath).toString();

            var expectedExceptionPath = path.dirname(btPath);
            expectedExceptionPath += path.sep;
            expectedExceptionPath += path.basename(btPath, '.brz') + '.txt';

            it(btPath, function failTestBody() {
                assert.throws(
                    parser.bind(null, source),
                    function(err) {
                        if (fs.existsSync(expectedExceptionPath)) {
                            var exceptionText = fs.readFileSync(expectedExceptionPath).toString();
                            return exceptionText === err.toString();
                        } else {
                            fs.writeFileSync(expectedExceptionPath, err.toString());
                            return true;
                        }
                    }
                );

            });

        }
    );

});
