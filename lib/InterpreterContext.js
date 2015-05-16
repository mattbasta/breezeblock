/**
 * @constructor
 * @param {object} data Passed variables
 */
function InterpreterContext(data, basePath) {
    this.data = data || {};
    this.scopes = [];
}

/**
 * Pushes a scope
 * @return {void}
 */
InterpreterContext.prototype.pushScope = function pushScope() {
    this.scopes.unshift({});
};

/**
 * Pops a scope
 * @return {void}
 */
InterpreterContext.prototype.popScope = function popScope() {
    this.scopes.shift();
};

/**
 * Defines a variable in the top scope
 * @param  {string} name Name of the variable
 * @param  {*} value The value of the variable
 * @return {void}
 */
InterpreterContext.prototype.setVar = function setVar(name, identifier) {
    if (!this.scopes.length) {
        throw new Error('Tried to define variable "' + name + '" but no scope is defined.');
    }
    this.scopes[0][name] = value;
};

/**
 * Resolves a variable name to its value
 * @param  {string} name The name of the variable
 * @return {*} The variable's value
 */
InterpreterContext.prototype.resolveVar = function resolveVar(name) {
    for (var i = 0; i < this.scopes.length; i++) {
        if (!this.scopes[i].hasOwnProperty(name)) {
            continue;
        }
        return this.scopes[i][name];
    }

    throw new ReferenceError('Lookup of undefined variable "' + name + '"');
};

/**
 * Renders a template with the given path
 * @param  {string} path
 * @return {string}
 */
InterpreterContext.prototype.renderTemplate = function renderTemplate(path) {
    //
};


module.exports = InterpreterContext;
