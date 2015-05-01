var escapeMap = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    '<': '&lt;',
    '>': '&gt;'
};

var escapeRegex = /[&"'<>]/g;


/**
 * Escapes a string for HTML
 * @param  {string} input Input HTML
 * @return {string} Sanitized markup
 */
exports.escape = function escape(input) {
    return input.replace(escapeRegex, function escapeCB(char_) {
        return escapeMap[char_];
    });
};
