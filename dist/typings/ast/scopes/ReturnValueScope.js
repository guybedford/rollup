"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ParameterScope_1 = require("./ParameterScope");
var ReturnValueScope = /** @class */ (function (_super) {
    __extends(ReturnValueScope, _super);
    function ReturnValueScope(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, options) || this;
        _this._returnExpressions = new Set();
        return _this;
    }
    ReturnValueScope.prototype.addReturnExpression = function (expression) {
        this._returnExpressions.add(expression);
    };
    ReturnValueScope.prototype.forEachReturnExpressionWhenCalled = function (_callOptions, callback, options) {
        this._returnExpressions.forEach(callback(options));
    };
    ReturnValueScope.prototype.someReturnExpressionWhenCalled = function (_callOptions, predicateFunction, options) {
        return Array.from(this._returnExpressions).some(predicateFunction(options));
    };
    return ReturnValueScope;
}(ParameterScope_1.default));
exports.default = ReturnValueScope;
