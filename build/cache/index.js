"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = __importDefault(require("ioredis"));
var cache = new ioredis_1.default(6379, '127.0.0.1');
cache.on('connect', function () {
    process.stdout.write('\n>> [REDIS] Connected\n');
});
cache.on('error', function () {
    process.stdout.write('\n>> [REDIS] Can\'t connect. Please restart the server.\n');
    cache.quit();
});
exports.default = cache;
