function Attribute(name, body) {
    this.name = name;
    this.body = body;
}

/**
 * @param {InterpreterContext} ctx Current interpreter context
 * @return {string}
 */
Attribute.prototype.asHTML = function asHTML(ctx) {
    return this.name.asHTML(ctx) + '=' + this.body.asHTML(ctx);
};

module.exports = Attribute;
