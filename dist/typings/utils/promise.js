"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapSequence(array, fn) {
    var results = [];
    var promise = Promise.resolve();
    function next(member, i) {
        return Promise.resolve(fn(member)).then(function (value) { return (results[i] = value); });
    }
    var _loop_1 = function (i) {
        promise = promise.then(function () { return next(array[i], i); });
    };
    for (var i = 0; i < array.length; i += 1) {
        _loop_1(i);
    }
    return promise.then(function () { return results; });
}
exports.mapSequence = mapSequence;
function runSequence(array) {
    return mapSequence(array, function (i) { return i; });
}
exports.runSequence = runSequence;
