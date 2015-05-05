var contentHelper = require('../parserContentHelper');
var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


/**
 * @constructor
 */
function LogicIfNode() {
    this.condition = null;
    this.consequent = null;
    this.alternate = null;
}

/**
 * Parses the contents of an {% if ... %} node
 * @param  {object} lex The lexer
 * @param  {function} inner Something to parse the inside
 * @return {void}
 */
LogicIfNode.prototype.parse = function parse(lex, inner) {
    this.condition = logicHelper.assertInnerExpression(lex);

    lex.assert('%}');

    this.consequent = inner ? inner(lex) : contentHelper.parseContents(lex);

    if (lex.accept('{%else%}')) {
        this.alternate = inner ? inner(lex) : contentHelper.parseContents(lex);
    }

    lex.assert('{%/if');
    lex.assert('%}');
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
LogicIfNode.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    ctx.writeLine('if (' + this.condition.asDOMGeneratorValue(ctx) + ') {');

    ctx.pushIndent();
    this.consequent.forEach(function(n) {
        n.asDOMGenerator(ctx);
    });
    ctx.popIndent();

    if (this.alternate) {
        ctx.writeLine('} else {');

        ctx.pushIndent();
        this.alternate.forEach(function(n) {
            n.asDOMGenerator(ctx);
        });
        ctx.popIndent();
    }

    ctx.writeLine('}');
};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
LogicIfNode.prototype.asHTML = function asHTML(ctx) {
    if (this.condition.asValue(ctx)) {
        return this.consequent.map(function(node) {
            return node.asHTML(ctx);
        }).join('');
    } else if (this.alternate) {
        return this.alternate.map(function(node) {
            return node.asHTML(ctx);
        }).join('');
    } else {
        return '';
    }
};

/**
 * @return {string}
 */
LogicIfNode.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return '"\'" + hesc(scope[' + JSON.stringify(this.name) + ']) + "\'"';
};

/**
 * @param {CompilerContext} ctx
 * @return {void}
 */
LogicIfNode.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('if (' + this.condition.asDOMGeneratorValue(ctx) + ') {');

    ctx.pushIndent();
    this.consequent.forEach(function(n) {
        n.asHTMLGenerator(ctx);
    });
    ctx.popIndent();

    if (this.alternate) {
        ctx.writeLine('} else {');

        ctx.pushIndent();
        this.alternate.forEach(function(n) {
            n.asHTMLGenerator(ctx);
        });
        ctx.popIndent();
    }

    ctx.writeLine('}');
};


module.exports = LogicIfNode;
