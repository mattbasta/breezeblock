var html = require('../html');


/**
 * @constructor
 * @param {bool} [unsafe] Whether the variable does not escape its output
 */
function LogicVariable(unsafe) {
    this.name = null;
    this.unsafe = unsafe;
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
LogicVariable.prototype.asValue = function asValue(ctx) {
    return ctx.data[this.name] || null;
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicVariable.prototype.asHTML = function asHTML(ctx) {
    var out = (this.asValue(ctx) || '').toString();
    if (this.unsafe) {
        return out;
    }
    return html.escape(out);
};

/**
 * @return {string}
 */
LogicVariable.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    if (this.unsafe) {
        return this.asDOMGeneratorValue();
    }
    return 'hesc(' + this.asDOMGeneratorValue() + ')';
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
LogicVariable.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    if (this.unsafe) {
        ctx.writeLine('output += ' + this.asDOMGeneratorValue() + ';');
    } else {
        ctx.writeLine('output += hesc(' + this.asDOMGeneratorValue() + ');');
    }
};


module.exports = LogicVariable;
