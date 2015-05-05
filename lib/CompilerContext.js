/**
 * @constructor
 */
function CompilerContext() {
    this.elemStack = [];
    this.uniq = 1;

    this.data = '';
    this.indent = '';
}

/**
 * Pushes a level of indentation
 * @return {void}
 */
CompilerContext.prototype.pushIndent = function pushIndent() {
    this.indent += '    ';
};

/**
 * Pops a level of indentation
 * @return {void}
 */
CompilerContext.prototype.popIndent = function popIndent() {
    this.indent = this.indent.substr(4);
};

/**
 * Writes a line ot the internal buffer
 * @param  {string} str The line to write
 * @return {void}
 */
CompilerContext.prototype.writeLine = function writeLine(str) {
    this.data += this.indent + str + '\n';
};

/**
 * Returns all of the written lines
 * @return {string}
 */
CompilerContext.prototype.flush = function flush() {
    var temp = this.data;
    this.data = '';
    return temp;
};

/**
 * Returns a unique identifier
 * @return {string}
 */
CompilerContext.prototype.getUniqueID = function getUniqueID() {
    return 'elem' + this.uniq++;
};

/**
 * Pushes the identifier for the current node to the stack
 * @param  {string} name
 * @return {void}
 */
CompilerContext.prototype.pushElem = function pushElem(name) {
    this.elemStack.unshift(name);
};

/**
 * Pops the top element from the stack and returns it
 * @return {string}
 */
CompilerContext.prototype.popElem = function popElem() {
    return this.elemStack.shift();
};

/**
 * Returns the top element from the stack
 * @return {string}
 */
CompilerContext.prototype.peekElem = function peekElem() {
    return this.elemStack[0] || null;
};


module.exports = CompilerContext;
