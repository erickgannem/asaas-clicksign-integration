"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Payment_1 = __importDefault(require("./models/Payment"));
var _a = process.env, DB_NAME = _a.DB_NAME, DB_USERNAME = _a.DB_USERNAME, DB_PASSWORD = _a.DB_PASSWORD;
var connection = mongoose_1.default.connect("mongodb+srv://" + DB_USERNAME + ":" + DB_PASSWORD + "@cluster0.e1fsy.mongodb.net/" + DB_NAME + "?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
if (connection) {
    process.stdout.write('>> [MongoDB] Client is READY\n');
}
var db = { Payment: Payment_1.default };
exports.default = db;
