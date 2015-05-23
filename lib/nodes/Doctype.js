var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


/**
 * @constructor
 * @param {Token} content
 */
function Doctype(content) {
    this.value = content.text;
}

/**
 * This no-ops in the general case since a DOCTYPE is usually already present
 * on a page.
 * @return {void}
 */
Doctype.prototype.asDOMGenerator = function asDOMGenerator() {
    return;
};

/**
 * @return {string}
 */
Doctype.prototype.asHTML = function asHTML() {
    return this.value;
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
Doctype.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('output += ' + JSON.stringify(this.value) + ';');

};

module.exports = Doctype;
