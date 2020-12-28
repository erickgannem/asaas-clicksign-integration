"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ClickSignController_1 = __importDefault(require("./controllers/ClickSignController"));
var AsaasController_1 = __importDefault(require("./controllers/AsaasController"));
var routes = express_1.Router();
var fetchClients = AsaasController_1.default.fetchClients, checkIfClientExists = AsaasController_1.default.checkIfClientExists, createCharge = AsaasController_1.default.createCharge;
var listenWebhook = ClickSignController_1.default.listenWebhook, getDocument = ClickSignController_1.default.getDocument;
routes.post('/', listenWebhook, getDocument, fetchClients, checkIfClientExists, createCharge);
routes.get('/status', function (_, res) { return res.status(200).json({ message: 'Server is up and running' }); });
exports.default = routes;
