"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getIndentString(magicString, options) {
    if (options.indent === true) {
        return magicString.getIndentString();
    }
    return options.indent || '';
}
exports.default = getIndentString;
