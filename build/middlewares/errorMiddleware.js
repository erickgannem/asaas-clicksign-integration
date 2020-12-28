"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorMiddleware = function (err, req, res, next) { return res.status(500).json({ error: err.message }); };
exports.default = errorMiddleware;
