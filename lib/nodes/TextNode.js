var html = require('../html');


/**
 * @constructor
 * @param {string} text Text content
 */
function TextNode(text) {
    this.text = text;
}

/**
 * Returns the HTML serialization of the document.
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
TextNode.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine(ctx.peekElem() + '.appendChild(document.createTextNode(' + JSON.stringify(this.text) + '));');
};

/**
 * @return {string}
 */
TextNode.prototype.asHTML = function asHTML() {
    return html.escape(this.text);
};

/**
 * @return {string}
 */
TextNode.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return JSON.stringify(this.asHTML());
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
TextNode.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeOutputString(this.asHTML());
};


module.exports = TextNode;
