"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var helmet_1 = __importDefault(require("helmet"));
var routes_1 = __importDefault(require("./routes"));
var errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
dotenv_1.default.config({});
var App = /** @class */ (function () {
    function App() {
        this.server = express_1.default();
        this.middlewares();
        this.routes();
        this.errors();
    }
    App.prototype.middlewares = function () {
        this.server.use(helmet_1.default());
        this.server.use(express_1.default.json({
            verify: function (req, res, buf) {
                req.rawBody = buf;
            }
        }));
        this.server.use(cors_1.default());
    };
    App.prototype.routes = function () {
        this.server.use(routes_1.default);
    };
    App.prototype.errors = function () {
        this.server.use(errorMiddleware_1.default);
    };
    return App;
}());
exports.default = new App().server;
