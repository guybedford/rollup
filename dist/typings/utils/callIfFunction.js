"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function callIfFunction(thing) {
    return typeof thing === 'function' ? thing() : thing;
}
exports.default = callIfFunction;
