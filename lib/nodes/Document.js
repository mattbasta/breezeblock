var contentHelper = require('../parserContentHelper');
var html = require('../html');
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
 * @param {CompilerContext} ctx Current compiler context
 * @return {string}
 */
Document.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine('function template(document, elem, scope) {');
    ctx.pushIndent();

    ctx.pushElem('elem');

    this.nodes.forEach(function(node) {
        node.asDOMGenerator(ctx);
    });

    ctx.popElem();

    ctx.popIndent();
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

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {string}
 */
Document.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('function template(scope) {');
    ctx.pushIndent();
    ctx.writeLine('var escapeMap = ' + JSON.stringify(html.escapeMap) + ';');
    ctx.writeLine('var hesc = ' + html.escape.toString() + ';');
    ctx.writeLine('var output = "";');

    this.nodes.forEach(function(node) {
        node.asHTMLGenerator(ctx);
    });

    ctx.writeLine('return output;');
    ctx.popIndent();
    ctx.writeLine('}');

    return ctx.flush();
};

module.exports = Document;
