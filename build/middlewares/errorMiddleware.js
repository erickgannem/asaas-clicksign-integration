"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMiddleware = function (err, req, res, next) {
    process.stdout.write("\n>> [Error Handler] " + err.message + " \n");
    return res.status(500).json({
        errorMessage: err.message
    });
};
exports.default = errorMiddleware;
