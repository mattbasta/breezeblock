function TextNode(text) {
    this.text = text;
}

/**
 * @return {string}
 */
TextNode.prototype.asHTML = function asHTML() {
	// TODO: HTML encode the contents first
    return this.text;
};

module.exports = TextNode;
