var html = require('../html');


/**
 * @constructor
 */
function LogicVariable() {
    this.name = null;
}

/**
 * @param  {object} lex The lexer
 * @return {void}
 */
LogicVariable.prototype.parse = function parse(lex) {
    this.name = lex.assert('identifier').text;
};

/**
 * @return {string}
 */
LogicVariable.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    return 'scope[' + JSON.stringify(this.name) + ']';
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
LogicVariable.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine(ctx.peekElem() + '.appendChild(document.createTextNode(' + this.asDOMGeneratorValue() + '));');
};

/**
 * @param  {InterpreterContext} ctx
 * @return {*}
 */
LogicVariable.prototype.asValue = function asValue(ctx) {
    return ctx.data[this.name] || null;
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicVariable.prototype.asHTML = function asHTML(ctx) {
    return html.escape((this.asValue(ctx) || '').toString());
};

/**
 * @return {string}
 */
LogicVariable.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return '"\'" + hesc(' + this.asDOMGeneratorValue() + ') + "\'"';
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
LogicVariable.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('output += hesc(' + this.asDOMGeneratorValue() + ');');
};


module.exports = LogicVariable;
