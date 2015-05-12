var nodes = require('../nodes');


/**
 * @constructor
 * @param {*} name Name of the attribute
 */
function ValuelessAttribute(name) {
    this.name = name;
}

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
ValuelessAttribute.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    var attrName;
    if (this.name instanceof nodes.TextNode) {
        attrName = JSON.stringify(this.name.text);
    } else {
        attrName = this.name.asDOMGeneratorValue(ctx);
    }
    ctx.writeLine(ctx.peekElem() + '.setAttribute(' + attrName + '.toLowerCase(), "");');
};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
ValuelessAttribute.prototype.asHTML = function asHTML(ctx) {
    if (this.name instanceof nodes.LogicVariable) {
        return this.name.asHTML(ctx).toLowerCase() + '=""';
    } else {
        return this.name.asHTML(ctx).toLowerCase();
    }
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
ValuelessAttribute.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    if (this.name instanceof nodes.LogicVariable) {
        this.name.asHTMLGenerator(ctx);
    } else {
        ctx.writeLine('output += ' + this.name.asHTMLGeneratorValue(ctx).toLowerCase() + ' + "=\\"\\"";');
    }
};

module.exports = ValuelessAttribute;