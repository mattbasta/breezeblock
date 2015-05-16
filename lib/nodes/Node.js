var contentHelper = require('../parserContentHelper');
var logicHelper = require('../parserLogicHelper');
var nodes = require('../nodes');


var AUTO_SELF_CLOSING = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
];

/**
 * @constructor
 */
function Node() {
    this.name = null;
    this.attributes = [];
    this.contents = [];
    this.selfClosing = false;
}

/**
 * @param  {Lexer} lex The lexer
 * @return {void}
 */
Node.prototype.parse = function(lex) {
    var me = this;

    var ident = lex.assert('identifier');
    this.name = ident.text;

    parseAttributeSection(false);

    lex.assert('>');
    if (this.selfClosing || AUTO_SELF_CLOSING.indexOf(this.name.toLowerCase()) !== -1) {
        return;
    }

    this.contents = contentHelper.parseContents(lex);

    lex.assert('</');
    var ident = lex.accept('identifier');
    if (ident && ident.text !== this.name) {
        throw new SyntaxError('Unbalanced tag: ' + ident.text + ' != ' + this.name);
    }
    lex.assert('>');

    function parseAttributeSection(isBlock) {
        var temp;
        var attributes = [];
        while (lex.peek().type !== '>') {

            temp = parseOuterAttributeConditional(lex) ||
                   parseVariableAttribute(lex) ||
                   parseStaticAttribute(lex);

            if (temp) {
                attributes.push(temp);
                continue;
            }

            // Self-closing tags
            if (lex.accept('/')) {
                me.selfClosing = true;
                me.attributes = me.attributes.concat(attributes);
                return;
            }

            if (isBlock) {
                return attributes;
            } else {
                throw new SyntaxError('Unexpected token encountered while parsing attributes for <' + ident.text + '>: ' + lex.next().text);
            }
        }


        me.attributes = me.attributes.concat(attributes);
    }

    function parseOuterAttributeConditional(lex) {
        return logicHelper.acceptIf(lex, parseAttributeSection.bind(null, true));
    }

    function parseVariableAttribute(lex) {
        var temp = logicHelper.acceptVariable(lex);
        if (!temp) {
            return null;
        }

        var processor = getAttributeValueParser(lex, temp);
        return processor();
    }

    function parseStaticAttribute(lex) {
        var temp = lex.accept('identifier');
        if (!temp) {
            return null;
        }
        var processor = getAttributeValueParser(
            lex,
            new nodes.TextNode(temp.text)
        );
        return processor();
    }

    function getAttributeValueParser(lex, name) {
        return function attributeValueParser() {
            // Support for valueless attributes
            if (!lex.accept('=')) {
                return new nodes.ValuelessAttribute(name);
            }

            // Otherwise return a full attribute
            return new nodes.Attribute(
                name,
                contentHelper.parseString(lex)
            );
        };
    }

};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
Node.prototype.asDOMGenerator = function asDOMGenerator(ctx) {
    var ident = ctx.getUniqueID();
    ctx.writeLine('var ' + ident + ' = document.createElement(' + JSON.stringify(this.name) + ');');

    ctx.pushElem(ident);

    this.attributes.forEach(function(attr) {
        attr.asDOMGenerator(ctx);
    });

    if (this.contents.length === 1 && this.contents[0] instanceof nodes.TextNode) {
        // OPT: Setting textContent is faster than appendChild(createTextNode)
        ctx.writeLine(ident + '.textContent = ' + JSON.stringify(this.contents[0].text) + ';');

    } else if (this.contents.length &&
        this.contents.every(function(x) {
            return x instanceof nodes.TextNode ||
                   logicHelper.isVariableExpression(x);
        })) {

        // OPT: Set textContent to avoid the cost of appendChild when concatenating string contents
        ctx.writeLine(ident + '.textContent = ' + this.contents.map(function(x) {
            if (x instanceof nodes.TextNode) {
                return JSON.stringify(x.text);
            }
            return x.asDOMGeneratorValue(ctx);
        }).join(' + ') + ';');

    } else {
        this.contents.forEach(function(node) {
            node.asDOMGenerator(ctx);
        });
    }

    ctx.popElem();

    ctx.writeLine(ctx.peekElem() + '.appendChild(' + ident + ');');
};

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
Node.prototype.asHTML = function asHTML(ctx) {
    var output = '<' + this.name;
    if (this.attributes.length) {
        var attrContents = this.attributes.map(function(attr) {
            return attr.asHTML(ctx);
        }).join(' ');
        if (attrContents) {
            output += ' ' + attrContents;
        }
    }

    if (this.selfClosing) {
        output += ' />';
        return output;
    }

    output += '>';

    if (AUTO_SELF_CLOSING.indexOf(this.name) !== -1) {
        return output;
    }

    output += this.contents.map(function(node) {
        return node.asHTML(ctx);
    }).join('');

    output += '</' + this.name + '>';

    return output;
};

/**
 * @param {CompilerContext} ctx Current compiler context
 * @return {void}
 */
Node.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeLine('output += "<' + this.name + '";');

    if (this.attributes.length) {
        ctx.writeLine('output += " ";');
        this.attributes.forEach(function(attr) {
            return attr.asHTMLGenerator(ctx);
        });
    }

    if (this.selfClosing) {
        ctx.writeLine('output += " />";');
        return;
    }

    ctx.writeLine('output += ">";');
    if (AUTO_SELF_CLOSING.indexOf(this.name) !== -1) {
        return;
    }

    this.contents.forEach(function(node) {
        node.asHTMLGenerator(ctx);
    });

    ctx.writeLine('output += "</' + this.name + '>";');

};

module.exports = Node;
