function LogicVariable(identifier) {
    this.name = identifier;
}

/**
 * @param  {InterpreterContext} ctx
 * @return {*}
 */
LogicVariable.prototype.execute = function execute(ctx) {
    return ctx.vars[this.name] || null;
};

module.exports = LogicVariable;
