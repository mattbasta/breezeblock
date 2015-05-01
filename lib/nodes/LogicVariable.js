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
    lex.assert('}}');
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
    ctx.writeLine(ctx.peekElem() + '.appendChild(document.createTextNode(scope[' + JSON.stringify(this.name) + ']));');
};

/**
 * @param  {InterpreterContext} ctx
 * @return {*}
 */
LogicVariable.prototype.asValue = function asValue(ctx) {
    return ctx.data[this.name];
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicVariable.prototype.asHTML = function asHTML(ctx) {
    return html.escape((ctx.data[this.name] || '').toString());
};


module.exports = LogicVariable;
