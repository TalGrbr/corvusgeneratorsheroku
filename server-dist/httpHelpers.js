exports.sendSuccess = function (response, message, results) {
    response.writeHead(200, { "Content-Type": "application/json" });
    if (results) {
        response.write(results);
    }
    else if (message) {
        response.write(JSON.stringify({ message: message }));
    }
};
exports.sendError = function (response, statusCode, message) {
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.write(JSON.stringify({ message: message }));
    response.end();
};
//# sourceMappingURL=httpHelpers.js.map