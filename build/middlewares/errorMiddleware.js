"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMiddleware = function (err, req, res, next) {
    return process.stdout.write("\n>> [Error Handler] " + err.message + " \n");
};
exports.default = errorMiddleware;
