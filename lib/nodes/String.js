var html = require('../html');


/**
 * @constructor
 * @param {string} text
 */
function String(text) {
    this.text = text;
}

/**
 * @return {string}
 */
String.prototype.asDOMGeneratorValue = function asDOMGeneratorValue() {
    return JSON.stringify(this.text);
};

/**
 * @return {string}
 */
String.prototype.asHTML = function asHTML() {
    return '"' + html.escape(this.text) + '"';
};

/**
 * @return {string}
 */
String.prototype.asHTMLGeneratorValue = function asHTMLGeneratorValue() {
    return JSON.stringify(this.asHTML());
};


module.exports = String;
