var nodes = require('./nodes');


/**
 * Returns an expression or null
 * @param  {object} lex        The lexer
 * @param  {function} [defaultParser] What should be returned by default
 * @return {*}
 */
exports.acceptExpression = function acceptLogic(lex, defaultParser) {
    var temp;

    if (temp = exports.acceptVariable(lex)) {
        return temp;
    }

    if (temp = exports.acceptIf(lex)) {
        return temp;
    }

    if (defaultParser) {
        return defaultParser(lex);
    } else {
        return null;
    }

};

/**
 * Accepts a variable bounded by double braces
 * @param  {object} lex The lexer
 * @return {LogicVariable|null}
 */
exports.acceptVariable = function acceptVariable(lex) {
    var temp = lex.accept('{{');
    if (!temp) {
        return null;
    }
    var expr = new nodes.LogicVariable();
    expr.parse(lex);
    return expr;
};

/**
 * Accepts an if statement
 * @param  {object} lex The lexer
 * @return {LogicIfNode|null}
 */
exports.acceptIf = function acceptIf(lex) {
    var temp = lex.accept('{%if');
    if (!temp) {
        return null;
    }
    var ifStmt = new nodes.LogicIfNode();
    ifStmt.parse(lex);
    return ifStmt;
};

/**
 * Parses the contents of an inner expression
 * @param  {object} lex The lexer
 * @return {LogicVariable}
 */
exports.assertInnerExpression = function assertInnerExpression(lex) {
    // TODO: make this more expansive
    var ident = lex.assert('identifier');
    return new nodes.LogicVariable(ident.text);
};
