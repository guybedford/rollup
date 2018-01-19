"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function find(array, fn) {
    for (var i = 0; i < array.length; i += 1) {
        if (fn(array[i], i))
            return array[i];
    }
    return null;
}
exports.find = find;
