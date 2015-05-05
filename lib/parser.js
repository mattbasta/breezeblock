var lexer = require('./lexer');
var nodes = require('./nodes');


module.exports = function parse(text) {
    text = text.trim();

    var lex = lexer(text);

    var doc = new nodes.Document();
    doc.parse(lex);

    return doc;
};
