var contentHelper = require('../parserContentHelper');


/**
 * @constructor
 */
function LogicInclude() {
    this.template = null;
}


/**
 * Parses an include
 * @param  {Lexer} lex
 * @return {void}
 */
LogicInclude.prototype.parse = function parse(lex) {
    this.template = contentHelper.parseString(lex);
    lex.assert('%}');
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
LogicInclude.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine('templateList[' + this.template.asDOMGeneratorValue() + '](templateList, document, ' + ctx.peekElem() + ', scope);');
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
LogicInclude.prototype.asHTML = function asHTML(ctx) {
    return ctx.renderTemplate(this.template.asValue(ctx));
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
LogicInclude.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('output += templateList[' + this.template.asHTMLGeneratorValue() + '](templateList, scope);');
};


module.exports = LogicInclude;
