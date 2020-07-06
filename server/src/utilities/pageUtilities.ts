const constants = require('./constants');

exports.handleQuotes = function (text) {
    return this.handleDoubleQuotes(this.handleSingleQuotes(text));
};

exports.handleDoubleQuotes = function (text) {
    if (text) {
        text = text.toString();
        return text
            .split(constants.DOUBLE_QUOTES)
            .join(constants.DOUBLE_QUOTES_REPLACEMENT);
    }
    return text;
}

exports.handleSingleQuotes = function (text) {
    if (text) {
        text = text.toString();
        return text
            .split(constants.SINGLE_QUOTES)
            .join(constants.SINGLE_QUOTES_REPLACEMENT);
    }
    return text;
}

exports.handleNewLine = function (text) {
    if (text) {
        text = text.toString();
        return text
            .split(constants.NEW_LINE)
            .join(constants.NEW_LINE_REPLACEMENT);
    }
    return text;
};

exports.handleText = function (text) {
    return this.handleNewLine(this.handleQuotes(text));
}
