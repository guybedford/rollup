"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ensureArray(thing) {
    if (Array.isArray(thing))
        return thing;
    if (thing == undefined)
        return [];
    return [thing];
}
exports.default = ensureArray;
