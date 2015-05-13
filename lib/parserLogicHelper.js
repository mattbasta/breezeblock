var nodes = require('./nodes');


/**
 * Returns an expression or null
 * @param  {object} lex        The lexer
 * @param  {function} [inner] What should be returned by default
 * @return {*}
 */
exports.acceptExpression = function acceptExpression(lex, inner) {
    var temp;

    if (temp = exports.acceptVariable(lex)) {
        return temp;
    }

    if (temp = exports.acceptIf(lex, inner)) {
        return temp;
    }
    return null;
};

/**
 * Accepts a variable bounded by double braces
 * @param  {object} lex The lexer
 * @return {LogicVariable|null}
 */
exports.acceptVariable = function acceptVariable(lex) {
    if (!lex.accept('{{')) {
        return null;
    }

    var out = exports.assertInnerExpression(lex);
    lex.assert('}}');
    return out;
};

/**
 * Accepts an if statement
 * @param  {object} lex The lexer
 * @param  {function} inner
 * @return {LogicIfNode|null}
 */
exports.acceptIf = function acceptIf(lex, inner) {
    if (!lex.accept('{%if')) {
        return null;
    }
    var ifStmt = new nodes.LogicIfNode();
    ifStmt.parse(lex, inner);
    return ifStmt;
};


/**
 * Parses the contents of an inner expression
 * @param  {object} lex The lexer
 * @return {LogicVariable|LogicMember}
 */
exports.assertInnerExpression = function assertInnerExpression(lex) {
    return nodes.LogicMember.parseMember(lex);
};

/**
 * Returns whether the provided node is a variable expression
 * @param  {*} node
 * @return {bool}
 */
exports.isVariableExpression = function isVariableExpression(node) {
    return node instanceof nodes.LogicVariable ||
           node instanceof nodes.LogicMember;
};
