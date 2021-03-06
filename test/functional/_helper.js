var assert = require('assert');
var fs = require('fs');
var path = require('path');

var jsdom = require('jsdom');

var CompilerContext = require('../../lib/CompilerContext');
var InterpreterContext = require('../../lib/InterpreterContext');
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

    var SCOPE = {
        foo: 'Fooval',
        bar: 'Barval',
        unsafeVar: 'This & That',

        isTrue: true,
        isFalse: false,
        isNull: null,

        isChecked: 'checked',

        nested: {
            nestfoo: 'Nestfooval',
            nestbar: 'Nestbarval',

            unsafe: 'That & This',
        },

        identNestfoo: 'nestfoo',

        arr: ['one', 'two', 'three'],
    };

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

                it('compiles with asHTML', function asHTMLTest() {
                    var ctx = new InterpreterContext(SCOPE);

                    var asHTML = parser(source).asHTML(ctx);
                    try {
                        assert.equal(asHTML, expected.trim());
                    } catch (e) {
                        console.log(asHTML);
                        throw e;
                    }
                });

                it('compiles with asDOMGenerator', function asDOMGeneratorTest(done) {
                    var ctx = new CompilerContext();
                    var generator = parser(source).asDOMGenerator(ctx);
                    var generatorLive;
                    try {
                        generatorLive = eval('(' + generator + ')');
                    } catch (e) {
                        console.error(generator);
                        throw e;
                    }

                    jsdom.env('', function(err, window) {
                        if (err) {
                            done(err);
                            return;
                        }

                        var document = window.document;
                        var boundNode = document.createElement('div');
                        var generatorRun = generatorLive({}, document, boundNode, SCOPE);

                        jsdom.env(expected.trim(), function(err, window) {
                            if (err) {
                                done(err);
                                return;
                            }


                            assert.equal(boundNode.innerHTML.trim(), window.document.body.innerHTML.trim());
                            done();
                        });

                    });
                });

                it('compiles with asHTMLGenerator', function asDOMGeneratorTest(done) {
                    var ctx = new CompilerContext();
                    var generator = parser(source).asHTMLGenerator(ctx, true);
                    var generatorLive = eval('(' + generator + ')');
                    var generatorRun = generatorLive({}, SCOPE);

                    jsdom.env(generatorRun, function(err, window) {
                        if (err) {
                            done(err);
                            return;
                        }

                        var parsedHTML = window.document.body.innerHTML;

                        jsdom.env(expected.trim(), function(err, window) {
                            if (err) {
                                done(err);
                                return;
                            }

                            try {
                                assert.equal(parsedHTML, window.document.body.innerHTML);
                            } catch (e) {
                                console.log(generator);
                                throw e;
                            }
                            done();
                        });

                    });
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
