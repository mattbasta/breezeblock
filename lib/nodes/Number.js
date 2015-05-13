/**
 * @constructor
 * @param {number} value
 */
function Number(value) {
    this.value = value;
}

/**
 * @return {string}
 */
Number.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    return JSON.stringify(this.value);
};

/**
 * @param  {InterpreterContext} ctx
 * @return {number}
 */
Number.prototype.asValue = function asValue(ctx) {
    return this.value;
};

/**
 * @return {string}
 */
Number.prototype.asHTML = function asHTML() {
    return '"' + this.value.toString() + '"';
};

/**
 * @return {string}
 */
Number.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return JSON.stringify(this.asHTML());
};


module.exports = Number;
