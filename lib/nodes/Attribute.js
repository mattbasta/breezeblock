var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


/**
 * @constructor
 * @param {*} name Name of the attribute
 * @param {*} body Contents of the body
 */
function Attribute(name, body) {
    this.name = name;
    this.body = body;
}

/**
 * Returns the HTML serialization of the document.
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
Attribute.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    var attrName;
    if (this.name instanceof nodes.TextNode) {
        attrName = JSON.stringify(this.name.text).toLowerCase();
    } else {
        attrName = this.name.asDOMGeneratorValue(ctx) + '.toLowerCase()';
    }

    var attrValue = this.body.asDOMGeneratorValue(ctx);

    ctx.writeLine(ctx.peekElem() + '.setAttribute(' + attrName + ', ' + attrValue + ');');
};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
Attribute.prototype.asHTML = function asHTML(ctx) {
    var bodyHTML;

    if (this.body instanceof nodes.String) {
        bodyHTML = this.body.asHTML(ctx);
    } else {
        bodyHTML = '"' + this.body.asHTML(ctx) + '"';
    }

    return this.name.asHTML(ctx).toLowerCase() + '=' + bodyHTML;
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
Attribute.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    if (logicHelper.isVariableExpression(this.name)) {
        this.name.asHTMLGenerator(ctx);
    } else if (this.name.asHTMLGenerator) {
        this.name.asHTMLGenerator(ctx);
    } else {
        ctx.writeLine('output += ' + this.name.asHTMLGeneratorValue(ctx).toLowerCase() + ';');
    }

    ctx.writeOutputString('=');
    if (this.body.asHTMLGenerator) {
        this.body.asHTMLGenerator(ctx);
    } else {
        var bodyValue = this.body.asHTMLGeneratorValue(ctx);
        ctx.writeLine('output += ' + bodyValue + ';');
    }

};

module.exports = Attribute;
