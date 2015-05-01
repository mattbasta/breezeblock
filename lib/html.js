var escapeMap = {
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    '<': '&lt;',
    '>': '&gt;',
};


/**
 * Escapes a string for HTML
 * @param  {string} input Input HTML
 * @return {string} Sanitized markup
 */
exports.escape = function escape(input) {
    return input.replace(/[&"'<>]/g, function escapeCB(char_) {
        return escapeMap[char_];
    });
};

exports.escapeMap = escapeMap;
