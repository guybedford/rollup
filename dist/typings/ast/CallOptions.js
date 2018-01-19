"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallOptions = /** @class */ (function () {
    function CallOptions(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.withNew, withNew = _c === void 0 ? false : _c, _d = _b.args, args = _d === void 0 ? [] : _d, _e = _b.caller, caller = _e === void 0 ? undefined : _e;
        this.withNew = withNew;
        this.args = args;
        this.caller = caller;
    }
    CallOptions.create = function (callOptions) {
        return new this(callOptions);
    };
    CallOptions.prototype.equals = function (callOptions) {
        return callOptions && this.caller === callOptions.caller;
    };
    return CallOptions;
}());
exports.default = CallOptions;
