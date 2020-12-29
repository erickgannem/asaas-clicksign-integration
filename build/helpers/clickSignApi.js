"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var clickSignAPI = axios_1.default.create({
    baseURL: 'https://app.clicksign.com/',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Host: 'app.clicksign.com'
    }
});
exports.default = clickSignAPI;
