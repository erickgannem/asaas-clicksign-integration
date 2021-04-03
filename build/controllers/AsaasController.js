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
var date_fns_1 = require("date-fns");
var asaasApi_1 = __importDefault(require("../helpers/asaasApi"));
var removeCPFchars_1 = __importDefault(require("../helpers/removeCPFchars"));
var checkPaymentType_1 = __importDefault(require("../helpers/checkPaymentType"));
var connection_1 = __importDefault(require("../database/connection"));
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
                        paymentType = checkPaymentType_1.default(documentData['forma de pagamento']);
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
    AsaasController.paymentWebhook = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var body, event, PAYMENT_RECEIVED;
            return __generator(this, function (_a) {
                body = req.body;
                event = body.event;
                PAYMENT_RECEIVED = 'PAYMENT_RECEIVED';
                if (event === PAYMENT_RECEIVED) {
                    req.asaasPaymentInformation = body;
                    return [2 /*return*/, next()];
                }
                else {
                    process.stdout.write('\n>> [Asaas Controller] Payment still not confirmed. Skipping\n');
                    return [2 /*return*/, res.status(200).json({ message: 'Payment still not confirmed. Skipping' })];
                }
                return [2 /*return*/];
            });
        });
    };
    AsaasController.savePaymentToDB = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var INVOICING_DEADLINE_DAYS, asaasPaymentInformation, payment, paymentDate, confirmedDate, effectivePaymentDay, scheduledInvoiceDate, payment_1, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        INVOICING_DEADLINE_DAYS = 10;
                        asaasPaymentInformation = req.asaasPaymentInformation;
                        payment = asaasPaymentInformation.payment;
                        paymentDate = payment.paymentDate, confirmedDate = payment.confirmedDate;
                        effectivePaymentDay = paymentDate || confirmedDate;
                        scheduledInvoiceDate = date_fns_1.addDays(date_fns_1.parseISO(effectivePaymentDay), INVOICING_DEADLINE_DAYS);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, connection_1.default.Payment.create({
                                scheduledInvoiceDate: scheduledInvoiceDate,
                                payload: asaasPaymentInformation
                            })];
                    case 2:
                        payment_1 = _a.sent();
                        process.stdout.write("\n>> [Asaas Controller] Payment succesfully saved into database: " + payment_1.id + "\n");
                        return [2 /*return*/, res.status(200).json({ message: 'Payment received:' + payment_1 })];
                    case 3:
                        err_4 = _a.sent();
                        return [2 /*return*/, next(err_4)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AsaasController.checkIfPaymentIsProcessed = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var payments, unprocessedPayments, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, connection_1.default.Payment.find()];
                    case 1:
                        payments = _a.sent();
                        unprocessedPayments = payments.filter(function (paymentDocument) {
                            var processed = paymentDocument.processed;
                            return !processed;
                        });
                        req.unprocessedPayments = unprocessedPayments;
                        return [2 /*return*/, next()];
                    case 2:
                        err_5 = _a.sent();
                        return [2 /*return*/, next(err_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AsaasController.checkPaymentDate = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var unprocessedPayments, TODAY, paymentsReadyToInvoice;
            return __generator(this, function (_a) {
                unprocessedPayments = req.unprocessedPayments;
                TODAY = new Date();
                process.stdout.write("\n>> [Asaas Controller] Checking payments to invoice on: " + TODAY + "\n");
                paymentsReadyToInvoice = unprocessedPayments.filter(function (paymentDocument) {
                    var scheduledInvoiceDate = paymentDocument.scheduledInvoiceDate;
                    return date_fns_1.differenceInCalendarDays(scheduledInvoiceDate, TODAY) <= 0;
                });
                req.paymentsReadyToInvoice = paymentsReadyToInvoice;
                return [2 /*return*/, next()];
            });
        });
    };
    AsaasController.createInvoice = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentsReadyToInvoice, processAndSave, _i, paymentsReadyToInvoice_1, item, _a, value, id, reg, body, err_6;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        paymentsReadyToInvoice = req.paymentsReadyToInvoice;
                        processAndSave = function (item) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        item.processed = true;
                                        return [4 /*yield*/, item.save()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        _i = 0, paymentsReadyToInvoice_1 = paymentsReadyToInvoice;
                        _b.label = 2;
                    case 2:
                        if (!(_i < paymentsReadyToInvoice_1.length)) return [3 /*break*/, 5];
                        item = paymentsReadyToInvoice_1[_i];
                        _a = item.payload.payment, value = _a.value, id = _a.id;
                        reg = /([0-9])\w+/g;
                        body = {
                            payment: id,
                            serviceDescription: "[Auto] Nota Fiscal da Fatura " + reg.exec(id)[0],
                            observations: '',
                            value: value,
                            deductions: 0,
                            effectiveDate: date_fns_1.format(item.scheduledInvoiceDate, 'yyyy-MM-dd'),
                            municipalServiceCode: '17.02',
                            municipalServiceName: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infra estrutura administrativa e congêneres.',
                            taxes: {
                                retainIss: false,
                                iss: 2,
                                cofins: 0,
                                csll: 0,
                                inss: 0,
                                ir: 0,
                                pis: 0
                            }
                        };
                        return [4 /*yield*/, asaasApi_1.default.post('/api/v3/invoices', body)];
                    case 3:
                        _b.sent();
                        processAndSave(item);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, res.status(200).end()];
                    case 6:
                        err_6 = _b.sent();
                        return [2 /*return*/, next(err_6)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AsaasController;
}());
exports.default = AsaasController;
