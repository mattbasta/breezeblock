var contentHelper = require('../parserContentHelper');
var html = require('../html');
var nodes = require('../nodes');


/**
 * @constructor
 */
function Document() {
    this.doctype = null;
    this.nodes = [];
}

/**
 * Parses a document
 * @param  {object} lex The lexer
 * @return {void}
 */
Document.prototype.parse = function parse(lex) {
    var doctype = lex.accept('doctype');
    if (doctype) {
        this.doctype = new nodes.Doctype(doctype);
    }
    this.nodes = contentHelper.parseContents(lex, true);
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @param {bool} standalone Adds escape code code to
 * @return {string}
 */
Document.prototype.asDOMGenerator = function asDOMGenerator(ctx, standalone) {
    ctx.writeLine('function template(templateList, document, elem, scope) {');
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
    var output = '';
    if (this.doctype) {
        output += this.doctype.asHTML(ctx);
    }
    output += this.nodes.map(function(node) {
        return node.asHTML(ctx);
    }).join('');

    return output;
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @param {bool} standalone Adds escape code code to
 * @return {string}
 */
Document.prototype.asHTMLGenerator = function asHTMLGenerator(ctx, standalone) {
    ctx.writeLine('function template(templateList, scope) {');
    ctx.pushIndent();
    if (standalone) {
        ctx.writeLine('var escapeMap = ' + JSON.stringify(html.escapeMap) + ';');
        ctx.writeLine('var hesc = ' + html.escape.toString() + ';');
    }
    ctx.writeLine('var output = "";');

    if (this.doctype) {
        this.doctype.asHTMLGenerator(ctx);
    }

    this.nodes.forEach(function(node) {
        node.asHTMLGenerator(ctx);
    });

    ctx.writeLine('return output;');
    ctx.popIndent();
    ctx.writeLine('}');

    return ctx.flush();
};

module.exports = Document;
