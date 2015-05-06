
var TOKENS = [
    [/(?:\r\n|\r|\n)/, null],
    [/\s+/, null],

    // HTML comment
    // http://www.w3.org/html/wg/drafts/html/master/syntax.html#comments
    [/<\!\-\-(?!>)((?!\-\-).)*\-\->/, null],
    // Handlebars comments
    [/\{\{\!\-\-.*?\-\-\}\}/],
    [/\{\{\!.*?\}\}/],

    [/"/, '"'],
    [/'/, "'"],
    [/<\//, '</'],
    [/</, '<'],
    [/>/, '>'],
    [/=/, '='],
    [/\*/, '*'],
    [/\//, '/'],
    [/\{\{/, '{{'],
    [/\}\}/, '}}'],

    [/\{% ?if/, '{%if'],
    [/\{% ?\/ *if/, '{%/if'],
    [/\{% ?else ?%\}/, '{%else%}'],
    [/\{% ?loop/, '{%loop'],
    [/\{% ?\/ *loop/, '{%/loop'],

    [/%\}/, '%}'],

    [/\-?[1-9][0-9]*\.[0-9]+/, 'float'],
    [/\-?0\.[0-9]+/, 'float'],
    [/\-?[1-9][0-9]*(?!\.)/, 'int'],
    [/^0(?!\.)/, 'int'],

    [/[a-zA-Z_][\w_]*/, 'identifier'],

];

var TOKEN_MAP = {};
TOKENS.forEach(function(tok) {
    var tokType = tok[1] || 'whitespace'
    TOKEN_MAP[tokType] = TOKEN_MAP[tokType] || [];
    TOKEN_MAP[tokType].push(tok);
});


/**
 * @constructor
 * @param {string} text  Text content of the token
 * @param {string} type  Token type
 * @param {int} start Start position of token
 * @param {int} end   End position of token
 * @param {int} line  Line number of token
 */
function Token(text, type, start, end, line) {
    this.text = text;
    this.type = type;
    this.start = start;
    this.end = end;
    this.line = line;
}

/**
 * @return {string} Stringified version of the token
 */
Token.prototype.toString = function() {
    return '[token ' + this.type + ']';
};


/**
 * @constructor
 * @param {string} text Input data
 */
function Lexer(text) {
    this.pointer = 0;
    this.remainingData = text;
    this.currentLine = 1;

    this.peeked = null;
}

/**
 * Returns the next token from the stream
 * @return {Token|null} The next token
 */
Lexer.prototype.readToken = function readToken() {
    var match;
    var startPointer = this.pointer;
    for (var i = 0; i < TOKENS.length; i++) {
        if (!(match = TOKENS[i][0].exec(this.remainingData))) {
            continue;
        }
        if (match.index !== 0) {
            continue;
        }
        this.remainingData = this.remainingData.substr(match[0].length);
        this.currentLine += match[0].split(/(?:\r\n|\r|\n)/).length - 1;
        this.pointer += match[0].length;
        if (!TOKENS[i][1] || TOKENS[i][1] === 'comment') {
            i = -1;
            startPointer = this.pointer;
            continue;
        }
        return new Token(match[0], TOKENS[i][1], startPointer, this.pointer, this.currentLine);
    }
    return null;
};

/**
 * Gets the next token
 * @return {Token|string} The next token
 */
Lexer.prototype.next = function next() {
    if (this.peeked !== null) {
        var tmp = this.peeked;
        this.peeked = null;
        return tmp;
    }

    if (!this.remainingData.trim()) return 'EOF';
    var token = this.readToken();
    if (!token) {
        if (!this.remainingData.trim()) return 'EOF';
        throw new SyntaxError('Unknown token at line ' + this.currentLine + ' near "' + this.remainingData.substr(0, 20) + '"');
    }
    return token;
};

/**
 * Peeks the next token without removing it from the stream
 * @return {Token}
 */
Lexer.prototype.peek = function peek() {
    if (this.peeked !== null) {
        return this.peeked;
    }
    var next = this.next();
    this.peeked = next;
    return next;
};

/**
 * If the next token matches the provided type, it is returned.
 * @param  {string} tokenType
 * @return {Token|null}
 */
Lexer.prototype.accept = function accept(tokenType) {
    var peeked = this.peek();
    if (peeked.type !== tokenType) {
        return null;
    }
    return this.next();
};

/**
 * Asserts that the next token is of the specified type and returns
 * the token.
 * @param  {string} tokenType
 * @return {Token}
 */
Lexer.prototype.assert = function assert(tokenType) {
    var next = this.next();
    if (next === 'EOF') {
        if (tokenType !== 'EOF') {
            throw new SyntaxError('Expected ' + tokenType + ' but reached the end of the file');
        }
    } else if (next.type !== tokenType) {
        throw new SyntaxError(
            'Unexpected token "' + next.type + '", expected "' + tokenType + '"' +
            ' at line ' + this.currentLine + ' near "' +
            this.remainingData.substr(0, 20) + '"');
    }
    return next;
};

/**
 * Returns a blob of untokenized text until one of the provided tokens
 * is encountered.
 * @param  {string[]} tokens Array of token types to stop on
 * @return {string}          Data that was encountered before a token was found
 */
Lexer.prototype.readUntil = function readUntil(tokens) {
    if (!this.remainingData.trim()) {
        return this.remainingData;
    }

    tokens = tokens.map(function(t) {
        return TOKEN_MAP[t];
    }).reduce(function(a, b) {
        return a.concat(b);
    });

    var tok;
    var match;

    var lastMatch;
    var lastIndex = Infinity;

    for (var i = 0; i < tokens.length; i++) {
        tok = tokens[i];

        match = tok[0].exec(this.remainingData);
        if (!match) {
            continue;
        }

        if (match.index < lastIndex) {
            lastMatch = match;
            lastIndex = match.index;
        }
    }

    if (!lastMatch) {
        return '';
    }

    var output = this.remainingData.substr(0, lastIndex);
    this.remainingData = this.remainingData.substr(lastIndex);
    return output;

};


module.exports = function lexer(text) {
    var lex = new Lexer(text);
    return lex;
};
