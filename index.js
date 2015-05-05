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
 * @param  {*} parsed
 * @return {string} The compiled function
 */
exports.asHTMLGenerator = function asHTMLGenerator(parsed) {
    var ctx = new CompilerContext();
    return parsed.asHTMLGenerator(ctx);
};


/**
 * Creates a HTML response from input
 * @param  {*} parsed
 * @param {object} [scope] The data to render the template with
 * @return {string} The rendered HTML
 */
exports.asHTMLGenerator = function asHTMLGenerator(parsed, scope) {
    var ctx = new InterpreterContext(scope);
    return parsed.asHTML(ctx);
};
