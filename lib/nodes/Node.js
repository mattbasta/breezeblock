var contentHelper = require('../parserContentHelper');
var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


function Node() {
    this.name = null;
    this.attributes = [];
    this.contents = [];
    this.selfClosing = false;
}

Node.prototype.parse = function(lex) {
    var ident = lex.assert('identifier');
    this.name = ident.text;

    var temp;
    while (!lex.accept('>')) {
        if (temp = logicHelper.acceptVariable(lex)) {
            lex.assert('=');
            this.attributes.push(
                new nodes.Attribute(
                    temp,
                    logicHelper.parseString(lex)
                )
            );
            continue;
        }

        if (temp = lex.accept('identifier')) {
            lex.assert('=');
            this.attributes.push(
                new nodes.Attribute(
                    new nodes.TextNode(temp.text),
                    contentHelper.parseString(lex)
                )
            );
        }

        if (temp = lex.accept('/')) {
            lex.assert('>');
            this.selfClosing = true;
            return;
        }

        throw new SyntaxError('Unexpected token encountered while parsing attributes for <' + ident.text + '>: ' + lex.next().text);

    }

    this.contents = contentHelper.parseContents(lex);

    lex.assert('</');
    var ident = lex.assert('identifier');
    if (ident.text !== this.name) {
        throw new SyntaxError('Unbalanced tag: ' + ident.text + ' != ' + this.name);
    }
    lex.assert('>');

};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
Node.prototype.asHTML = function asHTML(ctx) {
    var output = '<' + this.name;
    if (this.attributes.length) {
        output += ' ';
        output += this.attributes.map(function(attr) {
            return attr.asHTML(ctx);
        }).join(' ');
    }

    if (this.selfClosing) {
        output += ' />';
        return output;
    }

    output += '>';

    output += this.contents.map(function(node) {
        return node.asHTML(ctx);
    }).join('');

    output += '</' + this.name + '>';

    return output;
};

module.exports = Node;
