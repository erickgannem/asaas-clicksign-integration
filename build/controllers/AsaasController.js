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
var asaasApi_1 = __importDefault(require("../helpers/asaasApi"));
var removeCPFchars_1 = __importDefault(require("../helpers/removeCPFchars"));
var date_fns_1 = require("date-fns");
var AsaasController = /** @class */ (function () {
    function AsaasController() {
    }
    AsaasController.fetchClients = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var clicksignDocumentData, cpfCnpj, cleanCpfCnpj, data, clientDataArray, asaasClient, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clicksignDocumentData = req.clicksignDocumentData;
                        cpfCnpj = clicksignDocumentData.document.template.data.cpf;
                        cleanCpfCnpj = removeCPFchars_1.default(cpfCnpj);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, asaasApi_1.default.get("/api/v3/customers?cpfCnpj=" + cleanCpfCnpj)];
                    case 2:
                        data = (_a.sent()).data;
                        clientDataArray = data.data;
                        asaasClient = clientDataArray[0] ? clientDataArray[0] : {};
                        req.asaasClient = asaasClient;
                        return [2 /*return*/, next()];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, next(err_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AsaasController.checkIfClientExists = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var asaasClient, clicksignDocumentData, clientExists, data, name_1, phone, addressNumber, mobilePhone, body, asaasResponse, newClient, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        asaasClient = req.asaasClient, clicksignDocumentData = req.clicksignDocumentData;
                        clientExists = !!Object.keys(asaasClient).length;
                        if (!clientExists) return [3 /*break*/, 1];
                        return [2 /*return*/, next()];
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = clicksignDocumentData.document.template.data;
                        name_1 = clicksignDocumentData.document.template.data['nome completo'];
                        phone = clicksignDocumentData.document.template.data['telefone residencial'];
                        addressNumber = clicksignDocumentData.document.template.data['número'];
                        mobilePhone = clicksignDocumentData.document.template.data['numero whatsapp'];
                        body = {
                            name: name_1,
                            cpfCnpj: data.cpf,
                            email: data.email,
                            mobilePhone: mobilePhone,
                            phone: phone || '',
                            address: data.logradouro,
                            addressNumber: addressNumber,
                            complement: data.complemento,
                            province: data.bairro,
                            postalCode: data.cep
                        };
                        return [4 /*yield*/, asaasApi_1.default.post('/api/v3/customers', body)];
                    case 2:
                        asaasResponse = _a.sent();
                        newClient = asaasResponse.data;
                        req.asaasClient = newClient;
                        return [2 /*return*/, next()];
                    case 3:
                        err_2 = _a.sent();
                        return [2 /*return*/, next(err_2)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AsaasController.createCharge = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var clientId, documentData, value, installmentValue, installmentDay, paymentType, installmentCount, installmentDate, today, proposedInstallmentDateStr, proposedInstallmentDate, proposedIsAfterToday, proposedIsToday, body, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        clientId = req.asaasClient.id;
                        documentData = req.clicksignDocumentData.document.template.data;
                        value = documentData['valor negociado'];
                        installmentValue = documentData['valor parcela'];
                        installmentDay = documentData['vencimento da parcela'];
                        paymentType = (~documentData['forma de pagamento'].indexOf('Boleto')) ? 'BOLETO' : 'CREDIT_CARD';
                        installmentCount = documentData.parcelas;
                        installmentDate = void 0;
                        today = new Date();
                        proposedInstallmentDateStr = today.getMonth() + 1 + "-" + installmentDay + "-" + today.getFullYear();
                        proposedInstallmentDate = new Date(proposedInstallmentDateStr);
                        proposedIsAfterToday = date_fns_1.isAfter(proposedInstallmentDate, today);
                        proposedIsToday = date_fns_1.isToday(proposedInstallmentDate);
                        body = {
                            customer: clientId,
                            billingType: paymentType,
                            dueDate: '',
                            value: value,
                            installmentCount: installmentCount,
                            installmentValue: installmentValue
                        };
                        if (!(proposedIsAfterToday || proposedIsToday)) return [3 /*break*/, 2];
                        body.dueDate = date_fns_1.format(proposedInstallmentDate, 'yyyy-MM-dd');
                        return [4 /*yield*/, asaasApi_1.default.post('/api/v3/payments', body)];
                    case 1:
                        _a.sent();
                        process.stdout.write("\n>> [Asaas Controller] Payment for document: " + req.clicksignDocumentKey + " was succesfully generated");
                        return [2 /*return*/, res.status(200).end()];
                    case 2:
                        installmentDate = date_fns_1.format(date_fns_1.addMonths(proposedInstallmentDate, 1), 'yyyy-MM-dd');
                        body.dueDate = installmentDate;
                        return [4 /*yield*/, asaasApi_1.default.post('/api/v3/payments', body)];
                    case 3:
                        _a.sent();
                        process.stdout.write("\n>> [Asaas Controller] Payment for document: " + req.clicksignDocumentKey + " was succesfully generated");
                        return [2 /*return*/, res.status(200).end()];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        return [2 /*return*/, next({
                                message: err_3.response.data.errors[0].description
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AsaasController;
}());
exports.default = AsaasController;
