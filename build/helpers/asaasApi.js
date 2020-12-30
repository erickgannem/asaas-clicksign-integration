"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
var ASAAS_API_KEY = process.env.ASAAS_API_KEY;
var asaasAPI = axios_1.default.create({
    baseURL: 'https://www.asaas.com/',
    headers: {
        access_token: ASAAS_API_KEY
    }
});
exports.default = asaasAPI;
