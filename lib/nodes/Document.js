var contentHelper = require('../parserContentHelper');
var nodes = require('../nodes');


/**
 * @constructor
 */
function Document() {
    this.nodes = [];
}

/**
 * Parses a document
 * @param  {object} lex The lexer
 * @return {void}
 */
Document.prototype.parse = function parse(lex) {
    this.nodes = contentHelper.parseContents(lex, true);
};

/**
 * Returns the HTML serialization of the document.
 * @param {CompilerContext} ctx Current compiler context
 * @return {string}
 */
Document.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine('function template(document, elem, scope) {');

    ctx.pushElem('elem');

    this.nodes.forEach(function(node) {
        node.asDOMGenerator(ctx);
    });

    ctx.popElem();

    ctx.writeLine('}');

    return ctx.flush();
};

/**
 * Returns the HTML serialization of the document.
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
Document.prototype.asHTML = function asHTML(ctx) {
    return this.nodes.map(function(node) {
        return node.asHTML(ctx);
    }).join('');
};

module.exports = Document;
