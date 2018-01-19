"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
exports.reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public'.split(' ');
var builtins = 'Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl'.split(' ');
var blacklisted = object_1.blank();
exports.reservedWords.concat(builtins).forEach(function (word) { return (blacklisted[word] = true); });
var illegalCharacters = /[^$_a-zA-Z0-9]/g;
var startsWithDigit = function (str) { return /\d/.test(str[0]); };
function isLegal(str) {
    if (startsWithDigit(str) || blacklisted[str]) {
        return false;
    }
    return !illegalCharacters.test(str);
}
exports.isLegal = isLegal;
function makeLegal(str) {
    str = str
        .replace(/-(\w)/g, function (_, letter) { return letter.toUpperCase(); })
        .replace(illegalCharacters, '_');
    if (startsWithDigit(str) || blacklisted[str])
        str = "_" + str;
    return str;
}
exports.makeLegal = makeLegal;
