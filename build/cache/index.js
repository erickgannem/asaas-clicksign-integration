"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = __importDefault(require("ioredis"));
// const { REDIS_URL } = process.env
// const cache = new Redis(REDIS_URL)
var cache = new ioredis_1.default();
cache.on('connect', function () {
    process.stdout.write('\n>> [REDIS] Client is CONNECTED\n');
});
cache.on('ready', function () {
    process.stdout.write('\n>> [REDIS] Client is READY\n');
});
cache.on('reconnecting', function () {
    process.stdout.write('\n>> [REDIS] Client is RECONNECTING\n');
});
cache.on('error', function () {
    process.stdout.write('\n>> [REDIS] Client can\'t connect. Please restart the server.\n');
    cache.connect();
});
exports.default = cache;
