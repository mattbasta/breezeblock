/**
 * @constructor
 * @param {object} data Passed variables
 */
function InterpreterContext(data) {
    this.vars = data || {};
    this.elemStack = [];
}

/**
 * Pushes the identifier for the current node to the stack
 * @param  {string} name
 * @return {void}
 */
InterpreterContext.prototype.pushElem = function pushElem(name) {
    this.elemStack.unshift(name);
};

/**
 * Pops the top element from the stack and returns it
 * @return {string}
 */
InterpreterContext.prototype.popElem = function popElem() {
    return this.elemStack.shift();
};


module.exports = InterpreterContext;
