"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(node) {
    if (!node)
        return node;
    if (typeof node !== 'object')
        return node;
    if (Array.isArray(node)) {
        var cloned_1 = new Array(node.length);
        for (var i = 0; i < node.length; i += 1)
            cloned_1[i] = clone(node[i]);
        return cloned_1;
    }
    var cloned = {};
    for (var key in node) {
        cloned[key] = clone(node[key]);
    }
    return cloned;
}
exports.default = clone;
