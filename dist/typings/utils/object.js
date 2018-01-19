"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = Object.keys;
function blank() {
    return Object.create(null);
}
exports.blank = blank;
function forOwn(object, func) {
    Object.keys(object).forEach(function (key) { return func(object[key], key); });
}
exports.forOwn = forOwn;
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        for (var key in source) {
            if (Object.hasOwnProperty.call(source, key))
                target[key] = source[key];
        }
    });
    return target;
}
exports.assign = assign;
