"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var clickSignApi_1 = __importDefault(require("../helpers/clickSignApi"));
var crypto_1 = __importDefault(require("crypto"));
var cache_1 = __importDefault(require("../cache"));
var ClickSignController = /** @class */ (function () {
    function ClickSignController() {
    }
    ClickSignController.documentWebhook = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var headers, rawBody, body, HMAC_SECRET_KEY, hmac, hash, sha256matches, event_1, documentKey_1, redisGetResponse, documentIsCached_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headers = req.headers, rawBody = req.rawBody, body = req.body;
                        HMAC_SECRET_KEY = process.env.HMAC_SECRET_KEY;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!HMAC_SECRET_KEY) {
                            process.stdout.write('\n>> [ClickSign Controller] HMAC Secret Key does not exist! \n');
                            throw new Error('HMAC Secret Key does not exist!');
                        }
                        hmac = crypto_1.default.createHmac('sha256', HMAC_SECRET_KEY);
                        hmac.update(rawBody);
                        hash = hmac.digest('hex');
                        sha256matches = ("sha256=" + hash === headers['content-hmac']);
                        if (!sha256matches) {
                            process.stdout.write('\n>> [ClickSign Controller] SHA256 does not match!\n');
                            throw new Error('SHA256 does not match!');
                        }
                        event_1 = headers.event;
                        documentKey_1 = body.document.key;
                        if (!(event_1 === 'auto_close' || event_1 === 'close')) return [3 /*break*/, 3];
                        return [4 /*yield*/, cache_1.default.get(documentKey_1)];
                    case 2:
                        redisGetResponse = _a.sent();
                        documentIsCached_1 = (redisGetResponse !== null);
                        setTimeout(function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!documentIsCached_1) return [3 /*break*/, 1];
                                            return [2 /*return*/, res.status(200).end()];
                                        case 1: return [4 /*yield*/, cache_1.default.set(documentKey_1, 0)];
                                        case 2:
                                            _a.sent();
                                            req.clicksignDocumentKey = documentKey_1;
                                            return [2 /*return*/, next()];
                                    }
                                });
                            });
                        }, 0);
                        _a.label = 3;
                    case 3: return [2 /*return*/, res.status(200).end()];
                    case 4:
                        err_1 = _a.sent();
                        return [2 /*return*/, next(err_1)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ClickSignController.getDocument = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var clicksignDocumentKey, CLICKSIGN_API_TOKEN, documentRequest, data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clicksignDocumentKey = req.clicksignDocumentKey;
                        CLICKSIGN_API_TOKEN = process.env.CLICKSIGN_API_TOKEN;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        process.stdout.write("\n>> [ClickSign Controller] Closed document: " + clicksignDocumentKey + " being processed");
                        return [4 /*yield*/, clickSignApi_1.default.get("/api/v1/documents/" + clicksignDocumentKey + "?access_token=" + CLICKSIGN_API_TOKEN)];
                    case 2:
                        documentRequest = _a.sent();
                        data = documentRequest.data;
                        req.clicksignDocumentData = data;
                        return [2 /*return*/, next()];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, next(err_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ClickSignController;
}());
exports.default = ClickSignController;
