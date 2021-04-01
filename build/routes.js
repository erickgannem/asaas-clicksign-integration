"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ClickSignController_1 = __importDefault(require("./controllers/ClickSignController"));
var AsaasController_1 = __importDefault(require("./controllers/AsaasController"));
var routes = express_1.Router();
var fetchClients = AsaasController_1.default.fetchClients, checkIfClientExists = AsaasController_1.default.checkIfClientExists, createCharge = AsaasController_1.default.createCharge, paymentWebhook = AsaasController_1.default.paymentWebhook, savePaymentToDB = AsaasController_1.default.savePaymentToDB, checkIfPaymentIsProcessed = AsaasController_1.default.checkIfPaymentIsProcessed, checkPaymentDate = AsaasController_1.default.checkPaymentDate, createInvoice = AsaasController_1.default.createInvoice;
var documentWebhook = ClickSignController_1.default.documentWebhook, getDocument = ClickSignController_1.default.getDocument;
routes.post('/documents', documentWebhook, getDocument, fetchClients, checkIfClientExists, createCharge);
routes.post('/payments', paymentWebhook, savePaymentToDB);
routes.get('/invoices', checkIfPaymentIsProcessed, checkPaymentDate, createInvoice);
routes.get('/status', function (_, res) { return res.status(200).json({ message: 'Server is up and running' }); });
exports.default = routes;
