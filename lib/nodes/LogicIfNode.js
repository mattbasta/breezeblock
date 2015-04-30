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
 * @return {void}
 */
LogicIfNode.prototype.parse = function parse(lex) {
    this.condition = logicHelper.assertInnerExpression(lex);

    lex.assert('%}');

    this.consequent = contentHelper.parseContents(lex);

    if (lex.accept('{%else%}')) {
        this.alternate = contentHelper.parseContents(lex);
    }

    lex.assert('{%/if');
    lex.assert('%}');
};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
LogicIfNode.prototype.asHTML = function asHTML(ctx) {
    if (this.condition.execute(ctx)) {
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


module.exports = LogicIfNode;
