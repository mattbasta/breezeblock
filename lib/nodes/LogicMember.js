var html = require('../html');
var nodes = require('../nodes');


/**
 * @constructor
 * @param  {LogicVariable} base A variable to pull the member from
 */
function LogicMember(base) {
    this.base = base;
    this.name = null;
}

LogicMember.parseMember = function parseMember(lex) {
    var expr = new nodes.LogicVariable();
    expr.parse(lex);
    if (!lex.accept('.')) {
        return expr;
    }

    var mem = new LogicMember(expr);
    mem.parse(lex);
    return mem;
};

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
    ctx.writeLine(ctx.peekElem() + '.appendChild(document.createTextNode(' + this.asDOMGeneratorValue() + '));');
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
    return html.escape((this.asValue(ctx) || '').toString());
};

/**
 * @return {string}
 */
LogicMember.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return '"\'" + hesc(' + this.asDOMGeneratorValue() + ') + "\'"';
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
LogicMember.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('output += hesc(' + this.asDOMGeneratorValue() + ');');
};


module.exports = LogicMember;
