var html = require('../html');


/**
 * @constructor
 * @param {array} contents
 */
function String(contents) {
    this.contents = contents;
}

/**
 * @return {string}
 */
String.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    if (!this.contents.length) {
        return '""';
    }
    return this.contents.map(function(c) {
        if (typeof c === 'string') {
            return JSON.stringify(c);
        } else if (typeof c === 'number') {
            return JSON.stringify(c.toString());
        } else {
            return c.asDOMGeneratorValue();
        }
    }).join(' + ');
};

/**
 * @param  {InterpreterContext} ctx
 * @return {string}
 */
String.prototype.asValue = function asValue(ctx) {
    return this.contents.map(function(c) {
        if (typeof c === 'string') {
            return c;
        } else if (typeof c === 'number') {
            return c.toString();
        } else {
            return c.asValue(ctx);
        }
    }).join('');
};

/**
 * @param {InterpreterContext} ctx
 * @return {string}
 */
String.prototype.asHTML = function asHTML(ctx) {
    return '"' + this.contents.map(function(c) {
        if (typeof c === 'string') {
            return html.escape(c);
        } else if (typeof c === 'number') {
            return c.toString();
        } else {
            return c.asHTML(ctx);
        }
    }).join('') + '"';
};

/**
 * @return {string}
 */
String.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return JSON.stringify(this.asHTML());
};

/**
 * @param {CompilerContext} ctx
 * @return {string}
 */
String.prototype.asHTMLGenerator = function asHTMLGenerator(ctx) {
    ctx.writeOutputString('"');
    this.contents.forEach(function(c) {
        if (typeof c === 'string') {
            ctx.writeOutputString(html.escape(c));
        } else if (typeof c === 'number') {
            ctx.writeOutputString(c);
        } else {
            ctx.writeLine('output += ' + c.asHTMLGeneratorValue() + ';');
        }
    });
    ctx.writeOutputString('"');
};


module.exports = String;
