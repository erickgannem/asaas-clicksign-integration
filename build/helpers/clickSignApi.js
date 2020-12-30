"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var prefixUrl = (process.env.NODE_ENV === 'production') ? 'app' : 'sandbox';
var clickSignAPI = axios_1.default.create({
    baseURL: "https://" + prefixUrl + ".clicksign.com",
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Host: prefixUrl + ".clicksign.com"
    }
});
exports.default = clickSignAPI;
