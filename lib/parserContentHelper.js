var logicHelper = require('./parserLogicHelper');
var nodes = require('./nodes');


/**
 * Outputs an array of nodes that would be found in the root or within the body
 * of a Node.
 * @param  {object} lex       The lexer
 * @param  {bool} [assertEOF] Whether to assert for EOF when nothing is left to parse
 * @return {array}
 */
exports.parseContents = function parseContents(lex, assertEOF) {
    var text;
    var node;
    var nextToken;
    var temp;

    var outputNodes = [];

    while (true) {
        text = lex.readUntil(['<', '{{', '{%if']);
        if (text) {
            outputNodes.push(new nodes.TextNode(text));
        }

        nextToken = lex.accept('<');
        if (nextToken) {
            temp = new nodes.Node(nextToken);
            temp.parse(lex);
            outputNodes.push(temp);
            continue;
        }

        temp = logicHelper.acceptExpression(lex);
        if (temp) {
            outputNodes.push(temp);
            continue;
        }

        if (assertEOF) {
            lex.assert('EOF');
        }
        break;

    }

    return outputNodes;

};

/**
 * Parses a string
 * @param  {object} lex The lexer
 * @return {*}
 */
exports.parseString = function parseString(lex) {
    var text;

    // Double quotes
    if (lex.accept('"')) {
        text = lex.readUntil(['"']);
        lex.assert('"');
        return new nodes.String(text);
    }

    // Single quotes
    if (lex.accept("'")) {
        text = lex.readUntil(["'"]);
        lex.assert("'");
        return new nodes.String(text);
    }

    var temp;
    temp = logicHelper.acceptExpression(lex);
    if (temp) {
        return temp;
    }

    throw new SyntaxError('String could not be parsed');

};
