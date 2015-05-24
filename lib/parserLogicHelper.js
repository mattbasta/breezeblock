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
 * @return {LogicVariable|LogicMember|LogicSubscript}
 */
exports.assertInnerExpression = function assertInnerExpression(lex) {
    var temp = exports.acceptInnerLiteral(lex);
    if (temp) {
        return temp;
    }

    var expr = new nodes.LogicVariable();
    expr.parse(lex);

    function parseMember(expr) {
        if (lex.accept('.')) {
            var mem = new nodes.LogicMember(expr);
            mem.parse(lex);
            return parseMember(mem);
        }
        if (lex.accept('[')) {
            var mem = new nodes.LogicSubscript(expr);
            mem.parse(lex);
            return parseMember(mem);
        }

        return expr;
    }

    return parseMember(expr);
};

/**
 * Accepts a literal expression
 * @param  {Lexer} lex The lexer
 * @return {String|null}
 */
exports.acceptInnerLiteral = function acceptInnerLiteral(lex) {
    var text;

    // Double quotes
    if (lex.accept('"')) {
        return parseStringLiteral(lex, '"');
    } else if (lex.accept("'")) {
        return parseStringLiteral(lex, "'");
    }

    var temp;
    if (temp = lex.accept('float')) {
        return new nodes.Number(parseFloat(temp.text));
    }
    if (temp = lex.accept('int')) {
        return new nodes.Number(parseInt(temp.text, 10));
    }

    return null;
};

/**
 * Parses a string with the given end token
 * @param  {Lexer} lex
 * @param  {string} endToken
 * @return {String}
 */
function parseStringLiteral(lex, endToken) {
    var text;
    var contents = [];

    while (true) {
        text = lex.readUntil([endToken, '{{']);
        if (text) {
            contents.push(text);
        }
        if (lex.isEOF()) {
            throw new SyntaxError('Unterminated string at end of file');
        }
        if (lex.accept('{{')) {
            contents.push(exports.assertInnerExpression(lex));
            lex.assert('}}');
            continue;
        }
        if (lex.accept(endToken)) {
            break;
        }
    }
    return new nodes.String(contents);
}

/**
 * Returns whether the provided node is a variable expression
 * @param  {*} node
 * @return {bool}
 */
exports.isVariableExpression = function isVariableExpression(node) {
    return node instanceof nodes.LogicVariable ||
           node instanceof nodes.LogicMember ||
           node instanceof nodes.LogicSubscript;
};
