"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Return the first non-null or -undefined result from an array of
// maybe-sync, maybe-promise-returning functions
function first(candidates) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return candidates.reduce(function (promise, candidate) {
            return promise.then(function (result) {
                return result != null ? result : Promise.resolve(candidate.apply(void 0, args));
            });
        }, Promise.resolve());
    };
}
exports.default = first;
