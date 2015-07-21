var html = require('../html');
var nodes = require('../nodes');


/**
 * @constructor
 * @param {LogicVariable|LogicMember|LogicSubscript} base A variable to pull the member from
 * @param {bool} [unsafe] Whether the variable does not escape its output
 */
function LogicMember(base, unsafe) {
    this.base = base;
    this.name = null;
    this.unsafe = unsafe;
}

/**
 * @param  {object} lex The lexer
 * @return {void}
 */
LogicMember.prototype.parse = function parse(lex) {
    this.name = lex.assert('identifier').text;
};

/**
 * @return {string}
 */
LogicMember.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    if (this.name.indexOf('-') !== -1) {
        return this.base.asDOMGeneratorValue() + '[' + JSON.stringify(this.name) + ']';
    } else {
        return this.base.asDOMGeneratorValue() + '.' + this.name;
    }
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
LogicMember.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
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
LogicMember.prototype.asValue = function asValue(ctx) {
    var temp = this.base.asValue(ctx)
    return temp !== null && temp[this.name];
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicMember.prototype.asHTML = function asHTML(ctx) {
    var out = (this.asValue(ctx) || '').toString();
    if (this.unsafe) {
        return out;
    }
    return html.escape(out);
};

/**
 * @return {string}
 */
LogicMember.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
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
LogicMember.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    if (this.unsafe) {
        ctx.writeLine('output += ' + this.asDOMGeneratorValue() + ';');
    } else {
        ctx.writeLine('output += hesc(' + this.asDOMGeneratorValue() + ');');
    }
};


module.exports = LogicMember;
