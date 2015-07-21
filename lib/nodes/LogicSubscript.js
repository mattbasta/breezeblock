var html = require('../html');
var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


/**
 * @constructor
 * @param {LogicVariable|LogicMember|LogicSubscript} base A variable to pull the member from
 * @param {bool} [unsafe] Whether the variable does not escape its output
 */
function LogicSubscript(base, unsafe) {
    this.base = base;
    this.name = null;
    this.unsafe = unsafe;
}

/**
 * @param  {object} lex The lexer
 * @return {void}
 */
LogicSubscript.prototype.parse = function parse(lex) {
    this.name = logicHelper.assertInnerExpression(lex);
    lex.assert(']');
};

/**
 * @return {string}
 */
LogicSubscript.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    return this.base.asDOMGeneratorValue() + '[' + this.name.asDOMGeneratorValue() + ']';
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
LogicSubscript.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    if (this.unsafe) {
        ctx.writeLine(ctx.peekElem() + '.innerHTML = ' + this.asDOMGeneratorValue() + ';');
    } else {
        ctx.writeLine(ctx.peekElem() + '.appendChild(document.createTextNode(' + this.asDOMGeneratorValue() + '));');
    }
};

/**
 * @param  {InterpreterContext} ctx
 * @return {*}
 */
LogicSubscript.prototype.asValue = function asValue(ctx) {
    var temp = this.base.asValue(ctx)
    return temp !== null && temp[this.name.asValue(ctx)];
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicSubscript.prototype.asHTML = function asHTML(ctx) {
    var out = (this.asValue(ctx) || '').toString();
    if (this.unsafe) {
        return out;
    }
    return html.escape(out);
};

/**
 * @return {string}
 */
LogicSubscript.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    if (this.unsafe) {
        return '"\'" + ' + this.asDOMGeneratorValue() + ' + "\'"';
    } else {
        return '"\'" + hesc(' + this.asDOMGeneratorValue() + ') + "\'"';
    }
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
LogicSubscript.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    if (this.unsafe) {
        ctx.writeLine('output += ' + this.asDOMGeneratorValue() + ';');
    } else {
        ctx.writeLine('output += hesc(' + this.asDOMGeneratorValue() + ');');
    }
};


module.exports = LogicSubscript;
