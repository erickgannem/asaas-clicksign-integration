"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkPaymentType(input) {
    var paymentType;
    if (~input.indexOf('Bol')) {
        paymentType = 'BOLETO';
    }
    else if (~input.indexOf('Cart')) {
        paymentType = 'CREDIT_CARD';
    }
    else {
        paymentType = 'undefined';
    }
    return paymentType;
}
exports.default = checkPaymentType;
