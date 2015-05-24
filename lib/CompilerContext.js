/**
 * @constructor
 */
function CompilerContext() {
    this.elemStack = [];
    this.uniq = 1;

    this.data = '';
    this.indent = '';

    this.scopes = [];
    this.outputQueue = [];
}

/**
 * Pushes a scope
 * @return {void}
 */
CompilerContext.prototype.pushScope = function pushScope() {
    this.scopes.unshift({});
};

/**
 * Pops a scope
 * @return {void}
 */
CompilerContext.prototype.popScope = function popScope() {
    this.scopes.shift();
};

/**
 * Defines a variable in the top scope
 * @param  {string} name Name of the variable
 * @param  {string} identifier Unique identifier of the variable
 * @return {void}
 */
CompilerContext.prototype.defineVar = function defineVar(name, identifier) {
    if (!this.scopes.length) {
        throw new Error('Tried to define variable "' + name + '" but no scope is defined.');
    }
    this.scopes[0][name] = identifier;
};

/**
 * Resolves a variable name to its identifier
 * @param  {string} name The name of the variable
 * @return {string} The variable's identifier
 */
CompilerContext.prototype.resolveVar = function resolveVar(name) {
    for (var i = 0; i < this.scopes.length; i++) {
        if (!this.scopes[i].hasOwnProperty(name)) {
            continue;
        }
        return this.scopes[i][name];
    }

    throw new ReferenceError('Lookup of undefined variable "' + name + '"');
};


/**
 * Pushes a level of indentation
 * @return {void}
 */
CompilerContext.prototype.pushIndent = function pushIndent() {
    this.flushOutputStringQueue();
    this.indent += '    ';
};

/**
 * Pops a level of indentation
 * @return {void}
 */
CompilerContext.prototype.popIndent = function popIndent() {
    this.flushOutputStringQueue();
    this.indent = this.indent.substr(4);
};

/**
 * Writes a line ot the internal buffer
 * @param  {string} str The line to write
 * @return {void}
 */
CompilerContext.prototype.writeLine = function writeLine(str) {
    this.flushOutputStringQueue();
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
    this.flushOutputStringQueue();
    this.elemStack.unshift(name);
};

/**
 * Pops the top element from the stack and returns it
 * @return {string}
 */
CompilerContext.prototype.popElem = function popElem() {
    this.flushOutputStringQueue();
    return this.elemStack.shift();
};

/**
 * Returns the top element from the stack
 * @return {string}
 */
CompilerContext.prototype.peekElem = function peekElem() {
    return this.elemStack[0] || null;
};

/**
 * Writes an output append command
 * @param {string} string Unescaped version of the output string
 * @return {void}
 */
CompilerContext.prototype.writeOutputString = function writeOutputString(string) {
    this.outputQueue.push(string);
};

/**
 * Flushes the output queue to the buffer.
 * @return {void}
 */
CompilerContext.prototype.flushOutputStringQueue = function flushOutputStringQueue(string) {
    if (!this.outputQueue.length) {
        return;
    }
    var merged = this.outputQueue.join('');
    this.outputQueue = [];
    this.writeLine('output += ' + JSON.stringify(merged) + ';');
};


module.exports = CompilerContext;
