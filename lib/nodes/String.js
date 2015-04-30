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
String.prototype.asHTML = function asHTML() {
	// TODO: HTML encode the contents first
    return JSON.stringify(this.text);
};

module.exports = String;
