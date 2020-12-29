"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeCPFChars(cpf) {
    return cpf.split('.').join('').split('-').join('');
}
exports.default = removeCPFChars;
