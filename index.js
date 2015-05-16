exports.nodes = require('./lib/nodes');
exports.parse = require('./lib/parser');


var CompilerContext = require('./lib/CompilerContext');
var InterpreterContext = require('./lib/InterpreterContext');

/**
 * Creates a DOM generator function
 * @param  {*} parsed
 * @return {string} The compiled function
 */
exports.asDOMGenerator = function asDOMGenerator(parsed) {
    var ctx = new CompilerContext();
    return parsed.asDOMGenerator(ctx);
};

/**
 * Creates a HTML generator function
 * @param {string} baseDir Path to the template being rendered
 * @param  {*} parsed
 * @return {string} The compiled function
 */
exports.asHTMLGenerator = function asHTMLGenerator(parsed) {
    var ctx = new CompilerContext();
    return parsed.asHTMLGenerator(ctx);
};


/**
 * Creates a HTML response from input
 * @param {string} baseDir Path to the template being rendered
 * @param  {*} parsed
 * @param {object} [scope] The data to render the template with
 * @return {string} The rendered HTML
 */
exports.asHTML = function asHTML(parsed, scope) {
    var ctx = new InterpreterContext(scope);
    return parsed.asHTML(ctx);
};


/**
 * Parses and compiles the template at the provided path
 * @param  {string} path Path to the file
 * @return {*}
 */
exports.compileTemplate = function compileTemplate(path) {
    var source = require('fs').readFileSync(path).toString();
    var parsed = exports.parse(source);
    return exports.asHTMLGenerator(parsed);
};


/**
 * Parses and renders the template at the provided path
 * @param  {string} path Path to the file
 * @param  {object} [options]
 * @param  {Function} cb Callback
 * @return {void}
 */
exports.renderTemplate = function renderTemplate(path, options, cb) {
    if (!cb) {
        cb = options;
        options = {};
    }
    require('fs').readFile(path, function(err, buf) {
        if (err) {
            cb(err, null);
            return;
        }
        var source = buf.toString();
        var parsed = exports.parse(source);

        try {
            cb(null, exports.asHTML(parsed, options));
        } catch (e) {
            cb(e, null);
        }
    });
};
